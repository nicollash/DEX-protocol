import { ADD_TRANSACTION, CLEAR_TRANSACTIONS } from './constants'

export function addTransaction(payload) {
  return {
    type: ADD_TRANSACTION,
    payload,
  }
}

export function clearTransactions(payload) {
  return {
    type: CLEAR_TRANSACTIONS,
    payload,
  }
}
