import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import LeafletMap from './LeafletMap'
import HighlightedCode from './HighlightedCode'
import AnimatedMetricValue from './AnimatedMetricValue'
import './SmartZOS.css'

const FEAT_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="map">
    <path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="offline">
    <path d="M18.36 6.64a9 9 0 11-12.73 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="p2p">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 7h1m5 0h-1M9 17h1m5 0h-1M9.5 12h5M12 9.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="perf">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="globe">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" key="layers">
    <rect x="2" y="3" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="10" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="17" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
]

const CODE_SNIPPET = `// P2P offline event sync via Apple Multipeer Connectivity

onPeerConnected: (peerName) => {
  // Immediately share unit states with the new peer
  RNMPCManager.sendCustomActionToPeer('peerUnitsSync', {
    units: unitsList,
    statuses: statuses,
  }, peerName)

  // Request peer's offline event queue
  RNMPCManager.sendAction({
    type: 'custom',
    customType: 'peerEventSyncRequest',
    payload: {},
  })
},

// Merge incoming event from offline peer device
const handlePeerEventCreate = async ({ guid, queuePayload, unitIds }) => {
  const localId = await enqueueFromPeer(guid, queuePayload, unitIds, region)
  if (!localId) return // duplicate — already received

  addPeerEvent({
    id: localId,
    _guid: guid,
    _fromPeer: true,
    active: true,
    ...queuePayload.event,
  })
}`

const EVENT_CARDS = [
  { urg: 2, time: '21:26', loc: 'Jihomoravský kraj · Máš...', badge: 'III 03 BL', col: 'orange' },
  { urg: 3, time: '21:19', loc: 'Jihomoravský kraj · OC Ol...', badge: 'I 90 BL', col: 'green' },
  { urg: 2, time: '20:59', loc: 'Jihomoravský kraj · sut.', badge: 'III 86 BL', col: 'orange' },
  { urg: 2, time: '20:47', loc: 'Jihomoravský kraj · rd', badge: 'III 95 BL', col: 'orange' },
]

const BOARD_COLS = ['I', 'III', 'IV', 'VI', 'IVA', 'T', 'BLA', 'BOS', 'VYS', 'HOD']
const BOARD_DATA = [
  { lbl: 'RV', cells: [['24','g'],['29','g'],['25','g'],['21','y'],['27','g'],['417','g'],['',''],['278','g'],['732','g'],['68','g']] },
  { lbl: 'BL', cells: [['98','r'],['86','o'],['92','g'],['19','y'],['315','g'],['418','g'],['260','g'],['277','g'],['735','g'],['637','g']] },
  { lbl: 'ST', cells: [['155','g'],['',''],['UM 05','y'],['',''],['316','g'],['',''],['261','g'],['271','g'],['',''],['','']] },
  { lbl: 'KL', cells: [['',''],['',''],['',''],['',''],['',''],['',''],['260','g'],['',''],['732','g'],['','']] },
]

