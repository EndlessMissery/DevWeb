import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import './CloudSystem.css'

// ─── Feature card icons ────────────────────────────────────────────────

const FEAT_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="dnd">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="bell">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="contacts">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="tablet">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>,
]

// ─── Sidebar config ────────────────────────────────────────────────────

const NAV_ICONS = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  attendance: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  todo: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  notifications: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  emergency: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  hems: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  events: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  admin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'attendance', label: 'Docházka' },
  { id: 'todo', label: 'TO DO' },
  { id: 'notifications', label: 'Notifikace' },
  { id: 'emergency', label: 'Emergency', badge: 'Nový' },
  { id: 'hems', label: 'HEMS', arrow: true },
  { id: 'events', label: 'Events', arrow: true },
  { id: 'admin', label: 'Administrace', arrow: true },
]

// ─── Dashboard screen ──────────────────────────────────────────────────

function DashboardScreen() {
  return (
    <div className="cscreen">
      <div className="cscreen__topbar">
        <button className="cscreen__reset">Reset layout</button>
      </div>
      <div className="cwid-grid">
        <div className="cwid cwid--sm">
          <div className="cwid__hdr">
            <div className="cwid__hdr-left">
              <div className="cwid__icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#3b82f6" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <span className="cwid__title">Docházka</span>
            </div>
            <span className="cwid__handle">⠿</span>
          </div>
          <div className="cwid__body">
            <button className="cwid__btn cwid__btn--primary">Příchod</button>
            <button className="cwid__btn cwid__btn--outline">Přerušení</button>
            <button className="cwid__btn cwid__btn--outline">Přehled</button>
          </div>
        </div>

        <div className="cwid cwid--sm">
          <div className="cwid__hdr">
            <div className="cwid__hdr-left">
              <div className="cwid__icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#3b82f6" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 9h18" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <span className="cwid__title">To Do</span>
            </div>
            <span className="cwid__handle">⠿</span>
          </div>
          <div className="cwid__body cwid__body--empty">Žádné úkoly k dokončení.</div>
        </div>

        <div className="cwid cwid--lg">
          <div className="cwid__hdr">
            <div className="cwid__hdr-left">
              <div className="cwid__icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="1.5"/></svg>
              </div>
              <span className="cwid__title">Aktuální stav uživatelů</span>
            </div>
            <span className="cwid__handle">⠿</span>
          </div>
          <div className="cwid__body cwid__body--table">
            <div className="cwid__table">
              <div className="cwid__row cwid__row--hdr">
                <span>Uživatel</span><span>Přítomnost</span><span>Činnost</span>
              </div>
              <div className="cwid__row">
                <span>Nezval Jakub</span>
                <span><span className="cwid__badge cwid__badge--green">V práci</span></span>
                <span className="cwid__muted">—</span>
              </div>
              <div className="cwid__row">
                <span>Holík Karel</span>
                <span><span className="cwid__badge cwid__badge--gray">Offline</span></span>
                <span className="cwid__muted">—</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cwid cwid--sm">
          <div className="cwid__hdr">
            <div className="cwid__hdr-left">
              <div className="cwid__icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#3b82f6" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 9h18" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <span className="cwid__title">Expirace kvalifikací</span>
            </div>
            <span className="cwid__handle">⠿</span>
          </div>
          <div className="cwid__body cwid__body--empty">Žádné kvalifikace neexpirují.</div>
        </div>
      </div>
    </div>
  )
}

// ─── Notifications screen ──────────────────────────────────────────────

const NOTIF_ROWS = [
  { subject: 'nový pacient - (2) muž Josef Novák ročník 1990', read: true },
  { subject: 'nový pacient - (3) muž Karel Vomáčka ročník 1976', read: true },
  { subject: 'nový pacient - (3) muž Karel Vomáčka ročník 1976', read: false },
  { subject: 'nový pacient - (1) muž Karel Holík ročník 1965', read: true },
  { subject: 'nový pacient - (1) muž Karel Holík ročník 1965', read: false },
  { subject: 'nový pacient - (1) žena Jana Nezvalova ročník 1978', read: false },
  { subject: 'nový pacient - (1) žena Jana Nezvalova ročník 1978', read: false },
]

