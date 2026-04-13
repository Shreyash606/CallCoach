import type { CallScore, StepScore } from '../types'
import TypewriterText from './TypewriterText'

function scoreClass(pct: number) {
  if (pct >= 80) return 'high'
  if (pct >= 50) return 'mid'
  return 'low'
}

interface StepItemProps {
  step: StepScore
  index: number
}

function StepItem({ step, index }: StepItemProps) {
  const cls = step.passed ? 'passed' : 'failed'
  const baseDelay = index * 60
  return (
    <div className="step-item">
      <div className="step-header">
        <div className={`step-icon ${cls}`}>{step.passed ? '✓' : '✗'}</div>
        <div className="step-body">
          <div className="step-title-row">
            <span className="step-num">Step {step.step_number}</span>
            <span className="step-name">— {step.step_name}</span>
            {!step.passed && <span className="needs-work">needs work</span>}
          </div>

          <p className="step-evidence">
            <TypewriterText text={step.evidence} delay={baseDelay} />
          </p>

          {step.quote && (
            <blockquote className="step-quote">
              "<TypewriterText text={step.quote} delay={baseDelay + 200} />"
            </blockquote>
          )}

          {!step.passed && step.suggestion && (
            <div className="step-suggestion">
              <p className="suggestion-header">What to say instead</p>
              <p className="suggestion-text">
                "<TypewriterText text={step.suggestion} delay={baseDelay + 400} />"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props {
  score: CallScore
  producerName?: string
}

export default function ScoreCard({ score, producerName }: Props) {
  const cls = scoreClass(score.percentage)
  const passedSteps = score.steps.filter((s) => s.passed).length
  const failedSteps = score.steps.filter((s) => !s.passed).length

  return (
    <div className="card score-card">
      {/* Summary */}
      <div className="score-summary">
        <div className="score-summary-left">
          <h3>
            {producerName ? `${producerName} — Call Scorecard` : 'Call Scorecard'}
          </h3>
          <div className="score-meta-row">
            <span>✓ {passedSteps} passed</span>
            <span>✗ {failedSteps} failed</span>
            <span>{score.overall_score} / {score.total_steps} steps</span>
          </div>

          <div className="progress-wrap">
            <div className="progress-bg">
              <div
                className={`progress-fill ${cls}`}
                style={{ width: `${score.percentage}%` }}
              />
            </div>
            <div className="progress-labels">
              <span>0%</span>
              <span>{score.percentage}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className={`score-badge ${cls}`}>
          <span className="badge-number">{score.percentage}%</span>
          <span className="badge-label">
            {score.percentage >= 80 ? 'Strong' : score.percentage >= 50 ? 'Developing' : 'Needs work'}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="steps-list">
        {score.steps.map((step, i) => (
          <StepItem key={step.step_number} step={step} index={i} />
        ))}
      </div>
    </div>
  )
}
