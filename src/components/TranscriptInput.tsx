import { useState } from 'react'

const SAMPLE_TRANSCRIPT = `Producer: Good afternoon, this is Sarah calling from the agency. Am I speaking with Michael?

Prospect: Yeah, that's me.

Producer: Hi Michael, great to connect with you! I'm reaching out because we've been helping a lot of homeowners in your area get better coverage at a better price. Do you have just a couple of minutes so I can ask you a few quick questions?

Prospect: Yeah sure, I've got a few minutes.

Producer: Awesome, I appreciate it! So first — can you tell me who you're currently insured with for your auto?

Prospect: I'm with Geico right now.

Producer: Geico, got it. And are you renting or do you own your place?

Prospect: I own a house, been here about four years.

Producer: Perfect. And how many vehicles do you have insured?

Prospect: Just one car.

Producer: Got it. So Michael, here's what I'm seeing — you're a homeowner with one vehicle, and when we bundle home and auto together with us, most people in your situation save anywhere from $150 to $400 a year. It also simplifies everything down to one company, one bill. Does that sound worth taking a look at?

Prospect: I mean, I'm not really looking to switch. I've been pretty happy with Geico.

Producer: That's fair, and I totally respect loyalty. Can I ask — when was the last time someone actually reviewed your policy and compared it against what's out there?

Prospect: Probably when I first signed up, honestly.

Producer: Yeah that's pretty common. Rates change, your situation changes. Let me pull up a quick comparison — worst case, you'll have confirmation you're already getting a great deal. Sound good?

Prospect: Sure, I guess.

Producer: Great. So I'm looking at this now and the numbers are actually looking pretty strong. What I'd like to do is get this quote sent over to you today.

Prospect: Yeah just send it over and I'll take a look.

Producer: Perfect. I'll get that sent your way. Take care Michael!`

interface Props {
  onScore: (transcript: string, producerName: string) => void
  loading: boolean
}

export default function TranscriptInput({ onScore, loading }: Props) {
  const [transcript, setTranscript] = useState('')
  const [producerName, setProducerName] = useState('')

  const canSubmit = transcript.trim().length >= 50 && !loading

  return (
    <div className="card input-card">
      <p className="input-card-title">Score a call</p>
      <p className="input-card-sub">
        Paste a call transcript below. Claude will score it against the 6-step script and explain
        every pass and fail.
      </p>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="producer">Producer name</label>
          <input
            id="producer"
            type="text"
            placeholder="e.g. Sarah K."
            value={producerName}
            onChange={(e) => setProducerName(e.target.value)}
          />
        </div>
      </div>

      <label className="textarea-label" htmlFor="transcript">
        Call transcript
      </label>
      <textarea
        id="transcript"
        className="transcript-textarea"
        placeholder={`Paste transcript here…\n\nOr click "Load sample" below to try a demo call.`}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        spellCheck={false}
      />

      <div className="input-footer">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setTranscript(SAMPLE_TRANSCRIPT)}
            style={{
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.8125rem',
              color: '#64748b',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Load sample
          </button>
          <span className="char-count">{transcript.length.toLocaleString()} chars</span>
        </div>

        <button
          type="button"
          className="score-btn"
          disabled={!canSubmit}
          onClick={() => onScore(transcript, producerName)}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Scoring…
            </>
          ) : (
            'Score call'
          )}
        </button>
      </div>
    </div>
  )
}
