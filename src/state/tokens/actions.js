import { SAVE_TOKENS, SAVE_FILTERED_TOKENS } from './constants'

export function saveTokens(payload) {
  return { type: SAVE_TOKENS, payload }
}

export function saveFilteredTokens(payload) {
  return { type: SAVE_FILTERED_TOKENS, payload }
}
