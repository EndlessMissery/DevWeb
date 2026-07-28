import { useEffect, useState } from 'react'

const DURATION = 1200

// Runs an easeOutCubic 0→1 animation once `active` and `dep` become truthy.
// `dep` should be a value that's stable across re-renders (e.g. memoized) so the
// animation doesn't restart on every parent render.
export function useEasedProgress(active, dep) {
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!active || !dep) return

    const start = performance.now()
    let raf

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1)
      setT(1 - Math.pow(1 - progress, 3))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [active, dep])

  return t
}
