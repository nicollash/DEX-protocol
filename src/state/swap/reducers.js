import { UPDATE_SWAP_TRANSACTION } from './constants'

const initialState = {
  isPerforming: false,
  isRejected: false,
  successResult: undefined,
  successEnded: false,
}

const swapReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SWAP_TRANSACTION:
      return {
        ...state,
        isPerforming: action.payload.isPerforming,
        isRejected: action.payload.isRejected,
        successResult: action.payload.successResult,
        successEnded: action.payload.successEnded,
      }
    default:
      return state
  }
}

export default swapReducer
