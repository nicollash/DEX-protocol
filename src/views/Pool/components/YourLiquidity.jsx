import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'

import { toEllipsis, precise, VUSD_LOGO, getEtherscanLink } from 'monox/util'
import config from 'monox/config'

import usePool from 'hooks/usePool'
import useSearchToken from 'hooks/useSearchToken'
import useWallet from 'hooks/useWallet'
import { StyledExternalLink } from 'theme'

import Label from 'components/Label'
import Spacer from 'components/Spacer'
import Divider from 'components/Divider'
import TokenImage from 'components/TokenImage'
import StyledIconButton from 'components/StyledIconButton'
import { RowBetween } from 'components/Row'

const YourLiquidity = ({
  event,
  isETH,
  increaseZeroPoolsCount,
  decreaseZeroPoolsCount,
}) => {
  const _isMounted = useRef(true)
  const history = useHistory()
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const MAIN_CURRENCY = config[networkId || chainId].MAIN_CURRENCY

  const [isOpen, setIsOpen] = useState(false)
  const [tokenData, setTokenData] = useState(null)
  const {
    sharedPercent,
    balance,
    pooledAmount,
    vusdBalance,
    vusdOut,
  } = usePool(event?.token || (!!event?.symbol && WRAPPED_MAIN_ADDRESS))

  const { onGetToken } = useSearchToken()

  useEffect(() => {
    if (event) {
      onGetToken(event.token).then((res) => {
        if (_isMounted.current) {
          setTokenData(res[0])
        }
      })
    }
    return () => {
      _isMounted.current = false
    }
  }, [])
  useEffect(() => {
    if (balance === 0 && !isETH) {
      increaseZeroPoolsCount()
    } else if (balance !== 0 && !isETH) {
      decreaseZeroPoolsCount()
    }
  }, [balance])

  const changeRoute = (route) => {
    history.push(`${route}?network=${networkName}`)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const getCorrectAmount = (decimals, amount) => {
    if (decimals && amount) {
      return amount * Math.pow(10, 18 - parseInt(decimals))
    } else {
      return 0
    }
  }
  if (balance === 0) return <></>

  if (!isOpen) {
    return (
      event?.symbol && (
        <Div>
          <RowBetween>
            <Token>
              <TokenImage
                src={
                  isETH
                    ? MAIN_CURRENCY?.logoURI
                    : tokenData?.notInList
                    ? null
                    : tokenData?.logoURI
                }
                width="36"
                height="36"
                letter={
                  (!!event?.symbol && event?.symbol[0]) ||
                  (!!tokenData?.symbol && tokenData?.symbol[0])
                }
              />
              <TokenDeatil>
                <Label
                  weight={800}
                  size="14"
                  text={
                    isETH ? (chainId === 42 ? 'ETH' : 'MATIC') : tokenData?.name
                  }
                  style={{ marginLeft: 16 }}
                />
                {!isETH && (
                  <Token>
                    <Label
                      size="11"
                      opacity={0.3}
                      color="#202b65"
                      style={{ marginLeft: 16 }}
                      text={
                        isETH
                          ? chainId === 42
                            ? 'ETH'
                            : 'MATIC'
                          : tokenData?.symbol
                      }
                    />
                    <StyledExternalLink
                      href={getEtherscanLink(
                        chainId,
                        tokenData?.address,
                        'token'
                      )}
                      target="_blank"
                    >
                      <Label
                        color="#2eca93"
                        size={11}
                        style={{ marginLeft: 16 }}
                        text={
                          tokenData?.address
                            ? `${toEllipsis(tokenData?.address, 16)}`
                            : ``
                        }
                      />
                      <GoTo />
                    </StyledExternalLink>
                  </Token>
                )}
              </TokenDeatil>
            </Token>
            <ManageButton onClick={toggleOpen} className="btn-press">
              Manage
            </ManageButton>
          </RowBetween>
        </Div>
      )
    )
  }

  return (
    <>
      <Div>
        <RowBetween>
          <Token>
            <Tokens>
              <TokenImage
                src={
                  isETH
                    ? MAIN_CURRENCY?.logoURI
                    : tokenData?.notInList
                    ? null
                    : tokenData?.logoURI
                }
                width="36"
                height="36"
                style={{ zIndex: '1' }}
                letter={
                  (!!event?.symbol && event?.symbol[0]) ||
                  (!!tokenData?.symbol && tokenData?.symbol[0])
                }
              />
              {vusdBalance > 0 ? (
                <TokenImage
                  src={VUSD_LOGO}
                  style={{ marginLeft: '-5px' }}
                  width="36"
                  height="36"
                />
              ) : (
                ''
              )}
            </Tokens>
            <TokenDeatil>
              <Label
                weight={800}
                size="14"
                text={
                  isETH ? (chainId === 42 ? 'ETH' : 'MATIC') : tokenData?.name
                }
                style={{ marginLeft: 16 }}
              />
              {!isETH && (
                <Token>
                  <Label
                    size="11"
                    opacity={0.3}
                    color="#202b65"
                    style={{ marginLeft: 16 }}
                    text={
                      isETH
                        ? chainId === 42
                          ? 'ETH'
                          : 'MATIC'
                        : tokenData?.symbol
                    }
                  />
                  <StyledExternalLink
                    href={getEtherscanLink(
                      chainId,
                      tokenData?.address,
                      'token'
                    )}
                    target="_blank"
                  >
                    <Label
                      color="#2eca93"
                      size={11}
                      style={{ marginLeft: 16 }}
                      text={
                        tokenData?.address
                          ? `${toEllipsis(tokenData?.address, 16)}`
                          : ``
                      }
                    />
                    <GoTo />
                  </StyledExternalLink>
                </Token>
              )}
            </TokenDeatil>
          </Token>
          <ManageButtonDisabled onClick={toggleOpen}>
            Manage
          </ManageButtonDisabled>
        </RowBetween>
        <Details open={isOpen}>
          <Spacer size="sm" />
          <Divider />
          <Spacer size="sm" />
          <RowDetail>
            <Column justify="start">
              <Label
                text="Your Total Pool Tokens"
                weight={800}
                size={13}
                opacity={0.5}
              />
            </Column>
            <Column justify="flex-end">
              <Label weight={800} size={13} text={precise(balance, 6)} />
            </Column>
          </RowDetail>
          <RowDetail>
            <Column justify="start">
              <Label
                text={`Pooled ${
                  tokenData
                    ? isETH
                      ? chainId === 42
                        ? 'ETH'
                        : 'MATIC'
                      : tokenData?.symbol
                    : ''
                } `}
                weight={800}
                size={13}
                opacity={0.5}
              />
            </Column>
            <Column justify="flex-end">
              <Label
                weight={800}
                size={13}
                text={precise(
                  getCorrectAmount(tokenData?.decimals, pooledAmount),
                  6
                )}
              />
            </Column>
          </RowDetail>
          <RowDetail>
            <Column justify="start">
              <Label
                text={'Pooled vUSD'}
                weight={800}
                size={13}
                opacity={0.5}
              />
            </Column>
            <Column justify="flex-end">
              <Label
                weight={800}
                size={13}
                text={precise(
                  getCorrectAmount(tokenData?.decimals, vusdOut),
                  6
                )}
              />
            </Column>
          </RowDetail>
          <RowDetail>
            <Column justify="start">
              <Label
                text="Your Pool Share"
                weight={800}
                size={13}
                opacity={0.5}
              />
            </Column>
            <Column justify="flex-end">
              <Label
                weight={800}
                size={13}
                text={`${precise(sharedPercent, 2)}%`}
              />
            </Column>
          </RowDetail>
          <ButtonRow>
            <div style={{ width: 230 }}>
              <StyledIconButton
                fontColor="primary"
                icon="arrow"
                block
                variant="primary"
                style={{
                  height: 42,
                  boxShadow: '0 12px 20px 0 rgba(50, 171, 125, 0.3)',
                }}
                onClick={() =>
                  changeRoute(
                    `add/${
                      isETH
                        ? chainId === 42
                          ? 'ETH'
                          : 'MATIC'
                        : tokenData?.notInList
                        ? tokenData?.address
                        : event?.symbol || tokenData?.symbol
                    }`
                  )
                }
              >
                Add
              </StyledIconButton>
            </div>
            <div style={{ width: 230 }}>
              <StyledIconButton
                fontColor="secondary"
                icon="arrow"
                block
                variant="secondary"
                style={{
                  height: 42,
                  boxShadow: '0 12px 20px 0 rgba(207, 53, 85, 0.3)',
                }}
                onClick={() =>
                  changeRoute(
                    `remove/${
                      isETH
                        ? chainId === 42
                          ? 'ETH'
                          : 'MATIC'
                        : tokenData?.notInList
                        ? tokenData?.address
                        : event?.symbol || tokenData?.symbol
                    }`
                  )
                }
              >
                Remove
              </StyledIconButton>
            </div>
          </ButtonRow>
        </Details>
      </Div>
    </>
  )
}

const Div = styled.div`
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.card};
  object-fit: contain;
  padding: 27px 40px 0px 40px;
  border-radius: 39px;
  min-height: 90px;
  box-sizing: border-box;
  margin-bottom: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 20px 30px 0 30px;
  min-height: 80px;
  border-radius: 30px;
  `}
