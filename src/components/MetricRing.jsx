import { useMemo } from 'react'
import { parseMetricChart } from '../utils/animateMetricValue'
import { useEasedProgress } from '../hooks/useEasedProgress'
import AnimatedMetricValue from './AnimatedMetricValue'

const SIZE = 128
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function MetricRing({ value, accent, active }) {
  const chart = useMemo(() => parseMetricChart(value), [value])
  const t = useEasedProgress(active, value)

  const arc = useMemo(() => {
    if (!chart) return null
    if (chart.kind === 'point') {
      const length = (chart.max / 100) * CIRCUMFERENCE * t
      return { dasharray: `${length} ${CIRCUMFERENCE}`, dashoffset: 0 }
    }
    const bandLength = ((chart.max - chart.min) / 100) * CIRCUMFERENCE * t
    const startOffset = -(chart.min / 100) * CIRCUMFERENCE
    return { dasharray: `${bandLength} ${CIRCUMFERENCE}`, dashoffset: startOffset }
  }, [chart, t])

  return (
    <div className="stat-ring">
      <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          className="stat-ring__track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
        />
        {arc && (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            fill="none"
            stroke={accent}
            strokeLinecap="round"
            strokeDasharray={arc.dasharray}
            strokeDashoffset={arc.dashoffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        )}
      </svg>
      <div className="stat-ring__center">
        {chart ? (
          <span className="stat-ring__value" style={{ color: accent }}>
            <AnimatedMetricValue value={value} active={active} />
          </span>
        ) : (
          <svg className="stat-ring__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.35 + t * 0.65, color: accent }}>
            <path d="M4 15l6-6 4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}
