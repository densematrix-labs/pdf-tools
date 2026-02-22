import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface LayoutProps {
  children: ReactNode
}

const tools = [
  { path: '/compress-pdf', key: 'compress' },
  { path: '/merge-pdf', key: 'merge' },
  { path: '/pdf-to-word', key: 'pdfToWord' },
  { path: '/word-to-pdf', key: 'wordToPdf' },
  { path: '/jpg-to-pdf', key: 'jpgToPdf' },
]

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-surface-900">PDF Tools</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {tools.slice(0, 3).map(tool => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === tool.path
                      ? 'text-primary-500'
                      : 'text-surface-800 hover:text-primary-500'
                  }`}
                >
                  {t(`tools.${tool.key}.name`)}
                </Link>
              ))}
              <Link
                to="/pricing"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/pricing'
                    ? 'text-primary-500'
                    : 'text-surface-800 hover:text-primary-500'
                }`}
              >
                {t('nav.pricing')}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-4">PDF Tools</h3>
              <p className="text-surface-200 text-sm">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('footer.tools')}</h4>
              <ul className="space-y-2 text-sm text-surface-200">
                {tools.map(tool => (
                  <li key={tool.path}>
                    <Link to={tool.path} className="hover:text-white transition-colors">
                      {t(`tools.${tool.key}.name`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-surface-200">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('footer.compare')}</h4>
              <ul className="space-y-2 text-sm text-surface-200">
                <li><span className="text-accent-500">Smallpdf Alternative</span></li>
                <li><span>iLovePDF Alternative</span></li>
                <li><span>Adobe Acrobat Alternative</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 mt-8 pt-8 text-center text-sm text-surface-200">
            © 2026 PDF Tools. {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  )
}
