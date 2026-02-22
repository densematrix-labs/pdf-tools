import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function PricingPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          {t('pricing.title')}
        </h1>
        <p className="text-xl text-surface-800/70 max-w-2xl mx-auto">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
              {t('pricing.recommended')}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">{t('pricing.freePlan.name')}</h2>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-surface-800/60">{t('pricing.forever')}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['feature1', 'feature2', 'feature3', 'feature4', 'feature5'].map(key => (
              <li key={key} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t(`pricing.freePlan.${key}`)}</span>
              </li>
            ))}
          </ul>
          <Link to="/compress-pdf" className="btn-primary w-full text-center block">
            {t('pricing.getStarted')}
          </Link>
        </div>

        {/* Comparison with Smallpdf */}
        <div className="bg-surface-50 rounded-2xl p-8 border border-surface-200">
          <h2 className="font-display text-2xl font-bold mb-2">{t('pricing.compare.title')}</h2>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold line-through text-surface-800/40">$15</span>
            <span className="text-surface-800/60">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['feature1', 'feature2', 'feature3', 'feature4', 'feature5'].map(key => (
              <li key={key} className="flex items-center gap-3 text-surface-800/60">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{t(`pricing.compare.${key}`)}</span>
              </li>
            ))}
          </ul>
          <div className="text-center text-surface-800/60 text-sm">
            {t('pricing.compare.why')}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-8">{t('pricing.faq.title')}</h2>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 border border-surface-200">
              <h3 className="font-medium mb-2">{t(`pricing.faq.q${i}`)}</h3>
              <p className="text-surface-800/70">{t(`pricing.faq.a${i}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
