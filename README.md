# A 股数据工具

一个 Next.js 前端 + FastAPI 数据服务的 A 股看板原型，覆盖市场概览、K 线、资金流向、龙虎榜/涨停复盘和智能选股。

> 仅为个人学习/产品原型，不构成投资建议。

## 功能

- **市场概览**：指数行情、涨停/跌停概况、成交额等
- **K 线**：股票搜索、日/周/月 K 线、MACD 和指标面板
- **资金流向**：北向资金趋势、行业/个股资金流、热力图
- **龙虎榜 & 涨停复盘**：龙虎榜列表、涨停梯队、概念分布
- **智能选股**：按条件筛选，支持异步任务和进度查询

## 技术栈

- 前端：Next.js 16、React 19、TypeScript、Tailwind CSS、lightweight-charts、Recharts、lucide-react
- 数据服务：FastAPI、uvicorn、akshare、pandas、numpy、apscheduler
- 前端通过 Next.js 的 `/api/*` 路由代理到 Python 服务，默认 `http://localhost:8000`

## 运行

### 1. 起数据服务

```bash
cd data-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. 起前端

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

如果 Python 服务不在 `localhost:8000`，设置环境变量：

```bash
NEXT_PUBLIC_PYTHON_API=http://你的地址:端口 npm run dev
```

## 目录

- `app/`：Next.js 页面和 API 代理路由
- `components/`：K 线、资金流、龙虎榜、选股等组件
- `lib/`：前端 API client、类型和工具函数
- `data-service/`：FastAPI 服务，`routers/` 是按业务拆的路由，`services/` 里封装 akshare 取数和指标计算
- `public/`：静态资源

## 说明

数据来自 akshare 的公开接口，受上游数据源影响，可能延迟、限流或偶发取不到；这不是实盘交易系统，也没有做完整的鉴权和缓存治理，适合作为产品原型演示。
