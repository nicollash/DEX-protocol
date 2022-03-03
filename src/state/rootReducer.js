import { combineReducers } from 'redux'
import prismicReducer from 'state/prismic/reducers'
import providerReducer from 'state/provider/reducers'
import settingsReducer from 'state/settings/reducer'
import swapReducer from 'state/swap/reducers'
import transactionReducer from 'state/transaction/reducers'
import userReducer from 'state/users/reducers'
import tokenReducer from 'state/tokens/reducers'
import poolsReducer from 'state/pools/reducers'
import networkReducer from 'state/network/reducers'
import applicationReducer from 'state/applications/reducers'

export default combineReducers({
  transactions: transactionReducer,
  user: userReducer,
  settings: settingsReducer,
  prismic: prismicReducer,
  swap: swapReducer,
  provider: providerReducer,
  tokens: tokenReducer,
  pools: poolsReducer,
  network: networkReducer,
  application: applicationReducer,
})
