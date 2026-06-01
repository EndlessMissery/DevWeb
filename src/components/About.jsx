import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import './About.css'

export default function About() {
  const [ref, inView] = useInView()
  const { t } = useLang()
  const a = t.about

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about__inner">
        <div className={`about__grid fade-up ${inView ? 'visible' : ''}`}>
          <div className="about__text">
            <span className="section-label">{a.label}</span>
            <h2 className="about__heading">
              {a.h1}<br />{a.h2}
            </h2>
            <p className="about__body">{a.p1}</p>
            <p className="about__body">{a.p2}</p>
            <p className="about__body">{a.p3}</p>
          </div>

          <div className="about__meta">
            <div className="about__card">
              <div className="about__card-label">{a.roleLabel}</div>
              <div className="about__card-title">Frontend Lead</div>
              <div className="about__card-sub">Pixacom Technology s.r.o.</div>
              <div className="about__card-date">12/2025 — {a.present}</div>
            </div>
            <div className="about__card">
              <div className="about__card-label">{a.prevRoleLabel}</div>
              <div className="about__card-title">Front-end Developer</div>
              <div className="about__card-sub">Pixacom Technology s.r.o.</div>
              <div className="about__card-date">07/2025 — 12/2025</div>
            </div>
            <div className="about__card">
              <div className="about__card-label">{a.eduLabel}</div>
              <div className="about__card-title">Bc. — Mezinárodní vztahy</div>
              <div className="about__card-sub">Univerzita Palackého, Olomouc</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
