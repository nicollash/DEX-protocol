import React, { lazy, Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Web3ReactProvider } from '@web3-react/core'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import theme from 'theme'
import getLibrary from 'monox/getLibrary'
import { store } from 'state/index'
import TransactionUpdater from 'state/updater'
import ModalsProvider from 'contexts/Modals'
import AccountProvider from 'contexts/AccountProvider'
import TokenProvider from 'contexts/TokenProvider'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import Spacer from 'components/Spacer'
import TopBar from 'components/TopBar'
import Footer from 'components/Footer'

import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ErrorFallback'

import './App.css'

const Swapper = lazy(() => import('views/Swapper'))
const Explore = lazy(() => import('views/Explore'))
const Pool = lazy(() => import('views/Pool'))
const CreatePool = lazy(() => import('views/CreatePool'))
const AddLiquidity = lazy(() => import('views/AddLiquidity'))
const RemoveLiquidity = lazy(() => import('views/RemoveLiquidity'))
const Home = lazy(() => import('views/Home'))
const StakingBoard = lazy(() => import('views/StakingBoard'))
const Analytics = lazy(() => import('views/Analytics'))

Sentry.init({
  dsn:
    'https://06b2e06564754d70a60d038cd12f0a70@o647182.ingest.sentry.io/5774198',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

function App() {
  return (
    <ReduxProvider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AccountProvider>
          <TokenProvider>
            <RefreshContextProvider>
              <ThemeProvider theme={theme}>
                <Router>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <ModalsProvider>
                      <AppContainer>
                        <TopBar />
                        <BodyContainer>
                          <Suspense fallback={<></>}>
                            <Switch>
                              <Route
                                exact
                                path={[
                                  '/swap/:address1/:address2',
                                  '/swap/:address1',
                                  '/swap/:uni',
                                  '/swap',
                                ]}
                              >
                                <Swapper />
                              </Route>
                              <Route exact path={'/pool'}>
                                <Pool />
                              </Route>
                              <Route
                                exact
                                path={['/create', '/create/:currencyIdA']}
                                component={CreatePool}
                              />
                              <Route
                                exact
                                path={['/add', '/add/:currencyIdA']}
                                component={AddLiquidity}
                              />
                              <Route
                                exact
                                path="/remove/:address"
                                component={RemoveLiquidity}
                              />
                              <Route
                                exact
                                path="/farm"
                                component={StakingBoard}
                              />
                              <Route
                                exact
                                path={'/explore/:filter'}
                                component={Explore}
                              />
                              <Route
                                exact
                                path={'/analytics/:address'}
                                component={Analytics}
                              />
                              <Route exact path="/" component={Home} />
                              <Redirect to={'/'} />
                            </Switch>
                            <Spacer />
                          </Suspense>
                        </BodyContainer>
                        <Footer />
                        <TransactionUpdater />
                        <ToastContainer
                          draggable={false}
                          className="styled-toast"
                          bodyClassName="styled-toast-body"
                          hideProgressBar
                          closeOnClick
                          closeButton={false}
                          autoClose={4000}
                        />
                      </AppContainer>
                    </ModalsProvider>
                  </ErrorBoundary>
                </Router>
              </ThemeProvider>
            </RefreshContextProvider>
          </TokenProvider>
        </AccountProvider>
      </Web3ReactProvider>
    </ReduxProvider>
  )
}
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const BodyContainer = styled.div`
  flex-grow: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-bottom: 7rem`}
`
const Loading = styled.div`
  display: flex;
  justify-content: center;
`

export default App
