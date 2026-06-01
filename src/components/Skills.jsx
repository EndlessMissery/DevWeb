import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import './Skills.css'

export default function Skills() {
  const [ref, inView] = useInView()
  const { t } = useLang()
  const s = t.skills

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills__inner">
        <div className={`fade-up ${inView ? 'visible' : ''}`}>
          <span className="section-label">{s.label}</span>
          <h2 className="skills__heading">{s.heading}</h2>
        </div>

        <div className="skills__groups">
          {s.groups.map((g, i) => (
            <div
              key={g.label}
              className={`skills__group fade-up ${inView ? 'visible' : ''} d${i + 1}`}
            >
              <div className="skills__group-label">{g.label}</div>
              <div className="skills__tags">
                {g.skills.map(skill => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
