import { SAVE_TOKENS, SAVE_FILTERED_TOKENS } from './constants'

const initialState = {
  allTokens: {},
  filteredTokens: {},
}

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKENS:
      return {
        ...state,
        allTokens: {
          ...state.allTokens,
          [action.payload.chainId]: action.payload.tokens,
        },
      }
    case SAVE_FILTERED_TOKENS:
      return {
        ...state,
        filteredTokens: {
          ...state.filteredTokens,
          [action.payload.chainId]: action.payload.tokens,
        },
      }
    default:
      return state
  }
}

export default tokenReducer
