import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health endpoint returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "pdf-tools"


def test_root_endpoint(client: TestClient):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "PDF Tools API"
    assert "version" in data


def test_metrics_endpoint(client: TestClient):
    """Test metrics endpoint returns prometheus format."""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text


def test_404_not_found(client: TestClient):
    """Test non-existent endpoint returns 404."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
