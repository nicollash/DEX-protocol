import { SAVE_PROVIDER } from './constants'

const initialState = {
  provider: undefined
}

const providerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_PROVIDER:
      return {
        ...state,
        provider: action.payload,
      }
    default:
      return state
  }
}

export default providerReducer
