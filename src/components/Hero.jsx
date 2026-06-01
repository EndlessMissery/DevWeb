import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import './Hero.css'

const TICKER_ITEMS = [
  'React Native 0.83', 'Firebase', 'Mapbox', 'SQLite', 'Apple MPC',
  'Offline-first', 'iOS & iPad', 'Frontend Lead', 'ZZS JMK', 'Pixacom Technology',
]

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className={`hero__content ${visible ? 'hero__content--visible' : ''}`}>
          <div className="hero__status">
            <span className="hero__status-dot" aria-hidden="true" />
            {t.hero.status}
          </div>
          <p className="hero__eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero__name">
            Roman<br />Kalita.
          </h1>
          <p className="hero__sub">
            {t.hero.sub1}<br className="hero__br" />
            {t.hero.sub2}
          </p>
          <div className="hero__cta">
            <a href="#smartzos" className="btn btn--filled">{t.hero.cta1}</a>
            <a href="#contact" className="btn btn--ghost">{t.hero.cta2}</a>
          </div>
        </div>

        <div className={`hero__scroll ${visible ? 'hero__scroll--visible' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="hero__ticker-item">
              {item}
              <span className="hero__ticker-sep">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
