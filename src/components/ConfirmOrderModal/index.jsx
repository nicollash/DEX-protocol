import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { DownArrowAlt } from '@styled-icons/boxicons-regular/DownArrowAlt'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'

import useSwapToken from 'hooks/useSwapToken'
import useWallet from 'hooks/useWallet'
import { getEtherscanLink, toEllipsis, precise } from 'monox/util'
import { updateSwapTransaction } from 'state/swap/actions'
import { StyledExternalLink } from 'theme'

import Modal from 'components/Modal'
import Spacer from 'components/Spacer'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'
import TokenImage from 'components/TokenImage'
import Label from 'components/Label'
import StyledIconButton from 'components/StyledIconButton'
import { CloseIcon } from 'components/IconButton'

import config from 'monox/config'
const ConfirmOrderModal = ({
  onDismiss,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  exactAmount,
  deadline,
  onCloseModal,
  onFinishTransaction,
}) => {
  const dispatch = useDispatch()
  const { chainId } = useWallet()
  const { onSwap } = useSwapToken()
  const { isPerforming, isRejected, successResult } = useSelector(
    ({ swap }) => swap
  )
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const tolereance = useSelector(({ settings }) => settings.swapTolerance)
  const isWrap =
    (fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address) ||
    (toToken?.address === WRAPPED_MAIN_ADDRESS && !fromToken?.address)
  const handleConfirm = useCallback(() => {
    const tempTransactionId = +new Date()
    dispatch(
      updateSwapTransaction({
        isPerforming: true,
        isRejected: false,
        successResult: undefined,
        successEnded: false,
      })
    )
    onSwap(
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      exactAmount,
      deadline,
      tempTransactionId
    )
      .then((result) => {
        onFinishTransaction()
      })
      .catch(() => {
        onFinishTransaction()
        dispatch(
          updateSwapTransaction({
            isPerforming: false,
            isRejected: true,
            successResult: undefined,
            successEnded: false,
          })
        )
      })
  })
  const handleCloseModal = () => {
    onCloseModal()
    onDismiss()
  }
  if (isRejected) {
    const message = `${
      !fromToken?.address && toToken?.address === WRAPPED_MAIN_ADDRESS
        ? 'Wrap'
        : fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address
        ? 'Unwrap'
        : 'Swap'
    } ${fromAmount} ${fromToken.symbol} ${
      (!fromToken?.address && toToken?.address === WRAPPED_MAIN_ADDRESS) ||
      (fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address)
        ? 'to'
        : 'for'
    } ${toAmount} ${toToken.symbol}`
    return (
      <TransactionRejectModal onDismiss={handleCloseModal} message={message} />
    )
  }
  if (successResult) {
    return (
      <TransactionSuccessModal
        token={toToken}
        onDismiss={handleCloseModal}
        payload={successResult}
      />
    )
  }
  return (
    <Modal>
      <Row>
        <Label
          text={
            !fromToken?.address && toToken?.address === WRAPPED_MAIN_ADDRESS
              ? 'Confirm Wrap'
              : fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address
              ? 'Confirm Unwrap'
              : 'Swap'
          }
          weight="800"
          size="16"
        />
        <CloseIcon
          onClick={onDismiss}
          size="20"
          style={{ marginLeft: 'auto' }}
        />
      </Row>
      <Spacer />
      <SwapRow>
        <Row style={{ width: '100%' }}>
          <TokenImage
            src={fromToken.logoURI}
            height="32"
            width="32"
            letter={fromToken?.symbol && fromToken?.symbol[0]}
          />
          <Spacer />
          <Column>
            <Token>
              <Label size={14} text={fromToken.name} weight="800" />
              <Label size={14} text={precise(fromAmount, 6)} weight="800" />
            </Token>
            <Row>
              <Label
                text={`${fromToken.symbol} -`}
                size={11}
                opacity={0.3}
                weigth="800"
              />
              &nbsp;
              <StyledExternalLink
                href={getEtherscanLink(chainId, fromToken?.address, 'token')}
                target="_blank"
                style={{ justifyContent: 'flex-start' }}
              >
                <Label
                  color="#2eca93"
                  size={11}
                  text={
                    fromToken?.address
                      ? `${toEllipsis(fromToken?.address, 16)}`
                      : ``
                  }
                />
                <DiagonalArrowRight />
              </StyledExternalLink>
            </Row>
          </Column>
        </Row>
      </SwapRow>
      <DownArrow />
      <SwapRow>
        <Row style={{ width: '100%' }}>
          <TokenImage
            src={toToken.logoURI}
            height="32"
            width="32"
            letter={toToken?.symbol && toToken?.symbol[0]}
          />
          <Spacer />
          <Column>
            <Token>
              <Label text={toToken.name} size="14" weight="800" />
              <Label text={precise(toAmount, 6)} size="14" weight="800" />
            </Token>
            <Row>
              <Label
                text={`${toToken.symbol} -`}
                size={11}
                opacity={0.3}
                weigth="800"
              />
              &nbsp;
              <StyledExternalLink
                href={getEtherscanLink(chainId, toToken?.address, 'token')}
                target="_blank"
                style={{ justifyContent: 'flex-start' }}
              >
                <Label
                  color="#2eca93"
                  size={11}
                  text={
                    toToken?.address
                      ? `${toEllipsis(toToken?.address, 16)}`
                      : ``
                  }
                />
                <DiagonalArrowRight />
              </StyledExternalLink>
            </Row>
          </Column>
        </Row>
      </SwapRow>
      <Spacer />
      <Desc>
        {(!fromToken?.address && toToken?.address === WRAPPED_MAIN_ADDRESS) ||
        (fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address)
          ? ''
          : exactAmount
          ? `Input is estimated. You will sell at most ${precise(
              fromAmount * (1 + (isWrap ? 0 : tolereance) / 100),
              6
            )} ${fromToken.symbol} or the transaction will revert.`
          : `Output is estimated. You will receive at least ${precise(
              toAmount * (1 - (isWrap ? 0 : tolereance) / 100),
              6
            )} ${toToken.symbol} or the transaction will revert.`}
      </Desc>
      <Spacer />
      <StyledIconButton
        block
        disabled={isPerforming && true}
        shadow
        variant="primary"
        icon="arrow"
        isPerforming={isPerforming}
        isConfirmSwap={true}
        onClick={handleConfirm}
      >
        {!fromToken?.address && toToken?.address === WRAPPED_MAIN_ADDRESS
          ? 'Confirm Wrap'
          : fromToken?.address === WRAPPED_MAIN_ADDRESS && !toToken?.address
          ? 'Confirm Unwrap'
          : 'Confirm Swap'}
      </StyledIconButton>
    </Modal>
  )
}

const Row = styled.div`
  display: flex;
  align-items: center;
`
const SwapRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  background-color: rgba(64, 221, 161, 0.05);
  box-sizing: border-box;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Token = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`
const DownArrow = styled(DownArrowAlt)`
  height: 20px;
  width: 20px;
  padding: 5px;
  margin: auto;
  cursor: pointer;
`
const DiagonalArrowRight = styled(DiagonalArrowRightUpOutline)`
  width: 15px;
  height: 15px;
  margin-left: 0px !important;
`
const Desc = styled.span`
  font-size: 13px;
  opacity: 0.5;
  font-weight: 800;
  color: ${(props) => props.theme.color.secondary.main};
`
export default ConfirmOrderModal
