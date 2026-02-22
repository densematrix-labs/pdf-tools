import time
import os
from fastapi import FastAPI, Request
from prometheus_client import Counter, Histogram

TOOL_NAME = os.getenv("TOOL_NAME", "pdf-tools")

# HTTP Metrics
http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["tool", "endpoint", "method", "status"]
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["tool", "endpoint", "method"],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Business Metrics
conversion_total = Counter(
    "conversion_total",
    "Total file conversions",
    ["tool", "conversion_type", "status"]
)

file_size_bytes = Histogram(
    "file_size_bytes",
    "File size in bytes",
    ["tool", "operation"],
    buckets=[1024, 10240, 102400, 1048576, 10485760, 104857600]
)

# Bot detection
BOT_PATTERNS = ["Googlebot", "bingbot", "Baiduspider", "YandexBot", "DuckDuckBot"]
crawler_visits_total = Counter(
    "crawler_visits_total",
    "Crawler/bot visits",
    ["tool", "bot"]
)


def setup_metrics_middleware(app: FastAPI):
    """Add metrics middleware to FastAPI app."""
    
    @app.middleware("http")
    async def metrics_middleware(request: Request, call_next):
        # Track request start
        start_time = time.time()
        
        # Check for bots
        ua = request.headers.get("user-agent", "")
        for bot in BOT_PATTERNS:
            if bot.lower() in ua.lower():
                crawler_visits_total.labels(tool=TOOL_NAME, bot=bot).inc()
                break
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Record metrics
        endpoint = request.url.path
        method = request.method
        status = response.status_code
        
        http_requests_total.labels(
            tool=TOOL_NAME,
            endpoint=endpoint,
            method=method,
            status=status
        ).inc()
        
        http_request_duration_seconds.labels(
            tool=TOOL_NAME,
            endpoint=endpoint,
            method=method
        ).observe(duration)
        
        return response
