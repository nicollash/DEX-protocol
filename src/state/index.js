import { createStore, applyMiddleware } from 'redux'
import { save, load } from 'redux-localstorage-simple'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './rootReducer'

const PERSISTED_KEYS = ['user', 'transactions', 'settings', 'network', 'pools']

const createStoreWithMiddleware = applyMiddleware(
  save({ states: PERSISTED_KEYS })
)(createStore)

export const store = createStoreWithMiddleware(
  rootReducer,
  load({ states: PERSISTED_KEYS, disableWarnings: true }),
  composeWithDevTools()
)
