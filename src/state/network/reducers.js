import { CHANGE_NETWORK } from './constants'
import config from 'monox/config'

const initialState = {
  id: 42,
  ...config[42],
}

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NETWORK:
      return {
        ...state,
        id: action.payload.network,
        ...action.payload.networkDetails,
      }
    default:
      return state
  }
}

export default networkReducer
