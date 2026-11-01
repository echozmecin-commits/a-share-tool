from pydantic import BaseModel

class KlineItem(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    amount: float

class StockSearchResult(BaseModel):
    symbol: str
    name: str

class IndicatorResult(BaseModel):
    date: str
    values: dict[str, float | None]

class DragonTigerItem(BaseModel):
    symbol: str
    name: str
    reason: str
    buy_amount: float
    sell_amount: float
    net_amount: float

class DragonTigerSeat(BaseModel):
    seat_name: str
    buy_amount: float
    sell_amount: float
    net_amount: float
    type: str

class SectorFlowItem(BaseModel):
    sector: str
    main_net_inflow: float
    change_percent: float

class NorthFlowItem(BaseModel):
    date: str
    total_net_inflow: float
    sh_net_inflow: float
    sz_net_inflow: float

class NorthTopStockItem(BaseModel):
    symbol: str
    name: str
    share_count: float
    market_value: float
    change_from_prev: float
