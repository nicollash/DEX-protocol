import { ADD_TRANSACTION, CLEAR_TRANSACTIONS } from './constants'

const initialState = {}

const now = () => new Date().getTime()

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION:
      const txs = state[action.payload.chainId] ?? []
      const pendingIndex = txs.findIndex(
        (tx) => tx?.startTime === action.payload?.startTime
      )
      if (pendingIndex !== -1) {
        return {
          ...state,
          [action.payload.chainId]: [
            ...txs.slice(0, pendingIndex),
            ...txs.slice(pendingIndex + 1),
            { ...action.payload, confirmedTime: now() },
          ],
        }
      }
      return {
        ...state,
        [action.payload.chainId]: [
          ...txs,
          { ...action.payload, confirmedTime: now() },
        ],
      }
    case CLEAR_TRANSACTIONS:
      return {
        ...state,
        [action.payload.chainId]: [],
      }
    default:
      return state
  }
}

export default transactionReducer
