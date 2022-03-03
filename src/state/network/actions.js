import { CHANGE_NETWORK } from './constants'

export function changeNetwork(payload) {
  return { type: CHANGE_NETWORK, payload }
}
