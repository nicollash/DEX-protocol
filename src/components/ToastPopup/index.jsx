import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'

import { Check2Circle } from '@styled-icons/bootstrap/Check2Circle'

import { getEtherscanLink, precise } from 'monox/util'

const ToastPopup = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  link,
  chainId,
  type = 'swap',
}) => {
  return (
    <PopUp>
      {type === 'swap' && (
        <InfoLabel>{`Swap ${precise(fromAmount, 6)} ${fromToken} for ${precise(
          toAmount,
          6
        )} ${toToken}`}</InfoLabel>
      )}
      {type === 'wrap' && (
        <InfoLabel>{`Wrap ${precise(fromAmount, 6)} ${fromToken} to ${precise(
          toAmount,
          6
        )} ${toToken}`}</InfoLabel>
      )}
      {type === 'unwrap' && (
        <InfoLabel>{`Unwrap ${precise(fromAmount, 6)} ${fromToken} to ${precise(
          toAmount,
          6
        )} ${toToken}`}</InfoLabel>
      )}
      {type === 'add' && (
        <InfoLabel>{`Add ${precise(
          fromAmount,
          6
        )} ${fromToken} to ${fromToken} pool`}</InfoLabel>
      )}
      {type === 'remove' && (
        <InfoLabel>{`Remove ${precise(
          fromAmount,
          6
        )} ${fromToken} LP from ${fromToken} pool`}</InfoLabel>
      )}
      {type === 'create' && (
        <InfoLabel>{`Create ${precise(
          fromAmount,
          6
        )} ${fromToken} LP from ${fromToken} pool`}</InfoLabel>
      )}
      {type === 'stake' && (
        <InfoLabel>{`Stake ${precise(
          fromAmount,
          6
        )} ${fromToken} LP`}</InfoLabel>
      )}
      {type === 'harvest' && (
        <InfoLabel>{`Harvest ${precise(
          fromAmount,
          6
        )} ${fromToken} LP`}</InfoLabel>
      )}
      {type === 'unstake' && (
        <InfoLabel>{`Unstake ${precise(
          fromAmount,
          6
        )} ${fromToken} LP`}</InfoLabel>
      )}
      <Link
        href={getEtherscanLink(chainId, link, 'transaction')}
        target="__blank"
      >
        {`View on ${chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'}`}
      </Link>
    </PopUp>
  )
}

export const ApproveStakeToast = ({ poolData, link, chainId }) => {
  return (
    <>
      <Check2Circle color="#fff" size="24" style={{ marginRight: 10 }} />
      <Div>
        <InfoLabel>{`Approve ${poolData?.symbol} LP`}</InfoLabel>
        <Link
          href={getEtherscanLink(chainId, link, 'transaction')}
          target="__blank"
        >
          {`View on ${chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'}`}
        </Link>
      </Div>
    </>
  )
}

export const TransactionStartToast = () => {
  const [timePassed, setTimePassed] = useState(1)

  useEffect(() => {
    let id = setInterval(() => {
      setTimePassed((prevState) => prevState + 1)
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <>
      <Div>
        <InfoLabel>{`Your transaction has started`}</InfoLabel>
        <InfoLabel style={{ marginTop: 8 }}>
          {dayjs().format('h:m A')} - {timePassed} sec
        </InfoLabel>
      </Div>
    </>
  )
}

export const TransactionFailedToast = () => {
  return (
    <>
      <Div>
        <InfoLabel>Your transaction failed</InfoLabel>
        <InfoLabel style={{ marginTop: 8 }}>
          {dayjs().format('h:m A')}
        </InfoLabel>
      </Div>
    </>
  )
}

const PopUp = styled.div``

const Div = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLabel = styled.div`
  font-size: 16px;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
`

const Link = styled.a`
  box-sizing: border-box;
  font-weight: 800;
  font-size: 14px;
  color: #fff;
  padding: 10px 0;
  &:hover {
    cursor: pointer;
  }
`

export default ToastPopup
