import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import LeafletMap from './LeafletMap'
import HighlightedCode from './HighlightedCode'
import AnimatedMetricValue from './AnimatedMetricValue'
import './ZZSMobile.css'

// ─── Feature card icons ────────────────────────────────────────────────

const FEAT_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="battery">
    <rect x="1" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 12h5M8.5 9.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="zustand">
    <ellipse cx="12" cy="6" rx="8" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 6v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 11v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="rerenders">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="hooks">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07L11.75 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07L12.25 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

// ─── Tab icons ─────────────────────────────────────────────────────────

const TAB_ICONS = {
  event: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  status: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
}

const TABS = [
  { id: 'event', cs: 'Událost', en: 'Event' },
  { id: 'map', cs: 'Mapa', en: 'Map' },
  { id: 'status', cs: 'Stav', en: 'Status' },
  { id: 'chat', cs: 'Chat', en: 'Chat' },
]

// ─── Phone screens ─────────────────────────────────────────────────────

function EventScreen() {
  return (
    <div className="pevent">
      <div className="pevent__urgency">
        <span className="pevent__urg-n">2</span>
        <div className="pevent__urg-info">
          <span className="pevent__urg-label">NALÉHAVOST</span>
          <span className="pevent__urg-type">Dopravní nehoda</span>
        </div>
        <span className="pevent__timer">07:14</span>
      </div>
      <div className="pevent__body">
        <div className="pevent__field">
          <span className="pevent__field-label">Adresa</span>
          <span className="pevent__field-val">Pražská 45, Brno-střed</span>
        </div>
        <div className="pevent__field">
          <span className="pevent__field-label">Pacient</span>
          <span className="pevent__field-val">38y · M · vědomý</span>
        </div>
        <div className="pevent__field">
          <span className="pevent__field-label">Jednotka</span>
          <span className="pevent__field-val">RLP 23 BL · Na cestě</span>
        </div>
      </div>
      <div className="pevent__actions">
        <button className="pevent__btn pevent__btn--nav">Navigovat</button>
        <button className="pevent__btn pevent__btn--scene">Na místě</button>
      </div>
    </div>
  )
}

function MapScreen() {
  return (
    <div className="pmap">
      <div className="pmap__map-area">
        <LeafletMap />
        <div className="pmap__badge">LIVE · JMK</div>
      </div>
      <div className="pmap__eta">
        <span className="pmap__eta-label">ETA</span>
        <span className="pmap__eta-time">4 min</span>
        <span className="pmap__eta-dist">2.3 km</span>
      </div>
    </div>
  )
}

const STATUS_OPTIONS = [
  { id: 'available', label: 'K dispozici' },
  { id: 'dispatched', label: 'Výjezd' },
  { id: 'enroute', label: 'Na cestě', active: true },
  { id: 'onscene', label: 'Na místě' },
  { id: 'hospital', label: 'Nemocnice' },
]

