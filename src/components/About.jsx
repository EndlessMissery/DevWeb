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

        {/* Top: text */}
        <div className={`about__top fade-up ${inView ? 'visible' : ''}`}>
          <span className="section-label">{a.label}</span>
          <h2 className="about__heading">
            {a.h1}
            {/* <br />{a.h2} */}
          </h2>
          <div className="about__body-col">
            <p className="about__body">{a.p1}</p>
            <p className="about__body">{a.p2}</p>
            <p className="about__body">{a.p3}</p>
          </div>
        </div>

        {/* Bottom: horizontal card row */}
        <div className="about__cards">
          <div className={`about__card fade-up d1 ${inView ? 'visible' : ''}`}>
            <span className="about__card-tag">{a.roleLabel}</span>
            <p className="about__card-title">Frontend Lead</p>
            <p className="about__card-sub">Pixacom Technology s.r.o.</p>
            <p className="about__card-date">12/2025 — {a.present}</p>
          </div>

          <div className={`about__card fade-up d2 ${inView ? 'visible' : ''}`}>
            <span className="about__card-tag">{a.prevRoleLabel}</span>
            <p className="about__card-title">Frontend Developer</p>
            <p className="about__card-sub">Pixacom Technology s.r.o.</p>
            <p className="about__card-date">07/2025 — 12/2025</p>
          </div>

          <div className={`about__card fade-up d3 ${inView ? 'visible' : ''}`}>
            <span className="about__card-tag">{a.eduLabel}</span>
            <p className="about__card-title">Bc. — Mezinárodní vztahy</p>
            <p className="about__card-sub">Univerzita Palackého, Olomouc</p>
            <p className="about__card-date">&nbsp;</p>
          </div>
        </div>

      </div>
    </section>
  )
}
