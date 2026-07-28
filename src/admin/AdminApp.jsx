import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import { supabaseAdmin as supabase } from './supabaseAdmin'
import ReplyBox from './ReplyBox'
import './AdminApp.css'

const CATEGORY_LABEL = {
  collaboration: 'Spolupráce',
  job: 'Nabídka práce',
  other: 'Jiné',
}

const CONTENT_TAGS = ['b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'br', 'p']

function htmlToPlainText(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent.replace(/\s+/g, ' ').trim()
}

function relativeTime(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const min = Math.round(diffMs / 60000)
  if (min < 1) return 'právě teď'
  if (min < 60) return `před ${min} min`
  const hrs = Math.round(min / 60)
  if (hrs < 24) return `před ${hrs} h`
  const days = Math.round(hrs / 24)
  if (days < 7) return `před ${days} d`
  return new Date(dateString).toLocaleDateString('cs-CZ')
}

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError('Neplatné přihlašovací údaje.')
  }

  return (
    <div className="admin-login">
      <form className="admin-login__box" onSubmit={handleSubmit}>
        <h1>Přihlášení</h1>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Přihlašuji…' : 'Přihlásit se'}</button>
      </form>
    </div>
  )
}

function Dashboard() {
  const { theme, toggle } = useTheme()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [justArrivedId, setJustArrivedId] = useState(null)

  useEffect(() => {
    let active = true

    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (active) {
          setMessages(data || [])
          setLoading(false)
        }
      })

    const channel = supabase
      .channel('messages-inbox')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [payload.new, ...prev])
        setJustArrivedId(payload.new.id)
        setTimeout(() => setJustArrivedId((id) => (id === payload.new.id ? null : id)), 4000)
      })
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = messages.filter((m) => !m.read).length
  const selected = useMemo(() => messages.find((m) => m.id === selectedId) || null, [messages, selectedId])

  const selectMessage = async (msg) => {
    setSelectedId(msg.id)
    if (!msg.read) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
      await supabase.from('messages').update({ read: true }).eq('id', msg.id)
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Zprávy {unreadCount > 0 && <span className="admin-dashboard__badge">{unreadCount}</span>}</h1>
        <div className="admin-dashboard__actions">
          <button onClick={toggle}>{theme === 'light' ? 'Tmavý' : 'Světlý'} režim</button>
          <button onClick={() => supabase.auth.signOut()}>Odhlásit se</button>
        </div>
      </header>

      <div className="admin-dashboard__body">
        <div className="admin-list">
          {loading && <p className="admin-dashboard__empty">Načítám…</p>}
          {!loading && messages.length === 0 && <p className="admin-dashboard__empty">Zatím žádné zprávy.</p>}

          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>
                <button
                  className={[
                    'admin-msg',
                    !msg.read && 'admin-msg--unread',
                    selectedId === msg.id && 'admin-msg--selected',
                    justArrivedId === msg.id && 'admin-msg--new',
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectMessage(msg)}
                >
                  <span className="admin-msg__top">
                    <span className="admin-msg__name">
                      <span className="admin-msg__dot" />
                      {msg.name}
                    </span>
                    <span className="admin-msg__date">{relativeTime(msg.created_at)}</span>
                  </span>
                  <span className="admin-msg__subject">{msg.subject}</span>
                  <span className="admin-msg__preview">{htmlToPlainText(msg.content)}</span>
                  <span className="admin-msg__cat">{CATEGORY_LABEL[msg.category] || msg.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-detail">
          {!selected && <p className="admin-dashboard__empty admin-detail__placeholder">Vyber zprávu vlevo.</p>}

          {selected && (
            <>
              <div className="admin-detail__header">
                <h2>{selected.subject}</h2>
                <div className="admin-detail__meta">
                  <span>{selected.name}</span>
                  <span>·</span>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  <span>·</span>
                  <span>{new Date(selected.created_at).toLocaleString('cs-CZ')}</span>
                  <span className="admin-detail__cat">{CATEGORY_LABEL[selected.category] || selected.category}</span>
                </div>
              </div>

              <div
                className="admin-detail__content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selected.content, { ALLOWED_TAGS: CONTENT_TAGS }),
                }}
              />

              <ReplyBox
                key={selected.id}
                toEmail={selected.email}
                toName={selected.name}
                defaultSubject={`Re: ${selected.subject}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminInner() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  return session ? <Dashboard /> : <LoginScreen />
}

export default function AdminApp() {
  return (
    <ThemeProvider>
      <AdminInner />
    </ThemeProvider>
  )
}
