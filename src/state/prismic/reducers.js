import {
  SAVE_COLLECTIONS,
  SAVE_FEATURED,
  SAVE_PARTNER_COMPANIES,
  SAVE_TEAM_MEMBERS,
} from './constants'

const initialState = {
  collections: {},
  featured: {},
  partner_company: [],
  team_member: [],
}

const prismicReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_COLLECTIONS:
      return {
        ...state,
        collections: action.payload,
      }
    case SAVE_FEATURED:
      return {
        ...state,
        featured: action.payload,
      }
    case SAVE_PARTNER_COMPANIES:
      return {
        ...state,
        partner_company: action.payload,
      }
    case SAVE_TEAM_MEMBERS:
      return {
        ...state,
        team_member: action.payload,
      }
    default:
      return state
  }
}

export default prismicReducer
