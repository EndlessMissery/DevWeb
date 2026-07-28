const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await',
  'import', 'export', 'from', 'default', 'new', 'class', 'extends', 'this',
  'typeof', 'of', 'in', 'for', 'while', 'do', 'try', 'catch', 'finally',
  'throw', 'switch', 'case', 'break', 'continue', 'null', 'undefined',
  'true', 'false', 'void', 'yield', 'static', 'get', 'set', 'super',
  'delete', 'instanceof',
])

const TOKEN_RE =
  /(\/\/[^\n]*)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|(\b[A-Za-z_$][\w$]*\b)|([{}()[\];,.:?])|(=>|[=+\-*/%<>!&|]+)/g

// Tokenizes a JS-ish snippet into { text, cls } spans for lightweight IDE-style highlighting.
export function tokenizeCode(code) {
  const tokens = []
  let lastIndex = 0
  let match

  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), cls: null })
    }

    const [full, comment, str, num, fnCall, word, punct, op] = match
    if (comment) tokens.push({ text: comment, cls: 'tok-comment' })
    else if (str) tokens.push({ text: str, cls: 'tok-string' })
    else if (num) tokens.push({ text: num, cls: 'tok-number' })
    else if (fnCall) tokens.push({ text: fnCall, cls: 'tok-fn' })
    else if (word) tokens.push({ text: word, cls: KEYWORDS.has(word) ? 'tok-keyword' : null })
    else if (punct) tokens.push({ text: punct, cls: 'tok-punct' })
    else if (op) tokens.push({ text: op, cls: 'tok-op' })

    lastIndex = match.index + full.length
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), cls: null })
  }

  return tokens
}
