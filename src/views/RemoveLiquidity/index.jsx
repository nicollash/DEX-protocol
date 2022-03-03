import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Box } from 'rebass'

import useModal from 'hooks/useModal'
import useRemovablePool from 'hooks/useRemovablePool'
import useSearchToken from 'hooks/useSearchToken'
import usePool from 'hooks/usePool'
import useWallet from 'hooks/useWallet'
import config from 'monox/config'
import { weiToEthNum } from 'monox/constants'
import { uriToHttp } from 'monox/getTokenList'
import { precise } from 'monox/util'
import { setRemoveLiquidityTolerance } from 'state/settings/action'

import PositionCard from 'views/AddLiquidity/components/PositionCard'
import { BackRoute } from 'views/AddLiquidity/components/BackRoute'
import ConfirmSignatureRequestModal from 'views/RemoveLiquidity/components/ConfirmSignatureRequestModal'
import { RowBetween, Row } from 'components/Row'
import Spacer from 'components/Spacer'
import Slider from 'components/Slider'
import Button from 'components/Button'
import CardContainer, { PoolContainer } from 'components/CardContainer'
import WalletListModal from 'components/WalletListModal'
import TipCard from 'components/TipCard'
import Label from 'components/Label'
import StyledIconButton from 'components/StyledIconButton'
import { StyledSettingIcon } from 'components/StyledIcon'
import TransactionSettingModal from 'components/TransactionSettingModal'
import Divider from 'components/Divider'
import TokenImage from 'components/TokenImage'
import { AccountContext } from 'contexts/AccountProvider'
import { ACTIONS } from 'monox/util'

