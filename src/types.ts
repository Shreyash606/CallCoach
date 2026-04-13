export interface StepScore {
  step_number: number
  step_name: string
  passed: boolean
  evidence: string
  quote: string | null
  suggestion: string | null
}

export interface CallScore {
  overall_score: number
  total_steps: number
  percentage: number
  steps: StepScore[]
}

export interface ScoreRequest {
  transcript: string
  producer_name?: string
}
