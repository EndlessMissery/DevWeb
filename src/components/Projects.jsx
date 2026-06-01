import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import './Projects.css'

export default function Projects() {
  const [ref, inView] = useInView()
  const { t } = useLang()
  const p = t.projects

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="projects__inner">
        <div className={`fade-up ${inView ? 'visible' : ''}`}>
          <span className="section-label">{p.label}</span>
          <h2 className="projects__heading">{p.heading}</h2>
          <p className="projects__sub">{p.sub}</p>
        </div>

        <div className="projects__grid">
          {p.items.map((proj, i) => (
            <div
              key={proj.name}
              className={`project-card fade-up ${inView ? 'visible' : ''} d${i + 2}`}
            >
              <div className="project-card__type">{proj.type}</div>
              <h3 className="project-card__name">{proj.name}</h3>
              <p className="project-card__tagline">{proj.tagline}</p>
              <p className="project-card__desc">{proj.desc}</p>
              <div className="project-card__stack">
                {proj.stack.map(s => (
                  <span key={s} className="stack-tag">{s}</span>
                ))}
              </div>
              <p className="project-card__nda">{p.nda}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
