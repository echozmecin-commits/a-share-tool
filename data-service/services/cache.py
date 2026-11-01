import time
from typing import Any

_cache: dict[str, tuple[Any, float]] = {}


def get_cached(key: str, ttl: int = 300) -> Any | None:
    if key in _cache:
        value, ts = _cache[key]
        if time.time() - ts < ttl:
            return value
        del _cache[key]
    return None


def set_cached(key: str, value: Any) -> None:
    _cache[key] = (value, time.time())


def cache_result(key: str, ttl: int = 300):
    def decorator(func):
        def wrapper(*args, **kwargs):
            cache_key = f"{key}:{args}:{kwargs}"
            cached = get_cached(cache_key, ttl)
            if cached is not None:
                return cached
            result = func(*args, **kwargs)
            set_cached(cache_key, result)
            return result
        return wrapper
    return decorator
