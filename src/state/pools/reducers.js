import { SAVE_POOL_LIST, SET_POOL_LOADING } from './constants'

const initialState = {
  poolsLoading: true,
}

const poolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_POOL_LIST:
      return {
        ...state,
        [action.payload.chainId]: action.payload.pools,
      }
    case SET_POOL_LOADING:
      return { ...state, poolsLoading: action.payload }
    default:
      return state
  }
}

export default poolsReducer
