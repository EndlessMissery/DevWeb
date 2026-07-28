import { tokenizeCode } from '../utils/highlightCode'
import './HighlightedCode.css'

export default function HighlightedCode({ code }) {
  const tokens = tokenizeCode(code)
  return (
    <>
      {tokens.map((t, i) => (t.cls ? <span key={i} className={t.cls}>{t.text}</span> : t.text))}
    </>
  )
}
