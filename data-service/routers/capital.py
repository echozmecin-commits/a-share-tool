from fastapi import APIRouter, Query
from services.akshare_service import (
    get_sector_capital_flow,
    get_stock_capital_flow,
    get_north_flow_realtime,
    get_north_flow_history,
    get_north_top_stocks,
)

router = APIRouter(prefix="/api/capital", tags=["capital"])


@router.get("/sector-flow")
def sector_flow(
    dimension: str = Query("industry", description="industry 或 concept"),
):
    return get_sector_capital_flow(dimension)


@router.get("/stock-flow")
def stock_flow(
    top: int = Query(20, description="返回前 N 个"),
):
    return get_stock_capital_flow(top)


@router.get("/north")
def north_flow():
    return get_north_flow_realtime()


@router.get("/north/history")
def north_history(
    days: int = Query(30, description="历史天数"),
):
    return get_north_flow_history(days)


@router.get("/north/top10")
def north_top10():
    return get_north_top_stocks()
