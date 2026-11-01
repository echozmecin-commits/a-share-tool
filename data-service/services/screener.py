import akshare as ak
import pandas as pd
import threading
import uuid
from datetime import datetime, timedelta
from services.indicator import calc_ma

AI_CONCEPTS = [
    "人工智能", "AIGC概念", "算力概念", "CPO概念", "机器人概念", "AI应用",
    "AI眼镜", "AI手机", "AI PC", "AI芯片", "AI Agent概念",
    "数据要素", "大数据", "云计算", "边缘计算",
    "光模块", "液冷概念", "数据中心", "服务器",
    "自动驾驶", "无人驾驶", "智能座舱",
    "脑机接口", "虚拟现实", "混合现实", "数字经济",
    "智能制造", "工业互联网", "物联网",
    "卫星互联网", "6G概念", "量子计算",
]

_tasks: dict[str, dict] = {}


def get_ai_concept_stocks() -> list[dict]:
    all_stocks: dict[str, dict] = {}
    for concept in AI_CONCEPTS:
        try:
            df = ak.stock_board_concept_cons_em(symbol=concept)
            if df.empty:
                continue
            df = df.rename(columns={"代码": "symbol", "名称": "name"})
            for _, row in df[["symbol", "name"]].iterrows():
                sym = str(row["symbol"])
                if sym not in all_stocks:
                    all_stocks[sym] = {
                        "symbol": sym,
                        "name": row["name"],
                        "concepts": [concept],
                    }
                else:
                    all_stocks[sym]["concepts"].append(concept)
        except Exception as e:
            print(f"Error fetching concept {concept}: {e}")
    return list(all_stocks.values())


def _to_sina_symbol(symbol: str) -> str:
    if symbol.startswith(("6", "5")):
        return f"sh{symbol}"
    return f"sz{symbol}"


def check_stock(symbol: str) -> dict | None:
    try:
        start_date = (datetime.now() - timedelta(days=200)).strftime("%Y%m%d")
        end_date = datetime.now().strftime("%Y%m%d")
        sina_symbol = _to_sina_symbol(symbol)
        df = ak.stock_zh_a_daily(
            symbol=sina_symbol, start_date=start_date, end_date=end_date, adjust="qfq"
        )
        if df.empty or len(df) < 89:
            return None

        for col in ["open", "high", "low", "close", "volume", "amount"]:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        ma5 = calc_ma(df["close"], 5)
        ma10 = calc_ma(df["close"], 10)
        ma21 = calc_ma(df["close"], 21)
        ma34 = calc_ma(df["close"], 34)
        ma54 = calc_ma(df["close"], 54)
        ma89 = calc_ma(df["close"], 89)

        last = len(df) - 1
        v5, v10, v21, v34, v54, v89 = (
            ma5.iloc[last], ma10.iloc[last], ma21.iloc[last],
            ma34.iloc[last], ma54.iloc[last], ma89.iloc[last],
        )

        if pd.isna(v89):
            return None
        if not (v5 > v10 > v21 > v34 > v54 > v89):
            return None

        # 条件1: 均线多头向上——每条均线今天的值 > 昨天的值
        for ma in [ma5, ma10, ma21, ma34, ma54, ma89]:
            if ma.iloc[last] <= ma.iloc[last - 1]:
                return None

        vol_today = df["volume"].iloc[last]
        vol_yesterday = df["volume"].iloc[last - 1]

        return {
            "price": round(float(df["close"].iloc[last]), 2),
            "changePercent": round(
                (float(df["close"].iloc[last]) / float(df["close"].iloc[last - 1]) - 1) * 100, 2
            ),
            "ma5": round(float(v5), 2),
            "ma10": round(float(v10), 2),
            "ma21": round(float(v21), 2),
            "ma34": round(float(v34), 2),
            "ma54": round(float(v54), 2),
            "ma89": round(float(v89), 2),
            "volume": int(vol_today),
            "volRatio": round(float(vol_today / vol_yesterday), 2) if vol_yesterday > 0 else 0,
        }
    except Exception as e:
        print(f"Error checking {symbol}: {e}")
        return None


def get_all_a_stocks() -> list[dict]:
    try:
        df = ak.stock_info_a_code_name()
        if df.empty:
            return []
        df = df.rename(columns={"code": "symbol", "name": "name"})
        stocks = df[["symbol", "name"]].to_dict(orient="records")
        return [
            s for s in stocks
            if not str(s["name"]).startswith(("ST", "*ST", "退市"))
            and not str(s["symbol"]).startswith(("8", "9"))
        ]
    except Exception as e:
        print(f"Error fetching all A stocks: {e}")
        return []


def run_screen_task(task_id: str):
    task = _tasks[task_id]
    task["status"] = "fetching_stocks"

    candidates = get_all_a_stocks()
    task["total"] = len(candidates)
    task["status"] = "scanning"

    for i, stock in enumerate(candidates):
        if task.get("cancelled"):
            task["status"] = "cancelled"
            return

        task["scanned"] = i + 1
        task["currentStock"] = f"{stock['name']}({stock['symbol']})"

        result = check_stock(stock["symbol"])
        if result:
            task["results"].append({
                "symbol": stock["symbol"],
                "name": stock["name"],
                **result,
            })
            task["found"] = len(task["results"])

    task["status"] = "done"


def start_screen() -> str:
    task_id = str(uuid.uuid4())[:8]
    _tasks[task_id] = {
        "status": "pending",
        "total": 0,
        "scanned": 0,
        "found": 0,
        "results": [],
        "currentStock": "",
        "cancelled": False,
    }
    thread = threading.Thread(target=run_screen_task, args=(task_id,), daemon=True)
    thread.start()
    return task_id


def get_task_status(task_id: str) -> dict | None:
    return _tasks.get(task_id)


def cancel_task(task_id: str) -> bool:
    task = _tasks.get(task_id)
    if task and task["status"] not in ("done", "cancelled"):
        task["cancelled"] = True
        return True
    return False
