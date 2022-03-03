import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import useWallet from 'hooks/useWallet'
import useContributedPoolList from 'hooks/useContributedPoolList'
import useModal from 'hooks/useModal'
import YourLiquidity from 'views/Pool/components/YourLiquidity'
import Spacer from 'components/Spacer'
import Label from 'components/Label'
import { SwitchButton } from 'components/Button'
import Loader from 'components/Loader'
import TipCard from 'components/TipCard'
import { RowCenter, RowBetween } from 'components/Row'
import StyledIconButton from 'components/StyledIconButton'
import WalletListModal from 'components/WalletListModal'
import config from 'monox/config'

const PoolCard = () => {
  const history = useHistory()
  const { account, chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const { poolList, loading, getPoolData } = useContributedPoolList(false)

  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const [handleConnectClick] = useModal(<WalletListModal />)
  const [noBalancePoolCount, setNoBalancePoolCount] = useState(0)
  let zeroPoolsCount = 0
  const ethPool = poolList?.filter(
    (item) => item?.token === WRAPPED_MAIN_ADDRESS
  )[0]

  const handleCreatePool = () => {
    history.push(`/create?network=${networkName}`)
  }
  const handleAddLiquidity = () => {
    history.push(`/add?network=${networkName}`)
  }

  const increaseZeroPoolsCount = () => {
    zeroPoolsCount++
    setNoBalancePoolCount(zeroPoolsCount)
  }
  const decreaseZeroPoolsCount = () => {
    zeroPoolsCount--
    setNoBalancePoolCount(zeroPoolsCount)
  }

  useEffect(() => {
    account && chainId && getPoolData()
  }, [chainId])

  return (
    <HelmetProvider>
      <PoolContainer>
        <Helmet>
          <title>Pools | MonoX</title>
        </Helmet>
        <TipCard page="pool" />
        <Row>
          <Label text="Your liquidity" weight="800" size="16" />
          <ButtonGroup>
            <SwitchButton
              width={130}
              height={32}
              className="btn-press"
              onClick={handleCreatePool}
            >
              Create a Pool
            </SwitchButton>
            <Spacer size="md" />
            <SwitchButton
              width={130}
              height={32}
              className="btn-press"
              onClick={handleAddLiquidity}
            >
              Add Liquidity
            </SwitchButton>
          </ButtonGroup>
        </Row>
        {!loading && account ? (
          <>
            <LiquidityContainer>
              {ethPool && (
                <YourLiquidity
                  event={ethPool}
                  key={ethPool.pid}
                  isETH={true}
                  increaseZeroPoolsCount={increaseZeroPoolsCount}
                  decreaseZeroPoolsCount={decreaseZeroPoolsCount}
                />
              )}
              {poolList?.length && (chainId === 42 || chainId === 80001) ? (
                poolList.map((event) => (
                  <YourLiquidity
                    event={event}
                    key={event.pid}
                    increaseZeroPoolsCount={increaseZeroPoolsCount}
                    decreaseZeroPoolsCount={decreaseZeroPoolsCount}
                  />
                ))
              ) : (
                <Div>
                  <RowCenter>
                    <Label
                      size={18}
                      text="No Liquidity Found"
                      opacity={0.2}
                      weight={800}
                    />
                  </RowCenter>
                </Div>
              )}
            </LiquidityContainer>
          </>
        ) : account ? (
          <RowCenter>
            <Loader />
          </RowCenter>
        ) : (
          <Div>
            <Content>
              <Label
                size={16}
                text="Wallet Connection is required for pool viewing"
                opacity={0.2}
                weight={800}
              />
              <Spacer />
              <StyledIconButton
                onClick={handleConnectClick}
                icon="arrow"
                variant="primary"
                style={{ height: '42px', minWidth: '212px' }}
              >
                Connect Wallet
              </StyledIconButton>
            </Content>
          </Div>
        )}
        {!loading &&
          !!poolList?.length &&
          noBalancePoolCount === poolList?.length && (
            <LiquidityContainer>
              <Div>
                <RowCenter>
                  <Label
                    size={18}
                    text="No Liquidity Found"
                    opacity={0.2}
                    weight={800}
                  />
                </RowCenter>
              </Div>
            </LiquidityContainer>
          )}
      </PoolContainer>
    </HelmetProvider>
  )
}

const PoolContainer = styled.div`
  max-width: 700px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.main};
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 75%
  `}
`

const LiquidityContainer = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: auto
  `}
`

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin: 40px 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  flex-direction: column;
  align-items: center;
  `}
`
const ButtonGroup = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 15px
  `}
`
const Content = styled.div`
  margin: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  justify-content: center;
  `};
`

const Div = styled.div`
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border-radius: 39px;
  min-height: 90px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default PoolCard
