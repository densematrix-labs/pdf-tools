# PDF Tools

Free online PDF tools - A better alternative to Smallpdf.

🌐 **Live Demo**: https://pdf-tools.demo.densematrix.ai

## Features

- **Compress PDF** - Reduce file size while maintaining quality
- **Merge PDF** - Combine multiple PDFs into one
- **PDF to Word** - Convert PDF to editable Word document
- **Word to PDF** - Convert Word documents to PDF
- **JPG to PDF** - Convert images to PDF

## Why PDF Tools?

- ✅ **100% Free** - No subscriptions, no hidden fees
- ✅ **No Signup** - Use immediately without registration
- ✅ **No Watermarks** - Clean output files
- ✅ **No Limits** - Process unlimited files
- ✅ **Privacy First** - Files are processed securely and deleted automatically

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI
- **PDF Processing**: pdf-lib, pypdf, pdf2docx
- **Deployment**: Docker

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker

```bash
docker compose up -d
```

## Ports

- Frontend: 30080
- Backend: 30081

## License

MIT
