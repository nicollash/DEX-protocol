import { UPDATE_APPLICATION } from './constants'

const initialState = {
  isUpdated: false
}

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_APPLICATION:
      return {
        ...state,
        isUpdated: !state.isUpdated,
      }
    default:
      return state
  }
}

export default applicationReducer
