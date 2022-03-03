import {
  SET_ADD_LIQUIDITY_TOLERANCE,
  SET_SWAP_TOLERANCE,
  SET_REMOVE_LIQUIDITY_TOLERANCE,
} from './constants'

const initialState = {
  swapTolerance: 0.5,
  addLiquidityTolerance: 0.5,
  removeLiquidityTolerance: 0.5,
}

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SWAP_TOLERANCE:
      return {
        ...state,
        swapTolerance: action.payload,
      }
    case SET_ADD_LIQUIDITY_TOLERANCE:
      return {
        ...state,
        addLiquidityTolerance: action.payload,
      }
    case SET_REMOVE_LIQUIDITY_TOLERANCE:
      return {
        ...state,
        removeLiquidityTolerance: action.payload,
      }
    default:
      return state
  }
}

export default settingsReducer
