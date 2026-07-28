import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import dt1 from '../assets/DT1.png'
import dt2 from '../assets/DT2.png'
import dt3 from '../assets/DT3.png'
import dt4 from '../assets/DT4.png'
import dt5 from '../assets/DT5.png'
import dt6 from '../assets/DT6.png'
import './PersonalProjects.css'

const SCREENSHOTS = [dt1, dt2, dt3, dt4, dt5, dt6]

export default function PersonalProjects() {
  const [ref, inView] = useInView()
  const { t } = useLang()
  const p = t.personalProjects
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive(a => (a + 1) % SCREENSHOTS.length)
      if (e.key === 'ArrowLeft') setActive(a => (a - 1 + SCREENSHOTS.length) % SCREENSHOTS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <section className="personal-projects" id="personal-projects" ref={ref}>
      <div className="personal-projects__inner">
        <div className={`fade-up ${inView ? 'visible' : ''}`}>
          <span className="section-label">{p.label}</span>
          <h2 className="personal-projects__heading">{p.heading}</h2>
          <p className="personal-projects__sub">{p.sub}</p>
        </div>

        <div className={`pp-card fade-up d2 ${inView ? 'visible' : ''}`}>
          <div className="pp-card__type">{p.item.type}</div>
          <h3 className="pp-card__name">{p.item.name}</h3>
          <p className="pp-card__tagline">{p.item.tagline}</p>
          <p className="pp-card__desc">{p.item.desc}</p>
          <div className="pp-card__stack">
            {p.item.stack.map(s => (
              <span key={s} className="stack-tag">{s}</span>
            ))}
          </div>

          <div className="pp-gallery">
            {SCREENSHOTS.map((src, i) => (
              <button
                key={src}
                className="pp-gallery__thumb"
                onClick={() => setActive(i)}
                aria-label={`Screenshot ${i + 1}`}
              >
                <img src={src} alt={`${p.item.name} screenshot ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {active !== null && (
        <div className="pp-lightbox" onClick={() => setActive(null)}>
          <button className="pp-lightbox__close" onClick={() => setActive(null)} aria-label="Close">✕</button>
          <button
            className="pp-lightbox__nav pp-lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); setActive(a => (a - 1 + SCREENSHOTS.length) % SCREENSHOTS.length) }}
            aria-label="Previous"
          >‹</button>
          <img
            src={SCREENSHOTS[active]}
            alt={`${p.item.name} screenshot ${active + 1}`}
            className="pp-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="pp-lightbox__nav pp-lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); setActive(a => (a + 1) % SCREENSHOTS.length) }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </section>
  )
}
