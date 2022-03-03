import { SAVE_POOL_LIST, SET_POOL_LOADING } from './constants'

export function savePoolList(payload) {
  return { type: SAVE_POOL_LIST, payload }
}

export function setPoolsLoading(payload) {
  return { type: SET_POOL_LOADING, payload }
}
