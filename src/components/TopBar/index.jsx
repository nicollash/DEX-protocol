import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { supportedChainIds } from 'monox/connectors'

import useWallet from 'hooks/useWallet'
import useModal from 'hooks/useModal'

import AccountButton from 'components/TopBar/components/AccountButton'
import SearchBar from 'components/TopBar/components/SearchBar'
import NavButtons from 'components/TopBar/components/NavButtons'
import NetworkListModal from 'components/NetworkListModal'

import logo from 'assets/img/logo/logo@3x.png'

const TopBar = () => {
  const [chainId, setChainId] = useState(null)
  const networkId = useSelector(({ network }) => network.id)
  const wallet = useSelector(({ user }) => user.wallet)
  const { account } = useWallet()
  const privateKey = useSelector(({ user }) => user.privateKey)
  const index = supportedChainIds.findIndex((id) => id === parseInt(networkId))
  const isWarning = privateKey ? false : index > -1 ? false : true
  const [handleNetworkClick] = useModal(<NetworkListModal />)

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on) {
      ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
        chainId && setChainId(parseInt(chainId))
      })
      const handleChainChanged = (chainId) => {
        chainId && setChainId(parseInt(chainId))
      }

      ethereum.on('chainChanged', handleChainChanged)
    }
  }, [])
  const showWarning = chainId && networkId != chainId

  return (
    <>
      <Bar></Bar>
      <StyledTopBar style={{ marginBottom: '70px' }}>
        <StyledTopBarInner>
          <StyledAccountButtonWrapper href="/">
            <Logo src={logo} />
            <StyledLogoTitle>MonoX Protocol</StyledLogoTitle>
          </StyledAccountButtonWrapper>
          <SearchBar />
          <NavButtons />
          <AccountButton />
        </StyledTopBarInner>
      </StyledTopBar>
      {(isWarning || (showWarning && wallet)) && (
        <NetworkWarning
          style={{
            marginBottom: showWarning ? '70px' : '0',
            marginTop: showWarning ? '-70px' : '0',
          }}
        >
          <div>
            The app network you selected doesn’t match the network in your
            wallet. Learn how to
            <Link
              onClick={() => {
                window.open(
                  'https://docs.monox.finance/testnet/connecting-kovan'
                )
              }}
            >
              {' '}
              change the network in your wallet{' '}
            </Link>{' '}
            or <Span onClick={handleNetworkClick}>change your app network</Span>
          </div>
        </NetworkWarning>
      )}
    </>
  )
}
const Bar = styled.div`
  height: 3px;
  background-image: linear-gradient(to left, #bc76f1, #41dea2);
`
const StyledTopBar = styled.div`
  height: 64px;
  padding: 0 68px 0 60px;
  box-shadow: 0 5px 20px 0 #d1d9e6, -18px -18px 30px 0 rgba(255, 255, 255, 0.5);
  background-color: ${({ theme }) => theme.color.background.main};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding:0 20px;
  margin-bottom:40px`};
`

const Logo = styled.img`
  width: 43px;
  height: 38px;
`

const StyledLogoTitle = styled.div`
  margin: 11px 3.75rem 7px 7px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.font.primary};
  @media (max-width: 1200px) {
    margin: 11px 50px 7px 7px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none`}
`

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  justify-content: space-between;
  width: 100%;
`

const StyledAccountButtonWrapper = styled.a`
  background-color: transparent;
  border: none;
  outline: none !important;
  text-decoration: none;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
  }
`
const NetworkWarning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  background-color: #ef3d62;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  white-space: pre-wrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:10px
  `};
  div {
  }
`

const Link = styled.a`
  text-decoration: underline;
  cursor: pointer;
`
const Span = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

export default TopBar
