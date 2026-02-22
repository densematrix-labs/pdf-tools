# PDF Tools — Smallpdf Alternative

## 竞品分析

| 项目 | 值 |
|------|-----|
| 竞品 | Smallpdf |
| URL | https://smallpdf.com |
| 月流量 | 约 50M+ |
| 定价 | Free (限制) / Pro $15/月 / Team $12/月/用户 |
| 目标用户 | 个人、学生、企业用户需要处理 PDF 的场景 |

## 核心功能（我们要做的）

### 必做（Core）
1. **Compress PDF** — 压缩 PDF 文件大小，减少 50-70%
2. **PDF to Word** — 将 PDF 转换为可编辑的 Word 文档
3. **Merge PDF** — 合并多个 PDF 文件为一个
4. **Word to PDF** — 将 Word 文档转换为 PDF
5. **JPG to PDF** — 将图片转换为 PDF

### 可选（Nice to have - v2）
6. **Split PDF** — 拆分 PDF 为多个文件
7. **Edit PDF** — 添加文字、图片、注释
8. **Sign PDF** — 电子签名
9. **AI Chat with PDF** — AI 问答

## 差异化定位

我们的优势：
- ✅ **100% 免费** — 无需付费订阅，无每日限制
- ✅ **无需注册** — 直接使用，无需创建账号
- ✅ **无自动续费陷阱** — 用户痛点 #1 解决
- ✅ **本地处理** — 使用 WebAssembly 在浏览器端处理，更安全
- ✅ **开源透明** — 用户可验证代码安全性

## 用户痛点（我们要解决的）

| 痛点 | 来源 | 频率 | 我们的方案 |
|------|------|------|-----------|
| 订阅陷阱/自动续费 | Reddit r/pdf, r/smallpdf | 高 | 完全免费，无订阅 |
| 退款困难 | G2, Reddit | 高 | 不收费，无需退款 |
| 免费版限制多 | G2 reviews | 中 | 无限制使用 |
| 价格贵 ($120+/年) | Reddit, G2 | 高 | 100% 免费 |
| 功能有限（如无法复制文本） | Reddit | 中 | 使用成熟的 PDF 库 |

## 截流关键词

### Primary（首页 SEO - Title/H1）
- `smallpdf alternative`
- `smallpdf free alternative`
- `free pdf tools online`

### Secondary（独立页面）
- `smallpdf vs ilovepdf`
- `best smallpdf alternatives 2026`
- `free pdf compressor online`
- `free pdf to word converter`

### Long-tail（Programmatic SEO）
- `smallpdf alternative no signup`
- `smallpdf alternative free unlimited`
- `smallpdf alternative no watermark`
- `free pdf merge online no limit`
- `compress pdf free no sign up`
- `pdf to word converter free online`
- `merge pdf files free online`

## 技术方案

### 前端
- **框架**: React + Vite (TypeScript)
- **UI**: Tailwind CSS + 自定义设计系统
- **PDF 处理**: 
  - `pdf-lib` (纯 JS，支持合并、压缩、基本编辑)
  - `pdfjs-dist` (PDF 预览)
  - `mammoth.js` (Word 转换)

### 后端
- **框架**: Python FastAPI
- **PDF 处理**:
  - `pypdf` / `PyPDF2` (合并、拆分、压缩)
  - `pdf2docx` (PDF to Word)
  - `python-docx` (Word to PDF)
  - `Pillow` (图片处理)

### 部署
- Docker → langsheng (39.109.116.180)
- 域名: `pdf-tools.demo.densematrix.ai`
- 端口: Frontend 30080, Backend 30081

## 完成标准
- [x] Step 3: GitHub Repo 创建
- [x] Step 3.5: 端口分配 (30080/30081)
- [ ] 核心功能可用（5 个工具）
- [ ] 部署到 https://pdf-tools.demo.densematrix.ai
- [ ] SEO 截流关键词已覆盖
- [ ] i18n 7 种语言
- [ ] Health check 通过
