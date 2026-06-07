import { useState } from 'react'
import { Responsive, useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useLang } from '../context/LangContext'
import { useInView } from '../hooks/useInView'
import { DispatchMockup } from './SmartZOS'
import { PhoneMockup } from './ZZSMobile'
import './ProjectShowcase.css'

// ─── Per-project pills & accents ──────────────────────────────────────

const PROJECT_IDS = ['smartzos', 'zzsmobile', 'cloud']

const PROJECT_PILLS = {
  smartzos:  ['React Native 0.83', 'Mapbox', 'Firebase', 'SQLite', 'Apple MPC', 'iOS / iPad'],
  zzsmobile: ['React Native', 'Zustand', 'Firebase', 'REST API', 'iOS / Android'],
  cloud:     ['ReactJS', 'React Router', 'REST API', 'Vuexy', 'i18n'],
}

const PROJECT_ACCENT = {
  smartzos:  '#4a8fc4',
  zzsmobile: '#34d399',
  cloud:     '#38bdf8',
}

// ─── Per-project feature icons ─────────────────────────────────────────

const FEAT_ICONS = {
  smartzos: [
    <svg key="map"  width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg key="off"  width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18.36 6.64a9 9 0 11-12.73 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="p2p"  width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M9 7h1m5 0h-1M9 17h1m5 0h-1M9.5 12h5M12 9.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="perf" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg key="reg"  width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="lay"  width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="17" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
  ],
  zzsmobile: [
    <svg key="bat"  width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="1" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M19 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M6 12h5M8.5 9.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="db"   width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V6" stroke="currentColor" strokeWidth="1.5"/><path d="M4 11v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5" stroke="currentColor" strokeWidth="1.5"/></svg>,
    <svg key="ren"  width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg key="hook" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07L11.75 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07L12.25 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ],
  cloud: [
    <svg key="grid" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
    <svg key="bell" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="usr"  width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    <svg key="tab"  width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  ],
}

// ─── Code snippets ─────────────────────────────────────────────────────

const CODE_SNIPPETS = {
  smartzos: {
    file: 'AppMenu.js · SmartZOS',
    code: `// P2P offline event sync via Apple Multipeer Connectivity

onPeerConnected: (peerName) => {
  RNMPCManager.sendCustomActionToPeer('peerUnitsSync', {
    units: unitsList,
    statuses: statuses,
  }, peerName)

  RNMPCManager.sendAction({
    type: 'custom',
    customType: 'peerEventSyncRequest',
    payload: {},
  })
},

const handlePeerEventCreate = async ({ guid, queuePayload, unitIds }) => {
  const localId = await enqueueFromPeer(guid, queuePayload, unitIds, region)
  if (!localId) return // duplicate — already received

  addPeerEvent({ id: localId, _guid: guid, _fromPeer: true, ...queuePayload.event })
}`,
  },
  zzsmobile: {
    file: 'unitStore.js · ZZS Mobile',
    code: `// Zustand store — replaced 3 nested React Contexts
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
  const status = useUnitStore(useCallback(s => s.status, []))
  const label  = useMemo(() => STATUS_LABELS[status] ?? status, [status])

  return <View style={styles[status]}><Text>{label}</Text></View>
}`,
  },
  cloud: {
    file: 'Dashboard.jsx · Cloud System',
    code: `// Resizable, draggable dashboard — layout persisted per user
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'attendance', x: 0, y: 0, w: 4, h: 5 },
    { i: 'todo',       x: 4, y: 0, w: 5, h: 5 },
    { i: 'users',      x: 9, y: 0, w: 3, h: 5 },
    { i: 'quals',      x: 0, y: 5, w: 5, h: 5 },
    { i: 'patients',   x: 5, y: 5, w: 7, h: 5 },
  ],
}

function Dashboard({ userId }) {
  const [layouts, setLayouts] = useUserLayout(userId, DEFAULT_LAYOUTS)

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      draggableHandle=".widget__handle"
      onLayoutChange={(_, all) => setLayouts(all)}
    >
      {WIDGETS.map(w => <Widget key={w.id} {...w} />)}
    </ResponsiveGridLayout>
  )
}`,
  },
}

// ─── Cloud DnD dashboard widgets ──────────────────────────────────────

