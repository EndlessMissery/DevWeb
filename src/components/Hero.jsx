import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import './Hero.css'

const TICKER_ITEMS = [
  'React Native', 'React.js', 'JavaScript', 'Firebase', 'Mapbox', 'Apple MPC',
  'iOS & iPad', 'Frontend Developer'
]

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className={`hero__content ${visible ? 'hero__content--in' : ''}`}>

          {/* Status line */}
          <div>
            <div className="hero__status">
              <span className="hero__dot" aria-hidden="true" />
              <span>{t.hero.status}</span>
            </div>
          </div>
          
          {/* The name — full width, editorial */}
          <h1 className="hero__name">
            <span className="hero__name-line">Roman</span>
            <span className="hero__name-line">Kalita<span className="hero__period">.</span></span>
          </h1>

          {/* Info row */}
          <div className="hero__meta">
            <span className="hero__meta-item">Frontend Developer</span>
            <span className="hero__meta-div" aria-hidden="true" />
            <span className="hero__meta-item">ReactJS · Web</span>
            <span className="hero__meta-div" aria-hidden="true" />
            <span className="hero__meta-item">React Native · iOS</span>
          </div>

          <p className="hero__sub">{t.hero.sub1}</p>

          <div className="hero__cta">
            <a href="#work" className="btn btn--filled">{t.hero.cta1}</a>
            <a href="#contact" className="btn btn--ghost">{t.hero.cta2}</a>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="hero__ticker-item">
              {item}<span className="hero__ticker-sep">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
