import { UPDATE_APPLICATION } from './constants'

export function updateApplication(payload) {
  return {
    type: UPDATE_APPLICATION,
    payload,
  }
}
