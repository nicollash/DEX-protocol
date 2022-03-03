import {
  SAVE_COLLECTIONS,
  SAVE_FEATURED,
  SAVE_PARTNER_COMPANIES,
  SAVE_TEAM_MEMBERS,
} from './constants'

export function saveCollections(data) {
  return { type: SAVE_COLLECTIONS, payload: data }
}

export function saveFeatured(data) {
  return { type: SAVE_FEATURED, payload: data }
}

export function savePartnerCompanies(data) {
  return { type: SAVE_PARTNER_COMPANIES, payload: data }
}

export function saveTeamMembers(data) {
  return { type: SAVE_TEAM_MEMBERS, payload: data }
}
