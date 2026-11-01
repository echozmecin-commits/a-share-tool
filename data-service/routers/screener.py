from fastapi import APIRouter, Query
from services.screener import start_screen, get_task_status, cancel_task

router = APIRouter(prefix="/api/screener", tags=["screener"])


@router.post("/start")
def start():
    task_id = start_screen()
    return {"taskId": task_id}


@router.get("/status")
def status(task_id: str = Query(...)):
    result = get_task_status(task_id)
    if result is None:
        return {"error": "task not found"}
    return result


@router.post("/cancel")
def cancel(task_id: str = Query(...)):
    ok = cancel_task(task_id)
    return {"success": ok}
