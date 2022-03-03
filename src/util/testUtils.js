import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import theme from 'theme'
import AccountProvider from 'contexts/AccountProvider'
import TokenProvider from 'contexts/TokenProvider'
import { RefreshContextProvider } from 'contexts/RefreshContext'

import { store } from 'state/index'
import { renderHook } from '@testing-library/react-hooks'
import PrivateKeyProvider from 'truffle-privatekey-provider'
import { getCurrentChainId } from 'monox/constants'
import { useDispatch } from 'react-redux'
import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'

const MAINNET_NODE_URL =
  'https://eth-kovan.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto'
const PRIV_KEY =
  '5f98c69c59b8403a5b377c15dc731718b6000f23888d7f403725531fe8d0f865'

export const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <AccountProvider>
        <TokenProvider>
          <RefreshContextProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </RefreshContextProvider>
        </TokenProvider>
      </AccountProvider>
    </Provider>
  )
}
export const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export { customRender as render }

export const customRenderHook = (hook, data = null) => {
  const { result } = renderHook(() => hook(data), {
    wrapper: AllTheProviders,
  })
  return result
}
export const ConnetWallet = async () => {
  const dispatch = customRenderHook(useDispatch)
  const provider = new PrivateKeyProvider(PRIV_KEY, MAINNET_NODE_URL)
  const chainId = await getCurrentChainId(provider)

  dispatch.current(savePrivateKey({ chainId: chainId, privateKey: PRIV_KEY }))
  dispatch.current(saveProvider(provider))
}
