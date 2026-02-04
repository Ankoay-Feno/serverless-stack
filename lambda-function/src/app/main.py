from fastapi import FastAPI, Query
from mangum import Mangum

app = FastAPI()

# AWS Lambda pricing constants (USD) as of current common rates
REQUEST_PRICE_PER_MILLION = 0.20
GB_SECOND_PRICE = 0.0000166667


@app.get("/")
def read_root():
    return {"message": "hello from fastapi on lambda"}


@app.get("/cost")
def estimate_cost(
    memory_mb: int = Query(128, ge=128, le=10240),
    requests_per_month: int = Query(1000000, ge=0),
    avg_duration_ms: float = Query(100.0, ge=0.0),
    hours_month: float | None = Query(None, ge=0.0),
    cpu_note: str | None = Query(None),
):
    """
    Estimate Lambda cost based on memory + duration or total hours.

    If hours_month is provided, it is used to compute total GB-seconds:
      gb_seconds = hours_month * 3600 * (memory_mb / 1024)
    Otherwise:
      gb_seconds = requests_per_month * (avg_duration_ms/1000) * (memory_mb/1024)

    cpu_note is informational only; Lambda pricing is based on memory (CPU scales with memory).
    """

    memory_gb = memory_mb / 1024.0

    if hours_month is not None:
        gb_seconds = hours_month * 3600.0 * memory_gb
        duration_basis = "hours_month"
    else:
        gb_seconds = requests_per_month * (avg_duration_ms / 1000.0) * memory_gb
        duration_basis = "avg_duration_ms"

    duration_cost = gb_seconds * GB_SECOND_PRICE
    request_cost = (requests_per_month / 1_000_000.0) * REQUEST_PRICE_PER_MILLION
    total_cost = duration_cost + request_cost

    total_cost_usd_rounded = round(total_cost, 6)

    return {
        "inputs": {
            "memory_mb": memory_mb,
            "requests_per_month": requests_per_month,
            "avg_duration_ms": avg_duration_ms,
            "hours_month": hours_month,
            "cpu_note": cpu_note,
        },
        "pricing": {
            "gb_seconds": gb_seconds,
            "duration_cost_usd": duration_cost,
            "request_cost_usd": request_cost,
            "total_cost_usd": total_cost,
            "total_cost_usd_rounded": total_cost_usd_rounded,
            "basis": duration_basis,
        },
        "estimated_cost_text": f"Estimated monthly cost: ${total_cost_usd_rounded}",
        "notes": [
            "Lambda pricing is based on memory (CPU scales with memory).",
            "Free tier not included in this estimate.",
        ],
    }


handler = Mangum(app)
