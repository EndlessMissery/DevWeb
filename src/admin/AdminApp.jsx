import { useEffect, useState } from 'react'
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
  const [openId, setOpenId] = useState(null)

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
      })
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = messages.filter((m) => !m.read).length

  const openMessage = async (msg) => {
    setOpenId(openId === msg.id ? null : msg.id)
    if (!msg.read) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
      await supabase.from('messages').update({ read: true }).eq('id', msg.id)
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Zprávy {unreadCount > 0 && <span className="admin-dashboard__badge">{unreadCount}</span>}</h1>
        </div>
        <div className="admin-dashboard__actions">
          <button onClick={toggle}>{theme === 'light' ? 'Tmavý' : 'Světlý'} režim</button>
          <button onClick={() => supabase.auth.signOut()}>Odhlásit se</button>
        </div>
      </header>

      {loading && <p className="admin-dashboard__empty">Načítám…</p>}
      {!loading && messages.length === 0 && <p className="admin-dashboard__empty">Zatím žádné zprávy.</p>}

      <ul className="admin-dashboard__list">
        {messages.map((msg) => (
          <li key={msg.id} className={`admin-msg ${!msg.read ? 'admin-msg--unread' : ''}`}>
            <button className="admin-msg__row" onClick={() => openMessage(msg)}>
              <span className="admin-msg__dot" />
              <span className="admin-msg__cat">{CATEGORY_LABEL[msg.category] || msg.category}</span>
              <span className="admin-msg__name">{msg.name}</span>
              <span className="admin-msg__subject">{msg.subject}</span>
              <span className="admin-msg__email">{msg.email}</span>
              <span className="admin-msg__date">{new Date(msg.created_at).toLocaleString('cs-CZ')}</span>
            </button>
            {openId === msg.id && (
              <>
                <div
                  className="admin-msg__content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(msg.content, {
                      ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'br', 'p'],
                    }),
                  }}
                />
                <ReplyBox
                  key={msg.id}
                  toEmail={msg.email}
                  toName={msg.name}
                  defaultSubject={`Re: ${msg.subject}`}
                />
              </>
            )}
          </li>
        ))}
      </ul>
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
