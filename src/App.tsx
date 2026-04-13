import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import TranscriptInput from './components/TranscriptInput'
import ScoreCard from './components/ScoreCard'
import type { CallScore } from './types'

export default function App() {
  const [score, setScore] = useState<CallScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [producerName, setProducerName] = useState('')

  async function handleScore(transcript: string, name: string) {
    setLoading(true)
    setError(null)
    setScore(null)
    setProducerName(name)

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })

      const data = await res.json() as CallScore | { error: string }

      if (!res.ok) {
        throw new Error('error' in data ? data.error : `Server error ${res.status}`)
      }

      setScore(data as CallScore)

      // Scroll to results
      setTimeout(() => {
        document.querySelector('.score-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <TranscriptInput onScore={handleScore} loading={loading} />

        {error && (
          <div className="error-banner">
            <strong>Error: </strong>{error}
          </div>
        )}

        {score && <ScoreCard score={score} producerName={producerName} />}
      </main>
    </div>
  )
}
