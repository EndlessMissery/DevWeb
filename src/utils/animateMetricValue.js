function fmt(n, decimals) {
  return n.toFixed(decimals)
}

function decimalsOf(numStr) {
  const i = numStr.indexOf('.')
  return i === -1 ? 0 : numStr.length - i - 1
}

// Builds a `t (0..1) -> string` renderer for a metric value like
// "50–70 %", "0.72→0.83", "–90%", "3→1", "4+", "700+".
// Only the numeric magnitude animates; separators/signs/units stay put.
export function parseAnimatedValue(value) {
  let m

  if ((m = value.match(/^([\d.]+)(→)([\d.]+)(.*)$/))) {
    const [, a, arrow, b, rest] = m
    const da = decimalsOf(a), db = decimalsOf(b)
    const na = parseFloat(a), nb = parseFloat(b)
    return (t) => `${fmt(na * t, da)}${arrow}${fmt(nb * t, db)}${rest}`
  }

  if ((m = value.match(/^(\d+(?:\.\d+)?)(–)(\d+(?:\.\d+)?)(.*)$/))) {
    const [, a, dash, b, rest] = m
    const da = decimalsOf(a), db = decimalsOf(b)
    const na = parseFloat(a), nb = parseFloat(b)
    return (t) => `${fmt(na * t, da)}${dash}${fmt(nb * t, db)}${rest}`
  }

  if ((m = value.match(/^([–~])(\d+(?:\.\d+)?)(.*)$/))) {
    const [, prefix, a, rest] = m
    const da = decimalsOf(a)
    const na = parseFloat(a)
    return (t) => `${prefix}${fmt(na * t, da)}${rest}`
  }

  if ((m = value.match(/^(\d+(?:\.\d+)?)(.*)$/))) {
    const [, a, rest] = m
    const da = decimalsOf(a)
    const na = parseFloat(a)
    return (t) => `${fmt(na * t, da)}${rest}`
  }

  return () => value
}

// Extracts a chartable magnitude for percentage-style metrics — used to draw
// an animated bar under the number. Returns null when the value isn't a plain
// percentage (versions like "0.72→0.83" or counts like "3→1" get no bar).
export function parseMetricChart(value) {
  let m

  if ((m = value.match(/^(\d+(?:\.\d+)?)–(\d+(?:\.\d+)?)\s*%$/))) {
    const [, a, b] = m
    return { kind: 'range', min: parseFloat(a), max: parseFloat(b) }
  }

  if ((m = value.match(/^[–~]?(\d+(?:\.\d+)?)\s*%$/))) {
    const [, a] = m
    return { kind: 'point', min: 0, max: parseFloat(a) }
  }

  return null
}
