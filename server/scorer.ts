import Anthropic from '@anthropic-ai/sdk'
import type { CallScore } from '../src/types.js'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert insurance sales call evaluator. Analyze the provided transcript and score it against the 6-step script.

THE 6-STEP SCRIPT:

Step 1 — Strong open
Check for ALL of: good energy/enthusiasm, addressed prospect by name, asked permission to ask questions, and set the frame/purpose of the call. All four elements should be present to pass.

Step 2 — Qualifying questions
Check for questions about: (1) current carrier/coverage, (2) number of vehicles, (3) whether they own or rent, (4) any exploration of bundling opportunity. Must cover at least 3 of these to pass.

Step 3 — Bundle presentation
CRITICAL: If the prospect owns a home, the producer MUST present both auto AND home together as a package. Presenting only auto is a FAIL when home ownership is known. The presentation should emphasize value and savings, not just recite a price.

Step 4 — Objection handling
When the prospect raises a price objection OR says "let me think about it" / "I'll call you back" / "I'm happy with my current carrier" — did the producer acknowledge it, reframe the value, and ask what's holding them back? Simply accepting the objection is a FAIL.

Step 5 — Close attempt
Did the producer make an explicit, direct ask to bind or start the policy? Phrases like "Are you ready to get this started today?" or "Can we get that locked in now?" PASS. Saying only "I'll send you a quote" or "I'll follow up" is a FAIL — those are NOT close attempts.

Step 6 — Follow-up set
Did the producer lock in a SPECIFIC day AND time for the next contact? ("Tuesday at 10am" PASSES. "I'll call you back" or "I'll send that over" FAILS.) Both a day and a time must be agreed on.

SCORING RULES:
- Be strict. Partial or implied attempts do not pass.
- Pull the most relevant direct quote from the transcript for each step.
- For failed steps, write a specific suggested script the producer should use next time (in first-person voice, as if the producer is saying it).`

const SCORE_SCHEMA = {
  type: 'object',
  properties: {
    overall_score: { type: 'integer' },
    total_steps: { type: 'integer' },
    percentage: { type: 'integer' },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          step_number: { type: 'integer' },
          step_name: { type: 'string' },
          passed: { type: 'boolean' },
          evidence: { type: 'string' },
          quote: { anyOf: [{ type: 'string' }, { type: 'null' }] },
          suggestion: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        },
        required: ['step_number', 'step_name', 'passed', 'evidence', 'quote', 'suggestion'],
        additionalProperties: false,
      },
    },
  },
  required: ['overall_score', 'total_steps', 'percentage', 'steps'],
  additionalProperties: false,
}

export async function scoreCall(transcript: string): Promise<CallScore> {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Score this insurance sales call transcript against the 6-step script:\n\n${transcript}`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: SCORE_SCHEMA,
      },
    },
  } as Parameters<typeof client.messages.create>[0])

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response received from Claude')
  }

  const result = JSON.parse(textBlock.text) as CallScore

  // Ensure percentage is always consistent with score
  result.percentage = Math.round((result.overall_score / result.total_steps) * 100)

  return result
}
