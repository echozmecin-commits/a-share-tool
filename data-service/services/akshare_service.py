import akshare as ak
import pandas as pd
from functools import lru_cache
from datetime import datetime, timedelta


PERIOD_MAP = {
    "daily": "daily",
    "weekly": "weekly",
    "monthly": "monthly",
}

MINUTE_MAP = {
    "5": "5",
    "15": "15",
    "30": "30",
    "60": "60",
}


def get_stock_kline(symbol: str, period: str = "daily", start_date: str = "", adjust: str = "qfq") -> list[dict]:
    try:
        if period in MINUTE_MAP:
            df = ak.stock_zh_a_minute(symbol=symbol, period=MINUTE_MAP[period])
            if df.empty:
                return []
            df.columns = ["date", "open", "high", "low", "close", "volume"]
            df["amount"] = 0
        else:
            if not start_date:
                start_date = (datetime.now() - timedelta(days=365)).strftime("%Y%m%d")
            else:
                start_date = start_date.replace("-", "")

            df = ak.stock_zh_a_hist(
                symbol=symbol,
                period=PERIOD_MAP.get(period, "daily"),
                start_date=start_date,
                adjust=adjust,
            )
            if df.empty:
                return []
            df = df.rename(columns={
                "日期": "date",
                "开盘": "open",
                "收盘": "close",
                "最高": "high",
                "最低": "low",
                "成交量": "volume",
                "成交额": "amount",
            })

        df = df[["date", "open", "high", "low", "close", "volume", "amount"]]
        for col in ["open", "high", "low", "close"]:
            df[col] = pd.to_numeric(df[col], errors="coerce")
        df["volume"] = pd.to_numeric(df["volume"], errors="coerce")
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
        df["date"] = df["date"].astype(str)

        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching kline for {symbol}: {e}")
        return []


def search_stock(keyword: str) -> list[dict]:
    try:
        df = ak.stock_zh_a_spot_em()
        if df.empty:
            return []
        df = df.rename(columns={"代码": "symbol", "名称": "name"})
        mask = df["symbol"].str.contains(keyword) | df["name"].str.contains(keyword)
        results = df.loc[mask, ["symbol", "name"]].head(20)
        return results.to_dict(orient="records")
    except Exception as e:
        print(f"Error searching stock: {e}")
        return []


def get_index_quotes() -> list[dict]:
    try:
        indices = {
            "sh000001": "上证指数",
            "sz399001": "深证成指",
            "sz399006": "创业板指",
            "sh000688": "科创50",
        }
        df = ak.stock_zh_index_spot_em()
        if df.empty:
            return []
        df = df.rename(columns={
            "代码": "symbol",
            "名称": "name",
            "最新价": "price",
            "涨跌额": "change",
            "涨跌幅": "changePercent",
        })
        target_codes = ["000001", "399001", "399006", "000688"]
        df = df[df["symbol"].isin(target_codes)]
        return df[["symbol", "name", "price", "change", "changePercent"]].to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching index quotes: {e}")
        return []


def get_dragon_tiger_list(date: str) -> list[dict]:
    try:
        date_str = date.replace("-", "")
        df = ak.stock_lhb_detail_em(start_date=date_str, end_date=date_str)
        if df.empty:
            return []
        df = df.rename(columns={
            "代码": "symbol",
            "名称": "name",
            "解读": "reason",
            "龙虎榜买入额": "buyAmount",
            "龙虎榜卖出额": "sellAmount",
            "龙虎榜净买额": "netAmount",
        })
        cols = ["symbol", "name", "reason", "buyAmount", "sellAmount", "netAmount"]
        available_cols = [c for c in cols if c in df.columns]
        return df[available_cols].to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching dragon tiger list: {e}")
        return []


def get_limit_up_stocks(date: str) -> list[dict]:
    try:
        date_str = date.replace("-", "")
        df = ak.stock_zt_pool_em(date=date_str)
        if df.empty:
            return []
        df = df.rename(columns={
            "代码": "symbol",
            "名称": "name",
            "最新价": "price",
            "涨跌幅": "changePercent",
            "所属行业": "concept",
            "连板数": "streakDays",
            "首次封板时间": "firstLimitTime",
            "最后封板时间": "lastLimitTime",
        })
        cols = ["symbol", "name", "price", "changePercent", "concept", "streakDays", "firstLimitTime", "lastLimitTime"]
        available_cols = [c for c in cols if c in df.columns]
        return df[available_cols].to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching limit up stocks: {e}")
        return []


def get_sector_capital_flow(dimension: str = "industry") -> list[dict]:
    try:
        if dimension == "concept":
            df = ak.stock_sector_fund_flow_rank(indicator="今日", sector_type="概念资金流")
        else:
            df = ak.stock_sector_fund_flow_rank(indicator="今日", sector_type="行业资金流")

        if df.empty:
            return []
        df = df.rename(columns={
            "名称": "sector",
            "主力净流入-净额": "mainNetInflow",
            "今日涨跌幅": "changePercent",
        })
        cols = ["sector", "mainNetInflow", "changePercent"]
        available_cols = [c for c in cols if c in df.columns]
        return df[available_cols].head(30).to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching sector flow: {e}")
        return []


def get_stock_capital_flow(top: int = 20) -> list[dict]:
    try:
        df = ak.stock_individual_fund_flow_rank(indicator="今日排行")
        if df.empty:
            return []
        df = df.rename(columns={
            "代码": "symbol",
            "名称": "name",
            "最新价": "price",
            "今日涨跌幅": "changePercent",
            "主力净流入-净额": "mainNetInflow",
        })
        cols = ["symbol", "name", "price", "changePercent", "mainNetInflow"]
        available_cols = [c for c in cols if c in df.columns]
        return df[available_cols].head(top).to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching stock capital flow: {e}")
        return []


def get_north_flow_realtime() -> dict:
    try:
        df = ak.stock_hsgt_north_net_flow_in_em(symbol="北上")
        if df.empty:
            return {}
        latest = df.iloc[-1]
        return {
            "date": str(latest.get("日期", "")),
            "totalNetInflow": float(latest.get("当日净流入", 0)),
        }
    except Exception as e:
        print(f"Error fetching north flow: {e}")
        return {}


def get_north_flow_history(days: int = 30) -> list[dict]:
    try:
        df = ak.stock_hsgt_north_net_flow_in_em(symbol="北上")
        if df.empty:
            return []
        df = df.tail(days)
        df = df.rename(columns={
            "日期": "date",
            "当日净流入": "totalNetInflow",
        })
        df["date"] = df["date"].astype(str)
        return df[["date", "totalNetInflow"]].to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching north flow history: {e}")
        return []


def get_north_top_stocks() -> list[dict]:
    try:
        df = ak.stock_hsgt_hold_stock_em(market="北向", indicator="今日排行")
        if df.empty:
            return []
        df = df.rename(columns={
            "代码": "symbol",
            "名称": "name",
            "持股数量": "shareCount",
            "持股市值": "marketValue",
            "持股数量变化": "changeFromPrev",
        })
        cols = ["symbol", "name", "shareCount", "marketValue", "changeFromPrev"]
        available_cols = [c for c in cols if c in df.columns]
        return df[available_cols].head(10).to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching north top stocks: {e}")
        return []