`

const TokenDeatil = styled.div``

const Details = styled.div`
  height: 100%;
  overflow: hidden;
  padding: ${(props) => (props.open ? '12px 0 0 0' : '0')};
  transition: all 0s ease-out;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 0;
  padding-bottom:0
  `}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.justify ? props.justify : 'center')};
  padding: 0 5px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const RowDetail = styled(Row)`
  margin: 20px 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  align-items: flex-start;
  `}
`

const ButtonRow = styled(RowDetail)`
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: 80px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: row;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top:30px;
  height: 120px;
  `}
`
const Tokens = styled.div`
  display: flex;
`

const Token = styled.div`
  display: flex;
  align-items: center;
`
const Manage = styled.div`
  width: 65px;
  height: 27px;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
  font-weight: 800;
  line-height: 2.3;
  cursor: pointer;
`
const ManageButton = styled(Manage)`
  box-shadow: ${({
    theme,
  }) => `6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 ${theme.color.white},
    -1px -1px 3px 0 ${theme.color.white}`};
  color: ${({ theme }) => theme.color.font.secondary};
  &:hover {
    color: ${({ theme }) => theme.color.font.primary};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
`
const ManageButtonDisabled = styled(Manage)`
  box-shadow: ${({ theme }) => `inset -5px -5px 12px 0 ${theme.color.white},
    inset 5px 5px 12px 0 rgba(188, 195, 207, 0.65)`};
  color: ${({ theme }) => theme.color.font.primary};
  background-color: #ecf3f0;
`

const GoTo = styled(DiagonalArrowRightUpOutline)`
  width: 15px;
  height: 15px;
  margin-left: 0px !important;
`

export default YourLiquidity
