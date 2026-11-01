import pandas as pd
import numpy as np


def calc_ma(close: pd.Series, period: int) -> pd.Series:
    return close.rolling(window=period).mean()


def calc_ema(close: pd.Series, period: int) -> pd.Series:
    return close.ewm(span=period, adjust=False).mean()


def calc_macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> dict[str, pd.Series]:
    ema_fast = calc_ema(close, fast)
    ema_slow = calc_ema(close, slow)
    dif = ema_fast - ema_slow
    dea = calc_ema(dif, signal)
    macd_hist = (dif - dea) * 2
    return {"dif": dif, "dea": dea, "macd": macd_hist}


def calc_kdj(high: pd.Series, low: pd.Series, close: pd.Series, n: int = 9) -> dict[str, pd.Series]:
    lowest_low = low.rolling(window=n).min()
    highest_high = high.rolling(window=n).max()
    rsv = (close - lowest_low) / (highest_high - lowest_low) * 100
    rsv = rsv.fillna(50)

    k = pd.Series(np.nan, index=close.index, dtype=float)
    d = pd.Series(np.nan, index=close.index, dtype=float)
    k.iloc[0] = 50
    d.iloc[0] = 50

    for i in range(1, len(close)):
        k.iloc[i] = 2 / 3 * k.iloc[i - 1] + 1 / 3 * rsv.iloc[i]
        d.iloc[i] = 2 / 3 * d.iloc[i - 1] + 1 / 3 * k.iloc[i]

    j = 3 * k - 2 * d
    return {"k": k, "d": d, "j": j}


def calc_boll(close: pd.Series, period: int = 20, std_dev: int = 2) -> dict[str, pd.Series]:
    mid = close.rolling(window=period).mean()
    std = close.rolling(window=period).std()
    upper = mid + std_dev * std
    lower = mid - std_dev * std
    return {"upper": upper, "mid": mid, "lower": lower}


def calc_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.where(delta > 0, 0)
    loss = (-delta).where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def calculate_indicators(df: pd.DataFrame, indicators: list[str]) -> dict[str, list]:
    result: dict[str, list] = {"date": df["date"].tolist()}

    for ind in indicators:
        if ind.startswith("ma"):
            try:
                period = int(ind[2:])
                values = calc_ma(df["close"], period)
                result[ind] = [None if pd.isna(v) else round(v, 2) for v in values]
            except ValueError:
                pass

        elif ind == "macd":
            macd_data = calc_macd(df["close"])
            for key in ("dif", "dea", "macd"):
                result[key] = [None if pd.isna(v) else round(v, 3) for v in macd_data[key]]

        elif ind == "kdj":
            kdj_data = calc_kdj(df["high"], df["low"], df["close"])
            for key in ("k", "d", "j"):
                result[key] = [None if pd.isna(v) else round(v, 2) for v in kdj_data[key]]

        elif ind == "boll":
            boll_data = calc_boll(df["close"])
            for key in ("upper", "mid", "lower"):
                result[f"boll_{key}"] = [None if pd.isna(v) else round(v, 2) for v in boll_data[key]]

        elif ind.startswith("rsi"):
            try:
                period = int(ind[3:]) if len(ind) > 3 else 14
                values = calc_rsi(df["close"], period)
                result[ind] = [None if pd.isna(v) else round(v, 2) for v in values]
            except ValueError:
                pass

    return result
