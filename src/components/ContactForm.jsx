import { useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { useLang } from '../context/LangContext'
import { supabase } from '../lib/supabase'
import './ContactForm.css'

const CATEGORIES = ['collaboration', 'job', 'other']
const SANITIZE_OPTS = { ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'br', 'p'] }

function exec(command) {
  document.execCommand(command, false, undefined)
}

export default function ContactForm() {
  const { t } = useLang()
  const f = t.contact.form
  const editorRef = useRef(null)

  const [category, setCategory] = useState('collaboration')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleToolbarClick = (e, command) => {
    e.preventDefault()
    exec(command)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const html = editorRef.current?.innerHTML.trim() || ''
    const clean = DOMPurify.sanitize(html, SANITIZE_OPTS)
    if (!name.trim() || !email.trim() || !subject.trim() || !clean) return

    if (honeypot) {
      // Bot filled the hidden field — pretend success, send nothing.
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      if (editorRef.current) editorRef.current.innerHTML = ''
      return
    }

    setStatus('sending')
    const { error } = await supabase.from('messages').insert({
      category,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      content: clean,
    })

    if (error) {
      setStatus('error')
      return
    }

    setStatus('success')
    setName('')
    setEmail('')
    setSubject('')
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3 className="contact-form__heading">{f.heading}</h3>

      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="contact-form__honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-form__categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`contact-form__cat ${category === cat ? 'contact-form__cat--active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {f.categories[cat]}
          </button>
        ))}
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-name">{f.name}</label>
          <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-email">{f.email}</label>
          <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-subject">{f.subject}</label>
        <input id="cf-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>

      <div className="contact-form__field">
        <label>{f.message}</label>
        <div className="contact-form__editor-toolbar">
          <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'bold')} aria-label={f.bold}><b>B</b></button>
          <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'italic')} aria-label={f.italic}><i>I</i></button>
          <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'insertUnorderedList')} aria-label={f.list}>•—</button>
        </div>
        <div
          ref={editorRef}
          className="contact-form__editor"
          contentEditable
          data-placeholder={f.messagePlaceholder}
          suppressContentEditableWarning
        />
      </div>

      <button type="submit" className="contact-form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </button>

      {status === 'success' && <p className="contact-form__status contact-form__status--ok">{f.success}</p>}
      {status === 'error' && <p className="contact-form__status contact-form__status--err">{f.error}</p>}
    </form>
  )
}
