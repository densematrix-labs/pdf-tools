import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'

const CompressPdf = lazy(() => import('./pages/CompressPdf'))
const MergePdf = lazy(() => import('./pages/MergePdf'))
const PdfToWord = lazy(() => import('./pages/PdfToWord'))
const WordToPdf = lazy(() => import('./pages/WordToPdf'))
const JpgToPdf = lazy(() => import('./pages/JpgToPdf'))
const PricingPage = lazy(() => import('./pages/PricingPage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="loading-spinner"></div>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
