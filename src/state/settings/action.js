import {
  SET_ADD_LIQUIDITY_TOLERANCE,
  SET_SWAP_TOLERANCE,
  SET_REMOVE_LIQUIDITY_TOLERANCE,
} from './constants'

export function setSwapTolerance(payload) {
  return { type: SET_SWAP_TOLERANCE, payload }
}

export function setAddLiquidityTolerance(payload) {
  return { type: SET_ADD_LIQUIDITY_TOLERANCE, payload }
}

export function setRemoveLiquidityTolerance(payload) {
  return { type: SET_REMOVE_LIQUIDITY_TOLERANCE, payload }
}
