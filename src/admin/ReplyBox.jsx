import { useRef, useState } from 'react'

function exec(command) {
  document.execCommand(command, false, undefined)
}

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

export default function ReplyBox({ toEmail, toName, defaultSubject }) {
  const editorRef = useRef(null)
  const [subject, setSubject] = useState(defaultSubject)

  const handleToolbarClick = (e, command) => {
    e.preventDefault()
    exec(command)
  }

  const openInMail = () => {
    const html = editorRef.current?.innerHTML.trim() || ''
    const body = htmlToPlainText(html)
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
      <div className="admin-reply__toolbar">
        <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'bold')} aria-label="Tučně"><b>B</b></button>
        <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'italic')} aria-label="Kurzíva"><i>I</i></button>
        <button type="button" onMouseDown={(e) => handleToolbarClick(e, 'insertUnorderedList')} aria-label="Seznam">•—</button>
      </div>
      <div
        ref={editorRef}
        className="admin-reply__editor"
        contentEditable
        data-placeholder="Napiš odpověď…"
        suppressContentEditableWarning
      />
      <button type="button" className="admin-reply__send" onClick={openInMail}>
        Otevřít v e-mailu
      </button>
    </div>
  )
}
