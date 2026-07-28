import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import ContactForm from './ContactForm'
import './Contact.css'

export default function Contact() {
  const [ref, inView] = useInView()
  const { t } = useLang()
  const c = t.contact

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__inner">
        <div className="contact__columns">
          <div className={`contact__content fade-up ${inView ? 'visible' : ''}`}>
            <span className="section-label">{c.label}</span>

            <h2 className="contact__heading">{c.heading}</h2>

            <p className="contact__sub">{c.sub}</p>

            <a href="mailto:romankalita010@gmail.com" className="contact__email">
              romankalita010@gmail.com
            </a>

            <div className="contact__links">
              <a
                href="https://www.linkedin.com/in/roman-kalita-600643323"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__link"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="4" cy="4" r="2"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                LinkedIn
              </a>
              <a href="tel:+420773101064" className="contact__link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                +420 773 101 064
              </a>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="contact__footer">
          <span>Roman Kalita · {new Date().getFullYear()}</span>
          <span>{c.footerRight}</span>
        </div>
      </div>
    </section>
  )
}
