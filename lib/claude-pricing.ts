/**
 * Claude (Anthropic) API pricing for AI features (Co-Pilot, analyses, evaluations).
 * Source: https://claude.com/pricing#api
 * All prices USD per million tokens (MTok). We apply a 50% margin on API cost for customer billing.
 * Customer-facing product name: MIT-AI (no reference to underlying provider).
 */

export const CLAUDE_MARGIN_PERCENT = 50

/** Customer-facing name for AI features (no mention of underlying provider). */
export const AI_PRODUCT_NAME_CUSTOMER = 'MIT-AI'

/** USD per 1M input tokens (prompts ≤200K context). */
export const CLAUDE_API_INPUT_USD_PER_MTOK: Record<string, number> = {
  'opus-4': 5,
  'sonnet-4': 3,
  'haiku-4': 1,
}

/** USD per 1M output tokens (completion ≤200K context). */
export const CLAUDE_API_OUTPUT_USD_PER_MTOK: Record<string, number> = {
  'opus-4': 25,
  'sonnet-4': 15,
  'haiku-4': 5,
}

export type ClaudeModelId = keyof typeof CLAUDE_API_INPUT_USD_PER_MTOK

/** Default model for Co-Pilot and short analyses (good balance of cost/quality). */
export const DEFAULT_CLAUDE_MODEL: ClaudeModelId = 'sonnet-4'

export interface ClaudeUsage {
  inputTokens: number
  outputTokens: number
  model?: ClaudeModelId
}

export interface ClaudeCostBreakdown {
  /** API cost (Anthropic) in USD */
  apiCostUsd: number
  /** Customer price with margin (API cost × 1.5) in USD */
  customerPriceUsd: number
  marginPercent: number
  model: ClaudeModelId
  inputTokens: number
  outputTokens: number
  /** Human-readable summary */
  summary: string
}

/**
 * Compute Claude API cost and customer price (API cost + 50% margin).
 * Token counts can be from real API response usage or estimated (e.g. ~500 input + 200 output per Co-Pilot question).
 */
export function computeClaudeCost(usage: ClaudeUsage): ClaudeCostBreakdown {
  const model = (usage.model ?? DEFAULT_CLAUDE_MODEL) as ClaudeModelId
  const inputPerM = usage.inputTokens / 1_000_000
  const outputPerM = usage.outputTokens / 1_000_000
  const inputRate = CLAUDE_API_INPUT_USD_PER_MTOK[model] ?? CLAUDE_API_INPUT_USD_PER_MTOK[DEFAULT_CLAUDE_MODEL]
  const outputRate = CLAUDE_API_OUTPUT_USD_PER_MTOK[model] ?? CLAUDE_API_OUTPUT_USD_PER_MTOK[DEFAULT_CLAUDE_MODEL]
  const apiCostUsd = inputPerM * inputRate + outputPerM * outputRate
  const customerPriceUsd = apiCostUsd * (1 + CLAUDE_MARGIN_PERCENT / 100)

  return {
    apiCostUsd: Math.round(apiCostUsd * 1e6) / 1e6,
    customerPriceUsd: Math.round(customerPriceUsd * 1e6) / 1e6,
    marginPercent: CLAUDE_MARGIN_PERCENT,
    model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    summary: `Claude ${model}: ${usage.inputTokens.toLocaleString()} in / ${usage.outputTokens.toLocaleString()} out → API $${apiCostUsd.toFixed(4)} → customer $${customerPriceUsd.toFixed(4)} (+${CLAUDE_MARGIN_PERCENT}% margin)`,
  }
}

/** Typical usage per Co-Pilot "Ask" (one question + one short answer). Approx. 500 input + 200 output tokens. */
export const TYPICAL_COPILOT_INPUT_TOKENS = 500
export const TYPICAL_COPILOT_OUTPUT_TOKENS = 200

/** Cost for one typical Co-Pilot request (Sonnet), with 50% margin. */
export function getTypicalCopilotRequestCost(): ClaudeCostBreakdown {
  return computeClaudeCost({
    inputTokens: TYPICAL_COPILOT_INPUT_TOKENS,
    outputTokens: TYPICAL_COPILOT_OUTPUT_TOKENS,
    model: DEFAULT_CLAUDE_MODEL,
  })
}

/** Estimate monthly AI cost from number of requests (e.g. Co-Pilot questions + analyses). */
export function estimateMonthlyClaudeCost(
  requestCount: number,
  inputTokensPerRequest: number = TYPICAL_COPILOT_INPUT_TOKENS,
  outputTokensPerRequest: number = TYPICAL_COPILOT_OUTPUT_TOKENS,
  model: ClaudeModelId = DEFAULT_CLAUDE_MODEL
): ClaudeCostBreakdown {
  return computeClaudeCost({
    inputTokens: requestCount * inputTokensPerRequest,
    outputTokens: requestCount * outputTokensPerRequest,
    model,
  })
}

/** Reference table for admin/billing: model, API price (in/out), and customer price with 50% margin. */
export function getClaudePricingReference(): {
  model: string
  inputUsdPerM: number
  outputUsdPerM: number
  marginPercent: number
  customerInputUsdPerM: number
  customerOutputUsdPerM: number
  source: string
}[] {
  return (Object.keys(CLAUDE_API_INPUT_USD_PER_MTOK) as ClaudeModelId[]).map((model) => {
    const inRate = CLAUDE_API_INPUT_USD_PER_MTOK[model]
    const outRate = CLAUDE_API_OUTPUT_USD_PER_MTOK[model]
    const factor = 1 + CLAUDE_MARGIN_PERCENT / 100
    return {
      model,
      inputUsdPerM: inRate,
      outputUsdPerM: outRate,
      marginPercent: CLAUDE_MARGIN_PERCENT,
      customerInputUsdPerM: Math.round(inRate * factor * 10000) / 10000,
      customerOutputUsdPerM: Math.round(outRate * factor * 10000) / 10000,
      source: 'https://claude.com/pricing#api',
    }
  })
}
