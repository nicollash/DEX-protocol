import { SAVE_PROVIDER } from './constants'

export function saveProvider(payload) {
  return {
    type: SAVE_PROVIDER,
    payload,
  }
}