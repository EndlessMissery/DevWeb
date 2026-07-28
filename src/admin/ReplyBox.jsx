import { useRef, useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'

function htmlToPlainText(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  el.querySelectorAll('li').forEach((li) => {
    li.textContent = `- ${li.textContent}`
  })
  el.querySelectorAll('p, li, br').forEach((node) => {
    node.insertAdjacentText('afterend', '\n')
  })
  return el.textContent.replace(/\n{3,}/g, '\n\n').trim()
}

function quoteText(text) {
  return text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')
}

export default function ReplyBox({ toEmail, toName, defaultSubject, originalContent, originalDate }) {
  const editorRef = useRef(null)
  const [subject, setSubject] = useState(defaultSubject)

  const openInMail = () => {
    const html = editorRef.current?.getHTML() || ''
    let body = htmlToPlainText(html)

    if (originalContent) {
      const quoted = quoteText(htmlToPlainText(originalContent))
      const when = originalDate ? new Date(originalDate).toLocaleString('cs-CZ') : ''
      body += `\n\n${toName || toEmail} napsal(a)${when ? ` ${when}` : ''}:\n${quoted}`
    }

    const url = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
  }

  return (
    <div className="admin-reply">
      <span className="admin-reply__label">Odpovědět {toName ? `— ${toName}` : ''}</span>
      <input
        className="admin-reply__subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Předmět"
      />
      <RichTextEditor ref={editorRef} placeholder="Napiš odpověď…" labels={{ bold: 'Tučně', italic: 'Kurzíva', bulletList: 'Seznam' }} />
      <button type="button" className="admin-reply__send" onClick={openInMail}>
        Otevřít v e-mailu
      </button>
    </div>
  )
}
