"""Test error response formats.

🔴 Critical: Ensure all error responses have properly serializable detail fields.
See 2026-02-06 lesson - never return [object Object] to frontend.
"""
import pytest
import io
from fastapi.testclient import TestClient


def test_400_error_detail_is_string(client: TestClient):
    """Verify 400 error detail is serializable string."""
    response = client.post(
        "/api/v1/convert/compress",
        files={"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    detail = data.get("detail")
    
    # Detail must be string or object with error/message field
    if isinstance(detail, dict):
        assert "error" in detail or "message" in detail, \
            f"Object detail must have 'error' or 'message' field: {detail}"
    else:
        assert isinstance(detail, str), f"detail must be string: {detail}"


def test_404_error_detail_format(client: TestClient):
    """Verify 404 error detail format."""
    response = client.get("/nonexistent/path/here")
    assert response.status_code == 404
    data = response.json()
    detail = data.get("detail")
    assert isinstance(detail, str), f"404 detail should be string: {detail}"


def test_error_detail_never_object_object(client: TestClient):
    """Ensure error responses never contain [object Object]."""
    # Test various error conditions
    error_cases = [
        # Invalid file type
        ("/api/v1/convert/compress", {"file": ("test.txt", io.BytesIO(b"x"), "text/plain")}),
        # Missing required file
        ("/api/v1/convert/merge", {"files": [("files", ("test1.pdf", io.BytesIO(b"x"), "application/pdf"))]}),
    ]
    
    for endpoint, files in error_cases:
        response = client.post(endpoint, files=files if files else None)
        text = response.text
        assert "[object Object]" not in text, f"Response contains [object Object]: {text}"
        assert "object Object" not in text, f"Response contains object Object: {text}"
