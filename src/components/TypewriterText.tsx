import { useState, useEffect } from 'react'

interface Props {
  text: string
  speed?: number   // ms per character
  delay?: number   // ms before typing starts
}

export default function TypewriterText({ text, speed = 14, delay = 0 }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)

    let interval: ReturnType<typeof setInterval>

    const startTimer = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      clearInterval(interval)
    }
  }, [text, speed, delay])

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}
