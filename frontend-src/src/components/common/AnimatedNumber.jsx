import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

/**
 * AnimatedNumber — Smoothly counts from the previous value to the new one.
 *
 * Props:
 *  value     {number}              the target number
 *  format    {(n: number) => string}  formatter (default: rounded locale string)
 *  prefix    {string}              prepended to the formatted output (e.g. "₹")
 *  suffix    {string}              appended  (e.g. "%")
 *  duration  {number}              animation duration in seconds (default 0.9)
 *  className {string}
 */
export default function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString('en-IN'),
  prefix = '',
  suffix = '',
  duration = 0.9,
  className = '',
}) {
  const nodeRef = useRef(null)
  const prevRef = useRef(0)

  useEffect(() => {
    const from   = prevRef.current
    const to     = Number(value) || 0
    prevRef.current = to

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (nodeRef.current) {
          nodeRef.current.textContent = prefix + format(v) + suffix
        }
      },
    })
    return () => controls.stop()
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const initial = prefix + format(Number(value) || 0) + suffix
  return (
    <span ref={nodeRef} className={className}>
      {initial}
    </span>
  )
}
