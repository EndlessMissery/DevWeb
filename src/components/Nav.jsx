import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'
import './Nav.css'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SECTIONS = ['work', 'about', 'skills', 'contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const { t, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      const probeY = 90
      let current = ''
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= probeY) {
          current = id
        }
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#" className="nav__brand">RK</a>

        <ul className="nav__links">
          <li><a href="#" className={active === '' ? 'nav__links--active' : ''} onClick={close}>{t.nav.home}</a></li>
          <li><a href="#work" className={active === 'work' ? 'nav__links--active' : ''} onClick={close}>{t.nav.projects}</a></li>
          <li><a href="#about" className={active === 'about' ? 'nav__links--active' : ''} onClick={close}>{t.nav.about}</a></li>
          <li><a href="#skills" className={active === 'skills' ? 'nav__links--active' : ''} onClick={close}>{t.nav.skills}</a></li>
          <li><a href="#contact" className={active === 'contact' ? 'nav__links--active' : ''} onClick={close}>{t.nav.contact}</a></li>
        </ul>

        <div className="nav__right">
          <button className="nav__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="nav__lang" onClick={toggleLang}>{t.nav.toggle}</button>
          <button
            className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav__drawer ${menuOpen ? 'nav__drawer--open' : ''}`}>
        <ul>
          <li><a href="#" onClick={close}>{t.nav.home}</a></li>
          <li><a href="#work" onClick={close}>{t.nav.projects}</a></li>
          <li><a href="#about" onClick={close}>{t.nav.about}</a></li>
          <li><a href="#skills" onClick={close}>{t.nav.skills}</a></li>
          <li><a href="#contact" onClick={close}>{t.nav.contact}</a></li>
        </ul>
      </div>
    </header>
  )
}