function DndWidget({ title, dot, children }) {
  return (
    <div className="dw">
      <div className="dw__hdr">
        <div className="dw__hdr-left">
          <span className="dw__dot" style={{ background: dot }} />
          <span className="dw__title">{title}</span>
        </div>
        <div className="dw__handle rgl-handle" title="Drag">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="4" cy="3" r="1"/><circle cx="8" cy="3" r="1"/>
            <circle cx="4" cy="6" r="1"/><circle cx="8" cy="6" r="1"/>
            <circle cx="4" cy="9" r="1"/><circle cx="8" cy="9" r="1"/>
          </svg>
        </div>
      </div>
      <div className="dw__body">{children}</div>
    </div>
  )
}

function AttendanceWidget() {
  return (
    <div className="dw__attendance">
      <button className="dw__btn dw__btn--primary">Příchod</button>
      <button className="dw__btn dw__btn--ghost">Přerušení</button>
      <button className="dw__btn dw__btn--ghost">Přehled</button>
    </div>
  )
}

function TodoWidget() {
  return <div className="dw__empty">Žádné úkoly k dokončení.</div>
}

function UsersWidget() {
  return (
    <div className="dw__table">
      <div className="dw__tr dw__tr--hdr">
        <span>Uživatel</span><span>Přítomnost</span><span>Činnost</span>
      </div>
      {[
        { name: 'Aneta Vychodilová',  status: 'V práci', c: 'green' },
        { name: 'Holík Karel',   status: 'Offline',  c: 'gray' },
        { name: 'Novák Josef',   status: 'V práci', c: 'green' },
      ].map(r => (
        <div key={r.name} className="dw__tr">
          <span className="dw__cell-name">{r.name}</span>
          <span><span className={`dw__badge dw__badge--${r.c}`}>{r.status}</span></span>
          <span className="dw__muted">—</span>
        </div>
      ))}
    </div>
  )
}

function QualsWidget() {
  return <div className="dw__empty">Žádné kvalifikace neexpirují.</div>
}

function PatientsWidget() {
  return (
    <div className="dw__patients">
      <div className="dw__patients-hdr">
        <span>Triage <span className="dw__muted">čas</span></span>
        <span>PNP <span className="dw__muted">příjem / předání</span></span>
        <span>Odsun <span className="dw__muted">příjem / předání</span></span>
      </div>
      <div className="dw__empty" style={{ marginTop: 12 }}>Žádní pacienti.</div>
    </div>
  )
}

const INITIAL_LAYOUTS = {
  lg: [
    { i: 'attendance', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'todo',       x: 4, y: 0, w: 5, h: 5, minW: 3, minH: 3 },
    { i: 'users',      x: 9, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
    { i: 'quals',      x: 0, y: 5, w: 5, h: 5, minW: 3, minH: 3 },
    { i: 'patients',   x: 5, y: 5, w: 7, h: 5, minW: 4, minH: 3 },
  ],
}

function CloudDashboard({ hint, resetLabel }) {
  const [layouts, setLayouts] = useState(INITIAL_LAYOUTS)
  const { width, containerRef } = useContainerWidth()

  return (
    <div className="cloud-dnd" ref={containerRef}>
      <div className="cloud-dnd__bar">
        <div className="cloud-dnd__logo">
          <span>LZSCR</span>
          <span className="cloud-dnd__live">● LIVE</span>
        </div>
        <span className="cloud-dnd__hint">{hint}</span>
        <button className="cloud-dnd__reset" onClick={() => setLayouts({ ...INITIAL_LAYOUTS })}>
          {resetLabel}
        </button>
      </div>
      <Responsive
        width={width}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 800, sm: 400 }}
        cols={{ lg: 12, md: 8, sm: 4 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[14, 14]}
        draggableHandle=".rgl-handle"
        resizeHandles={['se']}
        onLayoutChange={(_, all) => setLayouts(all)}
      >
        <div key="attendance"><DndWidget title="Docházka"           dot="#3b82f6"><AttendanceWidget /></DndWidget></div>
        <div key="todo">      <DndWidget title="To Do"              dot="#8b5cf6"><TodoWidget /></DndWidget></div>
        <div key="users">     <DndWidget title="Aktuální stav uživatelů" dot="#10b981"><UsersWidget /></DndWidget></div>
        <div key="quals">     <DndWidget title="Expirace kvalifikací" dot="#f59e0b"><QualsWidget /></DndWidget></div>
        <div key="patients">  <DndWidget title="Pacienti poslední události" dot="#ef4444"><PatientsWidget /></DndWidget></div>
      </Responsive>
    </div>
  )
}

// ─── Main showcase ─────────────────────────────────────────────────────

