import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const tools = [
  {
    key: 'compress',
    path: '/compress-pdf',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    color: 'bg-red-500',
  },
  {
    key: 'merge',
    path: '/merge-pdf',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: 'bg-blue-500',
  },
  {
    key: 'pdfToWord',
    path: '/pdf-to-word',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'bg-green-500',
  },
  {
    key: 'wordToPdf',
    path: '/word-to-pdf',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-purple-500',
  },
  {
    key: 'jpgToPdf',
    path: '/jpg-to-pdf',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-orange-500',
  },
]

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-surface-900 mb-6">
            {t('home.title')}
            <span className="block text-primary-500 mt-2">{t('home.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-surface-800/70 mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-accent-500/10 text-accent-500 rounded-full text-sm font-medium">
              ✓ {t('home.badge1')}
            </span>
            <span className="px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-sm font-medium">
              ✓ {t('home.badge2')}
            </span>
            <span className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
              ✓ {t('home.badge3')}
            </span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12 accent-line inline-block mx-auto">
            {t('home.toolsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {tools.map((tool, index) => (
              <Link
                key={tool.key}
                to={tool.path}
                className="tool-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {t(`tools.${tool.key}.name`)}
                </h3>
                <p className="text-surface-800/60 text-sm">
                  {t(`tools.${tool.key}.description`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-4">
            {t('home.whyTitle')}
          </h2>
          <p className="text-center text-surface-800/60 mb-12 max-w-2xl mx-auto">
            {t('home.whySubtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🆓</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{t('home.feature1Title')}</h3>
              <p className="text-surface-800/60 text-sm">{t('home.feature1Desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{t('home.feature2Title')}</h3>
              <p className="text-surface-800/60 text-sm">{t('home.feature2Desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{t('home.feature3Title')}</h3>
              <p className="text-surface-800/60 text-sm">{t('home.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section - Smallpdf Alternative */}
      <section className="py-16 px-4 bg-surface-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
            {t('home.seoTitle')}
          </h2>
          <p className="text-surface-200 mb-8">
            {t('home.seoDesc')}
          </p>
          <Link to="/compress-pdf" className="btn-primary inline-block">
            {t('home.cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