function StatusScreen() {
  return (
    <div className="pstatus">
      <div className="pstatus__header">
        <span className="pstatus__unit">RLP 23 BL</span>
        <span className="pstatus__region">JMK</span>
      </div>
      <div className="pstatus__list">
        {STATUS_OPTIONS.map(s => (
          <div key={s.id} className={`pstatus__item ${s.active ? 'pstatus__item--active' : ''}`}>
            <span className={`pstatus__dot ${s.active ? 'pstatus__dot--active' : ''}`} />
            <span className="pstatus__label">{s.label}</span>
            {s.active && <span className="pstatus__check">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

const CHAT_MSGS = [
  { from: 'disp', text: 'Potvrďte příjezd na místo.' },
  { from: 'unit', text: 'Na cestě. ETA 4 min.' },
  { from: 'disp', text: 'Potvrzeno. Připravte vybavení.' },
]

function ChatScreen() {
  return (
    <div className="pchat">
      <div className="pchat__header">Dispečink · JMK</div>
      <div className="pchat__msgs">
        {CHAT_MSGS.map((m, i) => (
          <div key={i} className={`pchat__msg pchat__msg--${m.from}`}>
            {m.from === 'disp' && <span className="pchat__from">Disp</span>}
            <span className="pchat__bubble">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="pchat__input">
        <span className="pchat__placeholder">Zpráva...</span>
        <span className="pchat__send">↑</span>
      </div>
    </div>
  )
}

// ─── Phone mockup ──────────────────────────────────────────────────────

export function PhoneMockup({ caption, lang }) {
  const [tab, setTab] = useState('event')

  return (
    <div className="zzs__phone-wrap">
      <div className="phone">
        <div className="phone__screen">
          <div className="phone__statusbar">
            <span className="phone__time">9:41</span>
            <span className="phone__app-name">ZZS Mobile</span>
            <div className="phone__icons">
              <svg width="13" height="10" viewBox="0 0 13 10" fill="currentColor">
                <rect x="0" y="4" width="2" height="6" rx="0.5" opacity="0.35" />
                <rect x="3" y="2.5" width="2" height="7.5" rx="0.5" opacity="0.6" />
                <rect x="6" y="1" width="2" height="9" rx="0.5" opacity="0.8" />
                <rect x="9" y="0" width="2" height="10" rx="0.5" />
              </svg>
              <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
                <rect x="0.75" y="1.5" width="13.5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="2" y="3" width="9" height="5" rx="0.5" fill="currentColor" />
                <rect x="14.5" y="3.5" width="2" height="4" rx="1" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="phone__content">
            {tab === 'event'  && <EventScreen />}
            {tab === 'map'    && <MapScreen />}
            {tab === 'status' && <StatusScreen />}
            {tab === 'chat'   && <ChatScreen />}
          </div>

          <div className="phone__tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`phone__tab ${tab === t.id ? 'phone__tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {TAB_ICONS[t.id]}
                <span>{lang === 'cs' ? t.cs : t.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="zzs__phone-caption">{caption}</p>
    </div>
  )
}

// ─── Code snippet ──────────────────────────────────────────────────────

const CODE_SNIPPET = `// Zustand store — replaced 3 nested React Contexts
// Scoped subscriptions: only affected components re-render

export const useUnitStore = create((set) => ({
  status: 'enroute',
  activeEventId: 'evt-0042',
  location: null,

  setStatus: (status) => set({ status }),
  setLocation: (coords) => set({ location: coords }),
}))

// useCallback stabilises the selector reference across renders
function StatusBadge() {
  const status = useUnitStore(
    useCallback(s => s.status, [])
  )

  const label = useMemo(
    () => STATUS_LABELS[status] ?? status,
    [status]
  )

  return <View style={styles[status]}><Text>{label}</Text></View>
}`

// ─── Main section ──────────────────────────────────────────────────────

export default function ZZSMobile() {
  const { t } = useLang()
  const z = t.zzs

  const [headerRef, headerInView] = useInView()
  const [mockupRef, mockupInView] = useInView()
  const [featRef, featInView] = useInView()
  const [metricsRef, metricsInView] = useInView()
  const [codeRef, codeInView] = useInView()

  return (
    <section className="zzs" id="zzsmobile">
      <div className="zzs__inner">

        <div className="zzs__header" ref={headerRef}>
          <div className={`fade-up ${headerInView ? 'visible' : ''}`}>
            <span className="section-label">{z.label}</span>
            <h2 className="zzs__title">ZZS Mobile</h2>
            <p className="zzs__subtitle">{z.subtitle}</p>
          </div>
          <div className={`zzs__pills fade-up d2 ${headerInView ? 'visible' : ''}`}>
            {['React Native', 'Zustand', 'Firebase', 'REST API', 'iOS'].map(pill => (
              <span key={pill} className="zzs__pill">{pill}</span>
            ))}
          </div>
        </div>

        <div className={`fade-up d2 ${mockupInView ? 'visible' : ''}`} ref={mockupRef}>
          <PhoneMockup caption={z.caption} lang={t.lang} />
        </div>

        <div className="zzs__features" ref={featRef}>
          <div className={`zzs__features-header fade-up ${featInView ? 'visible' : ''}`}>
            <h3 className="zzs__section-heading">{z.whatIContributed}</h3>
          </div>
          <div className="zzs__feature-grid">
            {z.features.map((f, i) => (
              <div key={f.title} className={`zzs-feat fade-up d${i + 1} ${featInView ? 'visible' : ''}`}>
                <div className="zzs-feat__icon">{FEAT_ICONS[i]}</div>
                <h4 className="zzs-feat__title">{f.title}</h4>
                <p className="zzs-feat__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="zzs__metrics" ref={metricsRef}>
          {z.metrics.map((m, i) => (
            <div key={m.value} className={`zzs__metric fade-up d${i + 1} ${metricsInView ? 'visible' : ''}`}>
              <div className="zzs__metric-value"><AnimatedMetricValue value={m.value} active={metricsInView} /></div>
              <div className="zzs__metric-label">{m.label}</div>
              <div className="zzs__metric-note">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="zzs__code" ref={codeRef}>
          <div className={`fade-up ${codeInView ? 'visible' : ''}`}>
            <h3 className="zzs__section-heading">{z.codeTitle}</h3>
            <p className="zzs__code-sub">{z.codeSub}</p>
          </div>
          <div className={`zzs__code-block fade-up d2 ${codeInView ? 'visible' : ''}`}>
            <div className="zzs__code-bar">
              <span className="zzs__code-dot" /><span className="zzs__code-dot" /><span className="zzs__code-dot" />
              <span className="zzs__code-filename">unitStore.js · ZZS Mobile</span>
            </div>
            <pre className="zzs__pre"><code><HighlightedCode code={CODE_SNIPPET} /></code></pre>
          </div>
        </div>

      </div>
    </section>
  )
}