export default function ProjectShowcase() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [headerRef, headerInView] = useInView()
  const [cardRef, cardInView] = useInView()
  const [codeRef, codeInView] = useInView()

  const ids = PROJECT_IDS
  const proj = ids[active]
  const accent = PROJECT_ACCENT[proj]
  const data = t[proj === 'smartzos' ? 'szos' : proj === 'zzsmobile' ? 'zzs' : 'cloud']

  const tabLabels = [
    { name: 'SmartZOS',     type: t.szos.tabType   },
    { name: 'ZZS Mobile',   type: t.zzs.tabType    },
    // { name: 'Cloud System', type: t.cloud.tabType  },
  ]

  const snippet = CODE_SNIPPETS[proj]

  return (
    <section className="showcase" id="work">
      {/* Background orbs */}
      <div className="showcase__orb showcase__orb--1" />
      <div className="showcase__orb showcase__orb--2" />
      <div className="showcase__orb showcase__orb--3" />

      <div className="showcase__inner">

        {/* Section header */}
        <div className={`showcase__header fade-up ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="showcase__section-label">{t.showcase.sectionLabel}</span>
          <h2 className="showcase__section-title">{t.showcase.sectionTitle}</h2>
        </div>

        {/* Tab switcher */}
        <div className="showcase__tabs">
          {tabLabels.map((tab, i) => (
            <button
              key={i}
              className={`showcase__tab ${active === i ? 'showcase__tab--active' : ''}`}
              onClick={() => setActive(i)}
              style={active === i ? { '--tab-accent': PROJECT_ACCENT[ids[i]] } : {}}
            >
              {/* <span className="showcase__tab-num">0{i + 1}</span> */}
              <span className="showcase__tab-name">{tab.name}</span>
              <span className="showcase__tab-type">{tab.type}</span>
            </button>
          ))}
        </div>

        {/* Glass card */}
        <div
          className={`showcase__card fade-up ${cardInView ? 'visible' : ''}`}
          ref={cardRef}
        >
          <div className="showcase__content" key={proj}>

            {/* Project header */}
            <div className="showcase__proj-header">
              <div className="showcase__proj-meta">
                <span className="showcase__proj-label" style={{ color: accent }}>{data.label}</span>
                <h3 className="showcase__proj-title">{tabLabels[active].name}</h3>
                <p className="showcase__proj-subtitle">{data.subtitle}</p>
                <div className="showcase__pills">
                  {PROJECT_PILLS[proj].map(p => (
                    <span key={p} className="showcase__pill">{p}</span>
                  ))}
                </div>
              </div>
              <div className="showcase__metrics">
                {data.metrics.map(m => (
                  <div key={m.value} className="showcase__metric">
                    <div className="showcase__metric-value" style={{ color: accent }}>{m.value}</div>
                    <div className="showcase__metric-label">{m.label}</div>
                    <div className="showcase__metric-note">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup */}
            <div className="showcase__mockup-area">
              {proj === 'smartzos' && (
                <div className="showcase__mockup-wrap">
                  <DispatchMockup caption={data.caption} />
                </div>
              )}
              {proj === 'zzsmobile' && (
                <div className="showcase__phone-stage">
                  <div className="showcase__phone-glow" style={{ background: `radial-gradient(ellipse at center, ${accent}22 0%, transparent 70%)` }} />
                  <PhoneMockup caption={data.caption} lang={t.lang} />
                </div>
              )}
              {proj === 'cloud' && (
                <CloudDashboard
                  hint={t.showcase.dndHint}
                  resetLabel={t.showcase.resetLabel}
                />
              )}
            </div>

            {/* Features strip */}
            <div className="showcase__feat-strip">
              {data.features.map((f, i) => (
                <div key={f.title} className="showcase__feat-item">
                  <span className="showcase__feat-icon" style={{ color: accent }}>
                    {(FEAT_ICONS[proj] || [])[i]}
                  </span>
                  <span className="showcase__feat-title">{f.title}</span>
                  <p className="showcase__feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Code spotlight */}
        <div
          className={`showcase__code-card fade-up d2 ${codeInView ? 'visible' : ''}`}
          ref={codeRef}
        >
          <div className="showcase__code-header">
            <h3 className="showcase__code-title">{data.codeTitle}</h3>
            <p className="showcase__code-sub">{data.codeSub}</p>
          </div>
          <div className="showcase__code-block" key={proj + '-code'}>
            <div className="showcase__code-bar">
              <span className="showcase__code-dot" />
              <span className="showcase__code-dot" />
              <span className="showcase__code-dot" />
              <span className="showcase__code-file">{snippet.file}</span>
            </div>
            <pre className="showcase__pre"><code>{snippet.code}</code></pre>
          </div>
        </div>

      </div>
    </section>
  )
}
