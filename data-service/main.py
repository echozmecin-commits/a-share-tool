import socket

# 东财 API 通过 IPv6 连接会被拒绝，强制使用 IPv4
_original_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _original_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import stock, dragon_tiger, capital, screener

app = FastAPI(title="A股数据服务", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock.router)
app.include_router(dragon_tiger.router)
app.include_router(capital.router)
app.include_router(screener.router)


@app.get("/health")
def health():
    return {"status": "ok"}
