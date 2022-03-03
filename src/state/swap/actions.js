import { UPDATE_SWAP_TRANSACTION } from './constants'

export function updateSwapTransaction(payload) {
  return {
    type: UPDATE_SWAP_TRANSACTION,
    payload,
  }
}