const RemoveLiquidity = () => {
  const wallet = useWallet()
  const { address } = useParams()
  const { account, chainId } = wallet
  const dispatch = useDispatch()
  const { onGetToken } = useSearchToken()
  const [token, setToken] = useState({})
  const [willRecieveToken, setWillRecieveToken] = useState(0)
  const [willRecieveLPToken, setWillRecieveLPToken] = useState(0)
  const history = useHistory()
  const networkId = useSelector(({ network }) => network.id)

  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const transactions = useSelector((state) => state.transactions)
  const vUSDData = config[networkId || chainId].vUSD

  const { isApproved, onApprove, onGetRemoveResult } = useRemovablePool(
    token?.address || (!!token?.symbol && 'ETH')
  )
  const { pool, balance, lPAmount } = usePool(
    token?.address || (!!token?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  const price = weiToEthNum(BigNumber(pool?.price))
  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useState(0)
  const [liquidityAmmount, setLiquidityAmmount] = useState(0)
  const [isApproving, setIsApproving] = useState(false)
  const [deadline, setDeadline] = useState(20)
  const [maxClicked, setMaxClicked] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const { poolsContract, infuraContract } = useContext(AccountContext)
  const tolerance = useSelector(
    ({ settings }) => settings.removeLiquidityTolerance
  )
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const setTolerance = (value) => {
    dispatch(setRemoveLiquidityTolerance(value))
  }
  const setCurrency = useCallback(async () => {
    const ts = await onGetToken(address)
    if (ts && ts.length > 0) {
      setToken(ts[0])
    }
  }, [address, onGetToken])

  useEffect(() => {
    if (token?.symbol && token.symbol !== address && !token.notInList) {
      history.push(`/remove/${token.symbol}?network=${networkName}`)
    }
  }, [token, address])

  useEffect(() => {
    if ((poolsContract || infuraContract) && address) {
      setCurrency()
    }
  }, [poolsContract, infuraContract, address])

  useEffect(() => {
    if (liquidityAmmount) {
      onGetRemoveResult(token, liquidityAmmount).then((res) => {
        if (res) {
          setWillRecieveToken(
            weiToEthNum(BigNumber(res.tokenOut), token?.decimals)
          )
          setWillRecieveLPToken(
            weiToEthNum(BigNumber(res.vusdOut), token?.decimals)
          )
        }
      })
    }
  }, [liquidityAmmount, onGetRemoveResult, token])

  useEffect(() => {
    if (transactions[chainId]) {
      const RemovingTxs = transactions[chainId].filter(
        (tx) => tx.type === ACTIONS.REMOVE
      )
      if (RemovingTxs.length > 0) {
        const lastTx = RemovingTxs[RemovingTxs.length - 1]
        if (
          lastTx.status === 'SUCCESS' &&
          Date.now() - lastTx.confirmedTime < 50
        ) {
          setIsPending(false)
          history.push(`/pool?network=${networkName}`)
        } else if (lastTx.status === 'PENDING') {
          setIsPending(true)
        }
      }
    }
  }, [transactions])

  const [onPresentWalletListModal] = useModal(<WalletListModal />)

  const [handleSignatureRequest] = useModal(
    <ConfirmSignatureRequestModal
      amount={liquidityAmmount}
      willRecieveToken={willRecieveToken}
      willRecieveLPToken={willRecieveLPToken}
      currency={token}
      price={price}
      tolerance={tolerance}
      maxClicked={maxClicked}
      lPAmount={lPAmount}
    />
  )

  const [handleSettingsModal] = useModal(
    <TransactionSettingModal
      tolerance={tolerance}
      setTolerance={setTolerance}
      setDeadline={setDeadline}
      initDeadline={deadline}
    />
  )

  const handleUnlockClick = useCallback(() => {
    onPresentWalletListModal()
  }, [onPresentWalletListModal])

  const handleLiquidityPercentChange = (value) => {
    if (!pool || !balance) {
      return
    }

    setInnerLiquidityPercentage(value)
    if (balance) {
      const amt = (value * balance) / 100
      setLiquidityAmmount(amt)
    }
    if (value === 100) setMaxClicked(true)
    else setMaxClicked(false)
  }

  const handleApprove = async () => {
    setIsApproving(true)
    await onApprove()
    setIsApproving(false)
  }
  return (
    <PoolContainer>
      <BackRoute
        settings={
          <StyledSettingIcon
            style={{ justifyContent: 'flex-end' }}
            onClick={handleSettingsModal}
          />
        }
      />
      <TipCard page="remove" />
      <CardContainer top="40">
        <RowBetween>
          <Label size={13} opacity={0.5} text="Amount" weight={800} />
        </RowBetween>
        <Row style={{ alignItems: 'baseline', marginTop: 10 }}>
          <Label size={42} weight={500} text={innerLiquidityPercentage} />
          <Label size={16} text="%" weight={800} />
        </Row>
        <>
          <Slider
            value={innerLiquidityPercentage}
            onChange={handleLiquidityPercentChange}
          />
          <Spacer />
          <RowBetween>
            {[25, 50, 75, 100].map((e, i) => (
              <MaxButton
                onClick={() => {
                  handleLiquidityPercentChange(e)
                }}
                key={e}
                active={innerLiquidityPercentage === e}
              >
                {e === 100 ? 'Max' : `${e}%`}
              </MaxButton>
            ))}
          </RowBetween>
          {willRecieveToken !== 0 && (
            <>
              <Spacer size="lg" />
              <Label size={13} weight={800} opacity={0.5}>
                Receive
              </Label>
              <Spacer size="md" />
              <Divider />
              <Spacer size="md" />
              <RowBetween style={{ width: '100%' }}>
                <Label size={16} weight={800} color={'#212d63'}>
                  {precise(willRecieveToken, 6)}
                </Label>
                <Row style={{ width: 'auto' }}>
                  <Label size={14} weight={800} color={'#212d63'}>
                    {token?.symbol}
                  </Label>
                  <Box ml={3}>
                    <TokenImage
                      src={uriToHttp(token.logoURI)[0]}
                      height="32"
                      width="32"
                      letter={token?.symbol && token?.symbol[0]}
                    />
                  </Box>
                </Row>
              </RowBetween>
            </>
          )}
          {willRecieveLPToken !== 0 && (
            <>
              <Spacer size="md" />
              <RowBetween>
                <Label size={16} weight={800} color={'#212d63'}>
                  {precise(willRecieveLPToken, 6)}
                </Label>
                <Row style={{ width: 'auto' }}>
                  <Label size={14} weight={800} color={'#212d63'}>
                    vUSD
                  </Label>
                  <Box ml={3}>
                    <TokenImage
                      src={vUSDData.logoURI}
                      height="32"
                      width="32"
                      letter={vUSDData?.symbol && vUSDData?.symbol[0]}
                    />
                  </Box>
                </Row>
              </RowBetween>
            </>
          )}
          {willRecieveToken !== 0 && (
            <>
              <Spacer size="lg" />
              <RowBetween style={{ width: '100%', marginBottom: 14 }}>
                <Label size={13} weight={800} opacity={0.5}>
                  Price
                </Label>
                <Row style={{ width: 'auto' }}>
                  <Label size={16} weight={800} opacity={0.5}>
                    1 {token?.symbol} = {precise(price, 6)} USD
                  </Label>
                </Row>
              </RowBetween>
              <Divider />
            </>
          )}
        </>
        <ButtonContainer>
          {!account ? (
            <RowBetween>
              <Button onClick={handleUnlockClick} block>
                Connect Wallet
              </Button>
            </RowBetween>
          ) : !isApproved ? (
            <>
              <StyledIconButton
                disabled={
                  innerLiquidityPercentage < 0.1 || isApproved || isApproving
                }
                block
                isPerforming={isApproving}
                isConfirmSwap={true}
                onClick={handleApprove}
                variant="primary"
                icon="arrow"
              >
                {isApproved
                  ? 'Approved'
                  : isApproving
                  ? 'Waiting for Approval'
                  : 'Approve'}
              </StyledIconButton>
              <Spacer size="sm" />
              <StyledIconButton
                disabled={!isApproved || isPending}
                onClick={handleSignatureRequest}
                block
                variant="secondary"
                icon="arrow"
              >
                {innerLiquidityPercentage ? 'Remove' : 'Enter An Amount'}
              </StyledIconButton>
            </>
          ) : (
            <StyledIconButton
              disabled={!isApproved || !innerLiquidityPercentage || isPending}
              onClick={handleSignatureRequest}
              variant="secondary"
              icon="arrow"
              block
            >
              {innerLiquidityPercentage ? 'Remove' : 'Enter An Amount'}
            </StyledIconButton>
          )}
        </ButtonContainer>
      </CardContainer>
      <PositionCard
        currency={token}
        showBalance={false}
        lpTokenAmount={liquidityAmmount}
      />
    </PoolContainer>
  )
}

export default RemoveLiquidity

export const MaxButton = styled.div`
  padding: 6px 26px;
  border-radius: 4px;
  box-shadow: ${(props) =>
    !props.active
      ? `6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,-1px -1px 3px 0 #ffffff;`
      : props.theme.shadows.inset};
  background-color: ${({ theme }) => theme.color.background.main};
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  color: ${(props) =>
    props.active
      ? props.theme.color.primary.main
      : props.theme.color.secondary.main};
  :hover {
    color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
   padding: 6px 20px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
   padding: 6px 15px;
  `}
   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   padding: 6px 10px;
  `}
`

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 45px;
  margin-bottom: 5px;
`
