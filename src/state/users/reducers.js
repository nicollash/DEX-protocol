import {
  SAVE_TOKEN,
  SAVE_WALLET,
  SAVE_BALANCE,
  SAVE_PRIVATE_KEY,
} from './constants'

const initialState = {
  tokens: {},
  wallet: '',
  balances: {},
  chainId: 42,
  privateKey: undefined,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload.chainId]: {
            ...state.tokens[action.payload.chainId],
            [action.payload.address ?? action.payload.symbol]: action.payload,
          },
        },
      }

    case SAVE_WALLET:
      return {
        ...state,
        wallet: action.payload,
      }
    case SAVE_BALANCE:
      if (action.payload?.chainId) {
        return {
          ...state,
          balances: {
            ...state.balances,
            [action.payload.chainId]: {
              ...(state.balances?.[action.payload.chainId] ?? {}),
              [action.payload.address]: action.payload.amount,
            },
          },
        }
      }
      return state
    case SAVE_PRIVATE_KEY:
      return {
        ...state,
        chainId: action.payload.chainId,
        privateKey: action.payload.privateKey,
      }
    default:
      return state
  }
}

export default userReducer
