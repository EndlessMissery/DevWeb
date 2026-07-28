import { useEffect, useState } from 'react'
import { parseAnimatedValue } from '../utils/animateMetricValue'

const DURATION = 1200

export default function AnimatedMetricValue({ value, active }) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!active) return

    const render = parseAnimatedValue(value)
    const start = performance.now()
    let raf

    function tick(now) {
      const t = Math.min((now - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(t >= 1 ? value : render(eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [active, value])

  return display
}