function NotificationsScreen() {
  return (
    <div className="cscreen cscreen--notif">
      <div className="cnotif__sidebar">
        <button className="cnotif__new">Nová notifikace</button>
        <nav className="cnotif__nav">
          <span className="cnotif__nav-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5"/></svg>Inbox</span>
          <span className="cnotif__nav-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="1.5"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>Odeslané</span>
          <span className="cnotif__nav-item cnotif__nav-item--active"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="1.5"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>Přijaté</span>
          <span className="cnotif__nav-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Koš</span>
        </nav>
        <div className="cnotif__search">Hledat...</div>
        <div className="cnotif__filter">
          <span className="cnotif__filter-label">Omezení datem</span>
          <div className="cnotif__select">Bez omezení <span>▾</span></div>
        </div>
      </div>
      <div className="cnotif__main">
        <div className="cnotif__table-hdr">
          <span />
          <span>ODESÍLATEL</span>
          <span>PŘÍJEMCE</span>
          <span>ODESLÁNO</span>
          <span>PŘEDMĚT</span>
          <span>PŘEČTENO</span>
        </div>
        {NOTIF_ROWS.map((row, i) => (
          <div key={i} className="cnotif__table-row">
            <span className="cnotif__dots">⋮</span>
            <span>System</span>
            <span>—</span>
            <span className="cnotif__muted">Invalid date</span>
            <span className="cnotif__subject">{row.subject}</span>
            <span className={`cnotif__read ${row.read ? 'cnotif__read--yes' : 'cnotif__read--no'}`}>
              {row.read ? 'PŘEČTENO' : 'NEPŘEČTENO'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Emergency contacts screen ─────────────────────────────────────────

const CONTACTS = [
  { initials: 'MC', color: '#3b82f6', name: 'Michal Chlad',    role: '',          phone: '602741219' },
  { initials: 'LH', color: '#22c55e', name: 'Lucie Hanušová',  role: 'Řidič',     phone: '725421778' },
  { initials: 'SS', color: '#f59e0b', name: 'Simona Sosnová',  role: 'Záchranář', phone: '732503115' },
  { initials: 'AK', color: '#f59e0b', name: 'Adéla Křepelová', role: 'Záchranář', phone: '724820773' },
  { initials: 'RS', color: '#f59e0b', name: 'Renata Soumarová', role: 'Záchranář', phone: '728498995' },
  { initials: 'D2', color: '#3b82f6', name: 'Dispatcher 02',   role: '',          phone: '—' },
]

function ContactsScreen() {
  return (
    <div className="cscreen cscreen--contacts">
      <div className="cemerg__tabs">
        {['Rychlé varování', 'Šablony', 'Situace', 'Skupiny', 'Kontakty', 'Varování'].map((t, i) => (
          <span key={t} className={`cemerg__tab ${i === 4 ? 'cemerg__tab--active' : ''}`}>{t}</span>
        ))}
      </div>
      <div className="cemerg__dials">
        <div className="cemerg__dial cemerg__dial--orange">
          <span className="cemerg__dial-n">155</span>
          <span className="cemerg__dial-name">Zdravotnická záchranná služba</span>
        </div>
        <div className="cemerg__dial cemerg__dial--orange">
          <span className="cemerg__dial-n">150</span>
          <span className="cemerg__dial-name">Hasiči</span>
        </div>
        <div className="cemerg__dial cemerg__dial--blue">
          <span className="cemerg__dial-n">158</span>
          <span className="cemerg__dial-name">Policie ČR</span>
        </div>
      </div>
      <div className="cemerg__search">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span className="cemerg__search-ph">Hledat kontakt...</span>
      </div>
      <div className="cemerg__cards">
        {CONTACTS.map(c => (
          <div key={c.name} className="cemerg__card">
            <div className="cemerg__avatar" style={{ background: c.color }}>{c.initials}</div>
            <div className="cemerg__info">
              <span className="cemerg__name">{c.name}</span>
              {c.role && <span className="cemerg__role">{c.role}</span>}
              <span className="cemerg__phone">{c.phone}</span>
            </div>
            <div className="cemerg__actions">
              <button className="cemerg__act">Volat</button>
              <button className="cemerg__act">Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cloud mockup ──────────────────────────────────────────────────────

function CloudMockup({ caption }) {
  const [screen, setScreen] = useState('dashboard')

  return (
    <div className="cloud__mockup-wrap">
      <div className="cloud-mock">
        <div className="cloud-mock__bar">
          <div className="cloud-mock__dots">
            <span className="cloud-mock__dot cloud-mock__dot--red" />
            <span className="cloud-mock__dot cloud-mock__dot--yellow" />
            <span className="cloud-mock__dot cloud-mock__dot--green" />
          </div>
          <span className="cloud-mock__title">Cloud · LZSCR · KHK</span>
          <span className="cloud-mock__live">● LIVE</span>
        </div>
        <div className="cloud-mock__body">

          <div className="cloud-mock__sidebar">
            <div className="cloud-mock__logo">
              <span className="cloud-mock__logo-text">LZSCR</span>
              <div className="cloud-mock__logo-dot" />
            </div>
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                className={`cloud-mock__nav-item ${screen === item.id ? 'cloud-mock__nav-item--active' : ''}`}
                onClick={() => setScreen(item.id)}
              >
                <span className="cloud-mock__nav-icon">{NAV_ICONS[item.id]}</span>
                <span className="cloud-mock__nav-label">{item.label}</span>
                {item.badge && <span className="cloud-mock__nav-badge">{item.badge}</span>}
                {item.arrow && <span className="cloud-mock__nav-arrow">›</span>}
              </button>
            ))}
          </div>

          <div className="cloud-mock__main">
            <div className="cloud-mock__topbar">
              <div className="cloud-mock__breadcrumb">khktest.smartzos.cz</div>
              <div className="cloud-mock__topbar-right">
                <span className="cloud-mock__lang">🇨🇿 Česky</span>
                <span className="cloud-mock__bell">🔔</span>
                <span className="cloud-mock__user">roman.kalita</span>
              </div>
            </div>

            <div className="cloud-mock__screen">
              {screen === 'dashboard'      && <DashboardScreen />}
              {screen === 'notifications'  && <NotificationsScreen />}
              {screen === 'emergency'      && <ContactsScreen />}
              {!['dashboard', 'notifications', 'emergency'].includes(screen) && <DashboardScreen />}
            </div>
          </div>

        </div>
      </div>
      <p className="cloud__mockup-caption">{caption}</p>
    </div>
  )
}

// ─── Code snippet ──────────────────────────────────────────────────────

const CODE_SNIPPET = `// Resizable, draggable dashboard — layout persisted per user
const DEFAULT_LAYOUT = [
  { i: 'attendance', x: 0, y: 0, w: 6,  h: 4 },
  { i: 'todo',       x: 6, y: 0, w: 6,  h: 4 },
  { i: 'users',      x: 0, y: 4, w: 8,  h: 6 },
  { i: 'quals',      x: 8, y: 4, w: 4,  h: 6 },
]

function Dashboard({ userId }) {
  const [layout, setLayout] = useUserLayout(userId, DEFAULT_LAYOUT)

  return (
    <ReactGridLayout
      layout={layout}
      cols={12}
      rowHeight={30}
      onLayoutChange={(l) => setLayout(l)}
      draggableHandle=".widget__handle"
    >
      {WIDGETS.map(w => (
        <div key={w.id}>
          <Widget id={w.id} title={w.title}>{w.content}</Widget>
        </div>
      ))}
    </ReactGridLayout>
  )
}`

// ─── Main section ──────────────────────────────────────────────────────

export default function CloudSystem() {
  const { t } = useLang()
  const c = t.cloud

  const [headerRef, headerInView] = useInView()
  const [mockupRef, mockupInView] = useInView()
  const [featRef, featInView] = useInView()
  const [metricsRef, metricsInView] = useInView()
  const [codeRef, codeInView] = useInView()

  return (
    <section className="cloud" id="cloudsystem">
      <div className="cloud__inner">

        <div className="cloud__header" ref={headerRef}>
          <div className={`fade-up ${headerInView ? 'visible' : ''}`}>
            <span className="section-label">{c.label}</span>
            <h2 className="cloud__title">Cloud System</h2>
            <p className="cloud__subtitle">{c.subtitle}</p>
          </div>
          <div className={`cloud__pills fade-up d2 ${headerInView ? 'visible' : ''}`}>
            {['ReactJS', 'React Router', 'REST API', 'Vuexy', 'i18n'].map(pill => (
              <span key={pill} className="cloud__pill">{pill}</span>
            ))}
          </div>
        </div>

        <div className={`fade-up d2 ${mockupInView ? 'visible' : ''}`} ref={mockupRef}>
          <CloudMockup caption={c.caption} />
        </div>

        <div className="cloud__features" ref={featRef}>
          <div className={`cloud__features-header fade-up ${featInView ? 'visible' : ''}`}>
            <h3 className="cloud__section-heading">{c.whatIBuilt}</h3>
          </div>
          <div className="cloud__feature-grid">
            {c.features.map((f, i) => (
              <div key={f.title} className={`cloud-feat fade-up d${i + 1} ${featInView ? 'visible' : ''}`}>
                <div className="cloud-feat__icon">{FEAT_ICONS[i]}</div>
                <h4 className="cloud-feat__title">{f.title}</h4>
                <p className="cloud-feat__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cloud__metrics" ref={metricsRef}>
          {c.metrics.map((m, i) => (
            <div key={m.value} className={`cloud__metric fade-up d${i + 1} ${metricsInView ? 'visible' : ''}`}>
              <div className="cloud__metric-value">{m.value}</div>
              <div className="cloud__metric-label">{m.label}</div>
              <div className="cloud__metric-note">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="cloud__code" ref={codeRef}>
          <div className={`fade-up ${codeInView ? 'visible' : ''}`}>
            <h3 className="cloud__section-heading">{c.codeTitle}</h3>
            <p className="cloud__code-sub">{c.codeSub}</p>
          </div>
          <div className={`cloud__code-block fade-up d2 ${codeInView ? 'visible' : ''}`}>
            <div className="cloud__code-bar">
              <span className="cloud__code-dot" /><span className="cloud__code-dot" /><span className="cloud__code-dot" />
              <span className="cloud__code-filename">Dashboard.jsx · Cloud System</span>
            </div>
            <pre className="cloud__pre"><code>{CODE_SNIPPET}</code></pre>
          </div>
        </div>

      </div>
    </section>
  )
}
