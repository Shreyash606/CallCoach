import 'dotenv/config'
import express from 'express'
import { scoreCall } from './scorer.js'

const app = express()
app.use(express.json({ limit: '1mb' }))

const PORT = 3001

app.post('/api/score', async (req, res) => {
  try {
    const { transcript } = req.body as { transcript?: string }

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 50) {
      res.status(400).json({ error: 'A call transcript of at least 50 characters is required.' })
      return
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({
        error: 'ANTHROPIC_API_KEY is not set. Add it to your .env file and restart the server.',
      })
      return
    }

    console.log(`[scorer] Scoring transcript (${transcript.length} chars)...`)
    const score = await scoreCall(transcript.trim())
    console.log(`[scorer] Done — ${score.overall_score}/${score.total_steps} (${score.percentage}%)`)

    res.json(score)
  } catch (err) {
    console.error('[scorer] Error:', err)
    const message = err instanceof Error ? err.message : 'Failed to score call'
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`\nAPI server → http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠  ANTHROPIC_API_KEY not found. Copy .env.example to .env and add your key.\n')
  }
})
