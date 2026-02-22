import pytest
import io
from fastapi.testclient import TestClient


def test_compress_pdf_success(client: TestClient, sample_pdf_content: bytes):
    """Test PDF compression endpoint."""
    response = client.post(
        "/api/v1/convert/compress",
        files={"file": ("test.pdf", io.BytesIO(sample_pdf_content), "application/pdf")}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"


def test_compress_pdf_invalid_file_type(client: TestClient):
    """Test compression rejects non-PDF files."""
    response = client.post(
        "/api/v1/convert/compress",
        files={"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_merge_pdfs_success(client: TestClient, sample_pdf_content: bytes):
    """Test PDF merge endpoint."""
    response = client.post(
        "/api/v1/convert/merge",
        files=[
            ("files", ("test1.pdf", io.BytesIO(sample_pdf_content), "application/pdf")),
            ("files", ("test2.pdf", io.BytesIO(sample_pdf_content), "application/pdf")),
        ]
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"


def test_merge_pdfs_requires_two_files(client: TestClient, sample_pdf_content: bytes):
    """Test merge requires at least 2 files."""
    response = client.post(
        "/api/v1/convert/merge",
        files=[
            ("files", ("test1.pdf", io.BytesIO(sample_pdf_content), "application/pdf")),
        ]
    )
    assert response.status_code == 400
    assert "2" in response.json()["detail"]


def test_pdf_to_word_invalid_file(client: TestClient):
    """Test PDF to Word rejects non-PDF files."""
    response = client.post(
        "/api/v1/convert/pdf-to-word",
        files={"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_word_to_pdf_invalid_file(client: TestClient):
    """Test Word to PDF rejects non-Word files."""
    response = client.post(
        "/api/v1/convert/word-to-pdf",
        files={"file": ("test.pdf", io.BytesIO(b"hello"), "application/pdf")}
    )
    assert response.status_code == 400
    assert "Word" in response.json()["detail"]
