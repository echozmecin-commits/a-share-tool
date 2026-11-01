from fastapi import APIRouter, Query
from services.akshare_service import get_dragon_tiger_list, get_limit_up_stocks
from datetime import datetime

router = APIRouter(prefix="/api", tags=["dragon-tiger"])


@router.get("/dragon-tiger/list")
def dragon_tiger_list(
    date: str = Query("", description="日期，如 2026-06-20，默认最近交易日"),
):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    return get_dragon_tiger_list(date)


@router.get("/limit-up/summary")
def limit_up_summary(
    date: str = Query("", description="日期"),
):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    stocks = get_limit_up_stocks(date)

    streak_dist: dict[int, int] = {}
    for s in stocks:
        days = s.get("streakDays", 1)
        if isinstance(days, (int, float)):
            days = int(days)
        else:
            days = 1
        streak_dist[days] = streak_dist.get(days, 0) + 1

    return {
        "limitUpCount": len(stocks),
        "streakDistribution": streak_dist,
        "stocks": stocks,
    }


@router.get("/limit-up/concepts")
def limit_up_concepts(
    date: str = Query("", description="日期"),
):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    stocks = get_limit_up_stocks(date)

    concepts: dict[str, list] = {}
    for s in stocks:
        concept = s.get("concept", "其他")
        if not concept:
            concept = "其他"
        if concept not in concepts:
            concepts[concept] = []
        concepts[concept].append({
            "symbol": s.get("symbol", ""),
            "name": s.get("name", ""),
            "streakDays": s.get("streakDays", 1),
        })

    result = [
        {"concept": k, "count": len(v), "stocks": v}
        for k, v in sorted(concepts.items(), key=lambda x: len(x[1]), reverse=True)
    ]
    return result


@router.get("/limit-up/streak")
def limit_up_streak(
    date: str = Query("", description="日期"),
):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    stocks = get_limit_up_stocks(date)

    tiers: dict[int, list] = {}
    for s in stocks:
        days = s.get("streakDays", 1)
        if isinstance(days, (int, float)):
            days = int(days)
        else:
            days = 1
        if days not in tiers:
            tiers[days] = []
        tiers[days].append(s)

    result = [
        {"streakDays": k, "count": len(v), "stocks": v}
        for k, v in sorted(tiers.items(), key=lambda x: x[0], reverse=True)
    ]
    return result
