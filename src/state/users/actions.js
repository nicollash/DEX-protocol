import { SAVE_TOKEN, SAVE_WALLET, SAVE_BALANCE, SAVE_PRIVATE_KEY } from './constants'

export function saveToken(payload) {
  return {
    type: SAVE_TOKEN,
    payload,
  }
}

export function saveWallet(payload) {
  return {
    type: SAVE_WALLET,
    payload,
  }
}

export function saveBalance(payload) {
  return {
    type: SAVE_BALANCE,
    payload,
  }
}

export function savePrivateKey(payload) {
  return {
    type: SAVE_PRIVATE_KEY,
    payload,
  }
}