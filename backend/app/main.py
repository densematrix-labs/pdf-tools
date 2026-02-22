import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from app.api.v1 import convert
from app.metrics import setup_metrics_middleware

app = FastAPI(
    title="PDF Tools API",
    description="Free PDF tools API - Smallpdf alternative",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics middleware
setup_metrics_middleware(app)

# Routes
app.include_router(convert.router, prefix="/api/v1/convert", tags=["convert"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "pdf-tools"}


@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "PDF Tools API",
        "version": "1.0.0",
        "description": "Free PDF tools - Smallpdf alternative",
    }
