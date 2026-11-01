from fastapi import APIRouter, Query
from services.akshare_service import get_stock_kline, search_stock, get_index_quotes
from services.indicator import calculate_indicators
import pandas as pd

router = APIRouter(prefix="/api/stock", tags=["stock"])


@router.get("/kline")
def kline(
    symbol: str = Query(..., description="股票代码，如 600519"),
    period: str = Query("daily", description="周期: daily/weekly/monthly/5/15/30/60"),
    start: str = Query("", description="开始日期，如 2025-01-01"),
):
    data = get_stock_kline(symbol, period, start)
    return data


@router.get("/search")
def search(keyword: str = Query(..., description="搜索关键词")):
    return search_stock(keyword)


@router.get("/quote")
def quote(type: str = Query("index", description="quote type")):
    if type == "index":
        return get_index_quotes()
    return []


@router.get("/indicators")
def indicators(
    symbol: str = Query(...),
    period: str = Query("daily"),
    indicators: str = Query("ma5,ma10,ma20,macd", description="逗号分隔的指标列表"),
    start: str = Query(""),
):
    kline_data = get_stock_kline(symbol, period, start)
    if not kline_data:
        return {}
    df = pd.DataFrame(kline_data)
    indicator_list = [i.strip() for i in indicators.split(",")]
    return calculate_indicators(df, indicator_list)