const REGIONS = [
  {
    name: 'HODONÍN', stations: [
      { name: 'VS Hodonín', units: [{ id: '634 BL HOD', c: 'r' }, { id: '637 BL HOD', c: 'g' }, { id: '68 RV HOD', c: 'g' }] },
      { name: 'VS Kyjov', units: [{ id: '636 KL KYJ', c: 'g' }, { id: '639 UM KYJ', c: 'g' }] },
    ],
  },
  {
    name: 'BŘECLAV', stations: [
      { name: 'VS Břeclav', units: [{ id: '522 B', c: 'g' }, { id: '528 BL B', c: 'g' }, { id: '532 KL B', c: 'g' }] },
      { name: 'VS Hustopeče', units: [{ id: '530 BL BHU', c: 'g' }, { id: '531 RV BHU', c: 'y' }] },
    ],
  },
  {
    name: 'BRNO-MĚSTO', stations: [
      { name: 'VS Bohunice', units: [{ id: '165 ST I', c: 'y' }, { id: '24 RV I', c: 'g' }, { id: '90 BL I', c: 'r' }, { id: '91 BL I', c: 'g' }] },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────

function MapArea() {
  return (
    <div className="mockup__map">
      <LeafletMap />
      <div className="mockup__map-badge">LIVE · JMK</div>
    </div>
  )
}

function EventsPanel({ narrow }) {
  return (
    <div className={`mockup__events-panel ${narrow ? 'mockup__events-panel--narrow' : ''}`}>
      <div className="mockup__tabs">
        <span className="mockup__tab">Čekající (1)</span>
        <span className="mockup__tab mockup__tab--active">Aktivní (7)</span>
        <span className="mockup__tab">Plán. (12)</span>
      </div>
      <div className="mockup__event-list">
        {EVENT_CARDS.map((e, i) => (
          <div key={i} className={`mockup__ev mockup__ev--u${e.urg}`}>
            <div className="mockup__ev-urg">{e.urg}</div>
            <div className="mockup__ev-body">
              <div className="mockup__ev-time">{e.time}</div>
              <div className="mockup__ev-loc">{e.loc}</div>
              <div className="mockup__ev-meta">
                <span className={`mockup__ev-badge mockup__ev-badge--${e.col}`}>{e.badge}</span>
                <span className="mockup__ev-add">+ ADD</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewEventScreen() {
  return (
    <>
      <div className="mform">
        <div className="mform__header">
          <span className="mform__close">✕ Zavřít</span>
          <strong className="mform__title">Nová událost</strong>
          <div className="mform__btns">
            <span className="mform__btn mform__btn--green">✓ Uložit</span>
            <span className="mform__btn mform__btn--red">Vymazat</span>
          </div>
          <span className="mform__timer">00:00:09</span>
        </div>
        <div className="mform__tab-bar">
          <span className="mform__tab">Základní</span>
        </div>
        <div className="mform__body">
          <div className="mform__row">
            <div className="mform__input">Jméno</div>
            <div className="mform__input">Příjmení</div>
          </div>
          <div className="mform__input mform__input--full">Telefon</div>

          <div className="mform__section">
            <div className="mform__section-hdr">Adresa</div>
            <div className="mform__input mform__input--full">Hledat místo...</div>
            <div className="mform__radios">
              <span className="mform__radio mform__radio--on">◉ Mapy.cz</span>
              <span className="mform__radio">◯ RUIAN</span>
              <span className="mform__radio">◯ POI</span>
            </div>
          </div>

          <div className="mform__field-label">Naléhavost</div>
          <div className="mform__urgency">
            {['1', '2', '3', '4', 'X'].map((n, i) => (
              <span key={n} className={`mform__urg ${i === 0 ? 'mform__urg--active' : ''}`}>{n}</span>
            ))}
          </div>

          <div className="mform__units">
            {[['RLP', 'RV', 'RZP'], ['LZS', 'ST', 'TS'], ['NO', 'INSP', '']].map((row, ri) => (
              <div key={ri} className="mform__unit-row">
                {row.map((u, ui) => u ? (
                  <div key={ui} className="mform__unit">
                    <span className="mform__unit-dot" />
                    <span className="mform__unit-name">{u}</span>
                    <span className="mform__unit-n">0</span>
                    <span className="mform__unit-plus">+</span>
                  </div>
                ) : <div key={ui} className="mform__unit" />)}
              </div>
            ))}
          </div>

          <div className="mform__section">
            <div className="mform__section-hdr">Pacienti</div>
            <div className="mform__patient-row">
              <span className="mform__patient-n">1.</span>
              <div className="mform__input">Jméno</div>
              <div className="mform__input">Příjmení</div>
            </div>
            <div className="mform__add-patient">+ Přidat pacienta</div>
          </div>
        </div>
      </div>
      <MapArea />
    </>
  )
}

function BoardScreen() {
  return (
    <div className="mboard">
      <div className="mboard__header">
        <div className="mboard__corner" />
        {BOARD_COLS.map(c => <div key={c} className="mboard__col-hdr">{c}</div>)}
      </div>
      {BOARD_DATA.map(row => (
        <div key={row.lbl} className="mboard__row">
          <div className="mboard__row-lbl">{row.lbl}</div>
          {row.cells.map(([id, color], ci) => (
            <div key={ci} className={`mboard__cell ${id ? `mboard__cell--${color}` : 'mboard__cell--empty'}`}>
              {id}
            </div>
          ))}
        </div>
      ))}
      <div className="mboard__events">
        {EVENT_CARDS.slice(0, 3).map((e, i) => (
          <div key={i} className={`mboard__ev mboard__ev--u${e.urg}`}>
            <span className="mboard__ev-time">{e.time}</span>
            <span className="mboard__ev-loc">{e.loc}</span>
            <span className={`mboard__ev-badge mboard__ev-badge--${e.col}`}>{e.badge}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsRegionScreen() {
  return (
    <>
      <div className="mockup__events-panel">
        <div className="mockup__tabs">
          <span className="mockup__tab">Čekající (1)</span>
          <span className="mockup__tab mockup__tab--active">Aktivní (7)</span>
          <span className="mockup__tab">Plán. (12)</span>
        </div>
        <div className="mreg">
          {REGIONS.map(r => (
            <div key={r.name} className="mreg__group">
              <div className="mreg__name">{r.name}</div>
              {r.stations.map(s => (
                <div key={s.name} className="mreg__station">
                  <div className="mreg__station-name">{s.name}</div>
                  <div className="mreg__units">
                    {s.units.map(u => (
                      <span key={u.id} className={`mreg__unit mreg__unit--${u.c}`}>{u.id}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MapArea />
    </>
  )
}

// ─── Main mockup component ─────────────────────────────────────────

const SIDEBAR = [
  { id: 'new-event', icon: '＋', isNew: true },
  { id: 'map', icon: '◎' },
  { id: 'board', icon: '⊞' },
  { id: 'three-in-one', icon: '⊡' },
  { id: 'events', icon: '≡' },
  { id: 'chat', icon: '✉' },
]

export function DispatchMockup({ caption }) {
  const [screen, setScreen] = useState('map')

  return (
    <div className="szos__mockup-wrap">
      <div className="mockup">
        <div className="mockup__bar">
          <div className="mockup__dots">
            <span className="mockup__dot mockup__dot--red" />
            <span className="mockup__dot mockup__dot--yellow" />
            <span className="mockup__dot mockup__dot--green" />
          </div>
          <span className="mockup__title">SmartZOS · ZZS JMK</span>
          <span className="mockup__live">● LIVE</span>
        </div>
        <div className="mockup__body">

          <div className="mockup__sidebar">
            {SIDEBAR.map(item => (
              <button
                key={item.id}
                className={`mockup__icon ${screen === item.id ? 'mockup__icon--active' : ''} ${item.isNew ? 'mockup__icon--new' : ''}`}
                onClick={() => setScreen(item.id)}
              >
                {item.icon}
              </button>
            ))}
            <div className="mockup__sidebar-spacer" />
            <div className="mockup__icon"><span className="mockup__status-dot" /></div>
            <div className="mockup__live-pill">LIVE</div>
            <div className="mockup__icon mockup__icon--sm">⏻</div>
          </div>

          <div className="mockup__screen">
            {(screen === 'map' || screen === 'chat') && <><EventsPanel /><MapArea /></>}
            {screen === 'new-event' && <NewEventScreen />}
            {screen === 'board' && <BoardScreen />}
            {screen === 'three-in-one' && <><EventsPanel narrow /><MapArea /></>}
            {screen === 'events' && <EventsRegionScreen />}
          </div>

        </div>
      </div>
      <p className="szos__mockup-caption">{caption}</p>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────

export default function SmartZOS() {
  const { t } = useLang()
  const s = t.szos

  const [headerRef, headerInView] = useInView()
  const [mockupRef, mockupInView] = useInView()
  const [featRef, featInView] = useInView()
  const [archRef, archInView] = useInView()
  const [metricsRef, metricsInView] = useInView()
  const [codeRef, codeInView] = useInView()

  const [activeNode, setActiveNode] = useState(null)
  const nodeHandlers = (id) => ({
    onMouseEnter: () => setActiveNode(id),
    onMouseLeave: () => setActiveNode((prev) => (prev === id ? null : prev)),
    onFocus: () => setActiveNode(id),
    onBlur: () => setActiveNode((prev) => (prev === id ? null : prev)),
    onClick: () => setActiveNode((prev) => (prev === id ? null : id)),
  })

  return (
    <section className="szos" id="smartzos">
      <div className="szos__glow" aria-hidden="true" />
      <div className="szos__inner">

        <div className="szos__header" ref={headerRef}>
          <div className={`fade-up ${headerInView ? 'visible' : ''}`}>
            <span className="section-label">{s.label}</span>
            <h2 className="szos__title">SmartZOS</h2>
            <p className="szos__subtitle">{s.subtitle}</p>
          </div>
          <div className={`szos__pills fade-up d2 ${headerInView ? 'visible' : ''}`}>
            {['React Native 0.83', 'Mapbox', 'Firebase', 'SQLite', 'Apple MPC', 'iOS / iPad'].map(pill => (
              <span key={pill} className="szos__pill">{pill}</span>
            ))}
          </div>
        </div>

        <div className={`fade-up d2 ${mockupInView ? 'visible' : ''}`} ref={mockupRef}>
          <DispatchMockup caption={s.caption} />
        </div>

        <div className="szos__features" ref={featRef}>
          <div className={`szos__features-header fade-up ${featInView ? 'visible' : ''}`}>
            <h3 className="szos__section-heading">{s.whatIBuilt}</h3>
          </div>
          <div className="szos__feature-grid">
            {s.features.map((f, i) => (
              <div key={f.title} className={`szos-feat fade-up ${featInView ? 'visible' : ''} d${i + 1}`}>
                <div className="szos-feat__icon">{FEAT_ICONS[i]}</div>
                <h4 className="szos-feat__title">{f.title}</h4>
                <p className="szos-feat__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="szos__arch" ref={archRef}>
          <div className={`fade-up ${archInView ? 'visible' : ''}`}>
            <h3 className="szos__section-heading">{s.archTitle}</h3>
            <p className="szos__arch-sub">{s.archSub}</p>
          </div>
          <div className={`szos__arch-diagram fade-up d2 ${archInView ? 'visible' : ''}`}>
            <div className={`arch-box arch-box--primary ${activeNode ? 'arch-box--active' : ''}`}>
              <div className="arch-box__label">{s.arch.appState}</div>
              <div className="arch-box__sub">{s.arch.appStateSub}</div>
            </div>
            <div className="arch-arrows">
              <div className={`arch-arrow ${activeNode === 'firebase' ? 'arch-arrow--active' : ''}`}>
                <button type="button" className={`arch-node ${activeNode === 'firebase' ? 'arch-node--active' : ''}`} {...nodeHandlers('firebase')}>
                  <div className="arch-node__label">{s.arch.firebase}</div>
                  <div className="arch-node__sub">{s.arch.firebaseSub}</div>
                </button>
              </div>
              <div className={`arch-arrow ${activeNode === 'sqlite' ? 'arch-arrow--active' : ''}`}>
                <button type="button" className={`arch-node ${activeNode === 'sqlite' ? 'arch-node--active' : ''}`} {...nodeHandlers('sqlite')}>
                  <div className="arch-node__label">{s.arch.sqlite}</div>
                  <div className="arch-node__sub">{s.arch.sqliteSub}</div>
                </button>
              </div>
            </div>
            <div className={`arch-peer ${activeNode === 'mpc' ? 'arch-peer--active' : ''}`}>
              <svg className="arch-peer__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M6 11l6-6 6 6" stroke="rgba(0,113,227,0.5)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <button type="button" className={`arch-node arch-node--peer ${activeNode === 'mpc' ? 'arch-node--active' : ''}`} {...nodeHandlers('mpc')}>
                <div className="arch-node__label">{s.arch.mpc}</div>
                <div className="arch-node__sub">{s.arch.mpcSub}</div>
              </button>
            </div>
          </div>
        </div>

        <div className="szos__metrics" ref={metricsRef}>
          {s.metrics.map((m, i) => (
            <div key={m.value} className={`szos__metric fade-up ${metricsInView ? 'visible' : ''} d${i + 1}`}>
              <div className="szos__metric-value"><AnimatedMetricValue value={m.value} active={metricsInView} /></div>
              <div className="szos__metric-label">{m.label}</div>
              <div className="szos__metric-note">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="szos__code" ref={codeRef}>
          <div className={`fade-up ${codeInView ? 'visible' : ''}`}>
            <h3 className="szos__section-heading">{s.codeTitle}</h3>
            <p className="szos__code-sub">{s.codeSub}</p>
          </div>
          <div className={`szos__code-block fade-up d2 ${codeInView ? 'visible' : ''}`}>
            <div className="szos__code-bar">
              <span className="szos__code-dot" /><span className="szos__code-dot" /><span className="szos__code-dot" />
              <span className="szos__code-filename">AppMenu.js · SmartZOS</span>
            </div>
            <pre className="szos__pre"><code><HighlightedCode code={CODE_SNIPPET} /></code></pre>
          </div>
        </div>

      </div>
    </section>
  )
}
