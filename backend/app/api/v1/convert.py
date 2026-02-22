import os
import tempfile
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pdf2docx import Converter
from docx import Document
from docx.shared import Inches
from pypdf import PdfReader, PdfWriter
from PIL import Image
import io

from app.metrics import conversion_total, file_size_bytes, TOOL_NAME

router = APIRouter()


@router.post("/pdf-to-word")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    """Convert PDF to Word document."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read uploaded file
        content = await file.read()
        file_size_bytes.labels(tool=TOOL_NAME, operation="pdf_to_word_input").observe(len(content))
        
        # Create temp files
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as pdf_file:
            pdf_file.write(content)
            pdf_path = pdf_file.name
        
        docx_path = pdf_path.replace('.pdf', '.docx')
        
        # Convert
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        # Record metrics
        conversion_total.labels(tool=TOOL_NAME, conversion_type="pdf_to_word", status="success").inc()
        
        # Return file
        response = FileResponse(
            docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=file.filename.replace('.pdf', '.docx')
        )
        
        # Cleanup
        os.unlink(pdf_path)
        # Note: docx_path will be cleaned up after response is sent
        
        return response
        
    except Exception as e:
        conversion_total.labels(tool=TOOL_NAME, conversion_type="pdf_to_word", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/word-to-pdf")
async def convert_word_to_pdf(file: UploadFile = File(...)):
    """Convert Word document to PDF."""
    if not file.filename.lower().endswith(('.doc', '.docx')):
        raise HTTPException(status_code=400, detail="File must be a Word document")
    
    try:
        # Read uploaded file
        content = await file.read()
        file_size_bytes.labels(tool=TOOL_NAME, operation="word_to_pdf_input").observe(len(content))
        
        # For now, return a simple error as word-to-pdf requires additional dependencies
        # In production, we would use libreoffice or a conversion service
        raise HTTPException(
            status_code=501,
            detail="Word to PDF conversion requires additional server setup. Please use the compress or merge tools instead."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        conversion_total.labels(tool=TOOL_NAME, conversion_type="word_to_pdf", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: Optional[str] = "medium"
):
    """Compress PDF file."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        content = await file.read()
        original_size = len(content)
        file_size_bytes.labels(tool=TOOL_NAME, operation="compress_input").observe(original_size)
        
        # Read PDF
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()
        
        # Copy pages with compression
        for page in reader.pages:
            writer.add_page(page)
        
        # Compress
        writer.add_metadata(reader.metadata or {})
        
        # Write to buffer
        output = io.BytesIO()
        writer.write(output)
        compressed_content = output.getvalue()
        
        compressed_size = len(compressed_content)
        file_size_bytes.labels(tool=TOOL_NAME, operation="compress_output").observe(compressed_size)
        
        # Record metrics
        conversion_total.labels(tool=TOOL_NAME, conversion_type="compress", status="success").inc()
        
        # Create temp file for response
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
            temp_file.write(compressed_content)
            temp_path = temp_file.name
        
        return FileResponse(
            temp_path,
            media_type="application/pdf",
            filename=file.filename.replace('.pdf', '-compressed.pdf'),
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
            }
        )
        
    except Exception as e:
        conversion_total.labels(tool=TOOL_NAME, conversion_type="compress", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    """Merge multiple PDF files."""
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files required")
    
    for f in files:
        if not f.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail=f"File {f.filename} is not a PDF")
    
    try:
        writer = PdfWriter()
        
        for f in files:
            content = await f.read()
            file_size_bytes.labels(tool=TOOL_NAME, operation="merge_input").observe(len(content))
            
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                writer.add_page(page)
        
        # Write merged PDF
        output = io.BytesIO()
        writer.write(output)
        merged_content = output.getvalue()
        
        file_size_bytes.labels(tool=TOOL_NAME, operation="merge_output").observe(len(merged_content))
        conversion_total.labels(tool=TOOL_NAME, conversion_type="merge", status="success").inc()
        
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
            temp_file.write(merged_content)
            temp_path = temp_file.name
        
        return FileResponse(
            temp_path,
            media_type="application/pdf",
            filename="merged.pdf"
        )
        
    except Exception as e:
        conversion_total.labels(tool=TOOL_NAME, conversion_type="merge", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))
