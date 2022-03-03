import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useHistory } from 'react-router'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'
import { TelegramShareButton, TwitterShareButton } from 'react-share'
import uniqBy from 'lodash/uniqBy'

import useWallet from 'hooks/useWallet'
import { weiToEthNum } from 'monox/constants'
import { precise } from 'monox/util'
import { toEllipsis, getEtherscanLink } from 'monox/util'
import config from 'monox/config'
import uniswapTokens from 'monox/uniswap_all_tokens_list'
import { StyledExternalLink } from 'theme'

import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import Label from 'components/Label'

import TwitterIcon from 'assets/img/twitterIcon.svg'
import HoveredTwitterIcon from 'assets/img/hoverTwitter.svg'
import TelegramIcon from 'assets/img/telegramIcon.svg'
import HoveredTelegramIcon from 'assets/img/hoverTelegram.svg'
import CopyLink from 'assets/img/copyLink.svg'
import HoveredCopyLink from 'assets/img/hoverCopyLink.svg'
import ReactTooltip from 'react-tooltip'

const SwapWidget = ({
  fromToken,
  toToken,
  fromAmount,
  fromPoolData,
  toAmount,
  toPoolData,
}) => {
  const { chainId } = useWallet()
  const history = useHistory()
  const [hoveredLink, setHoveredLink] = useState(false)
  const [hoveredTelegram, setHoveredTelegram] = useState(false)
  const [hoveredTwitter, setHoveredTwitter] = useState(false)
  const tolerance = useSelector(({ settings }) => settings.swapTolerance)
  const networkId = useSelector(({ network }) => network.id)
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const VUSD_ADDRESS = config[networkId || chainId].vUSD
  const MONOData = config[networkId || chainId].MONO
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const fromPrice =
    fromToken?.address === VUSD_ADDRESS
      ? 1
      : weiToEthNum(BigNumber(fromPoolData?.price))
  const toPrice =
    toToken?.address === VUSD_ADDRESS
      ? 1
      : weiToEthNum(BigNumber(toPoolData?.price))
  const ratio = fromPrice / toPrice
  const { color } = useContext(ThemeContext)

  const priceImpact = () => {
    if (ratio > 0) {
      const impact =
        (Math.abs(ratio - toAmount / fromAmount) * 100) / ratio - 0.3
      if (impact >= 100) return 0
      else if (impact >= 0.1) return impact.toFixed(2)
      else return '< 0.01'
    } else return ''
  }
  const handleRouteChange = () => {
    history.push({
      pathname: `/analytics/${
        fromToken?.address ? fromToken?.address : WRAPPED_MAIN_ADDRESS
      }`,
      search: `?network=${networkName}`,
      state: { backUrl: history.location.pathname },
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const tokenList = uniqBy(
    [...uniswapTokens.tokens, VUSD_ADDRESS, MONOData].filter(
      (t) => t.chainId === networkId && t.address
    ),
    'address'
  )

  const addressTokenList = tokenList.map((item) => item.address)

  const availableTokens =
    toToken &&
    (addressTokenList?.includes(toToken?.address) ||
      !toToken?.address ||
      toToken?.address === VUSD_ADDRESS?.address)

  return fromToken || toToken ? (
    fromAmount > 0 && toAmount > 0 && fromAmount != toAmount ? (
      <WidgetCard>
        <AutoColumn style={{ padding: '20px' }}>
          <RowAround>
            <TwitterShareButton
              title={
                availableTokens
                  ? `Check out ${toToken?.symbol} on MonoX!`
                  : 'Check out this project on MonoX!'
              }
              url={window.location.href}
            >
              <RoundButton
                onMouseEnter={() => setHoveredTwitter(true)}
                onMouseLeave={() => setHoveredTwitter(false)}
              >
                {hoveredTwitter ? (
                  <img src={HoveredTwitterIcon} width={15} alt="twiter icon" />
                ) : (
                  <img src={TwitterIcon} width={15} alt="twiter icon" />
                )}
              </RoundButton>
            </TwitterShareButton>
            <TelegramShareButton
              title={
                availableTokens
                  ? `Check out ${toToken?.symbol} on MonoX!`
                  : 'Check out this project on MonoX!'
              }
              url={window.location.href}
            >
              <RoundButton
                onMouseEnter={() => setHoveredTelegram(true)}
                onMouseLeave={() => setHoveredTelegram(false)}
              >
                {hoveredTelegram ? (
                  <img src={HoveredTelegramIcon} width={15} alt="twiter icon" />
                ) : (
                  <img src={TelegramIcon} width={15} alt="twiter icon" />
                )}
              </RoundButton>
            </TelegramShareButton>
            <RoundButton
              onClick={handleCopyLink}
              data-tip="copied"
              data-event="click"
              data-event-off="click"
              data-iscapture="true"
              onMouseEnter={() => setHoveredLink(true)}
              onMouseLeave={() => setHoveredLink(false)}
            >
              <ReactTooltip delayHide={2000} />
              {hoveredLink ? (
                <img src={HoveredCopyLink} width={15} alt="copy link" />
              ) : (
                <img src={CopyLink} width={15} alt="copy link" />
              )}
            </RoundButton>
          </RowAround>
          <Row>
            <RowFixed>
              <Text1>Slippage Tolerance</Text1>{' '}
            </RowFixed>
            <RowFixed justify="flex-end">
              <Text2>{tolerance} %</Text2>
            </RowFixed>
          </Row>
          <Row>
            <RowFixed>
              <Text1>{'Minimum received'}</Text1>{' '}
              <QuestionHelper
                id="received"
                text=" Your transaction will revert if there is a large unfavorable price movement before it is confirmed"
              />
            </RowFixed>
            <RowFixed justify="flex-end">
              <Text2>
                {`${precise(toAmount * (1 - tolerance / 100), 6)} ${
                  toToken?.symbol
                }`}
              </Text2>
            </RowFixed>
          </Row>
          <Row>
            <RowFixed justify="start">
              <Text1>Price Impact</Text1>
              <QuestionHelper
                id="price-impact"
                text="The difference between the market price and estimated price due to trade size"
              />
            </RowFixed>
            <RowFixed justify="flex-end" style={{ color: color.redPink }}>
              <Text2>{fromAmount && toAmount && priceImpact()}%</Text2>
            </RowFixed>
          </Row>
          <Row>
            <RowFixed justify="start">
              <Text1>Liquidity Provider Fee</Text1>
              <QuestionHelper
                id="provider"
                text=" A portion of each trade (0.3%) goes to liquidity providers as a protocol incentive"
              />
            </RowFixed>
            <RowFixed justify="flex-end">
              <Text2>
                {precise(fromAmount * 0.003, 6)} {fromToken.symbol}
              </Text2>
            </RowFixed>
          </Row>
          <Row last={fromToken.address ? false : true}>
            {fromToken.address ? (
              <>
                <RowFixed>
                  <Text1>{`${fromToken.symbol} Address`}</Text1>{' '}
                </RowFixed>
                <RowFixed justify="flex-end">
                  <Text2>
                    <Address>
                      <StyledExternalLink
                        target="_blank"
                        href={getEtherscanLink(
                          chainId,
                          fromToken.address,
                          'address'
                        )}
                        rel="noopener noreferrer"
                        style={{ justifyContent: 'left' }}
                      >
                        <Label
                          weight={800}
                          color="#2eca93"
                          size={11}
                          text={
                            fromToken.address
                              ? `${toEllipsis(fromToken.address, 16)}`
                              : ``
                          }
                          style={{ lineHeight: 1.6 }}
                        />
                        <GoTo />
                      </StyledExternalLink>
                    </Address>
                  </Text2>
                </RowFixed>
              </>
            ) : (
              ''
            )}
          </Row>
          <Row>
            {toToken?.address ? (
              <>
                <RowFixed>
                  <Text1>{`${toToken.symbol} Address`}</Text1>{' '}
                </RowFixed>
                <RowFixed justify="flex-end">
                  <Text2>
                    <Address>
                      <StyledExternalLink
                        target="_blank"
                        href={getEtherscanLink(
                          chainId,
                          toToken.address,
                          'address'
                        )}
                        rel="noopener noreferrer"
                        style={{ justifyContent: 'left' }}
                      >
                        <Label
                          weight={800}
                          color="#2eca93"
                          size={11}
                          text={
                            toToken.address
                              ? `${toEllipsis(toToken.address, 16)}`
                              : ``
                          }
                          style={{ lineHeight: 1.6 }}
                        />
                        <GoTo />
                      </StyledExternalLink>
                    </Address>
                  </Text2>
                </RowFixed>
              </>
            ) : (
              ''
            )}
          </Row>
          <ViewPair onClick={handleRouteChange}>
            <Span>View analytics</Span>
          </ViewPair>
        </AutoColumn>
      </WidgetCard>
    ) : (
      <WidgetCard>
        <AutoColumn style={{ padding: '20px' }}>
          <RowAround>
            <TwitterShareButton
              title={
                availableTokens
                  ? `Check out ${toToken?.symbol} on MonoX!`
                  : 'Check out this project on MonoX!'
              }
              url={window.location.href}
            >
              <RoundButton
                onMouseEnter={() => setHoveredTwitter(true)}
                onMouseLeave={() => setHoveredTwitter(false)}
              >
                {hoveredTwitter ? (
                  <img src={HoveredTwitterIcon} width={15} alt="twiter icon" />
                ) : (
                  <img src={TwitterIcon} width={15} alt="twiter icon" />
                )}
              </RoundButton>
            </TwitterShareButton>
            <TelegramShareButton
              title={
                availableTokens
                  ? `Check out ${toToken?.symbol} on MonoX!`
                  : 'Check out this project on MonoX!'
              }
              url={window.location.href}
            >
              <RoundButton
                onMouseEnter={() => setHoveredTelegram(true)}
                onMouseLeave={() => setHoveredTelegram(false)}
              >
                {hoveredTelegram ? (
                  <img src={HoveredTelegramIcon} width={15} alt="twiter icon" />
                ) : (
                  <img src={TelegramIcon} width={15} alt="twiter icon" />
                )}
              </RoundButton>
            </TelegramShareButton>
            <RoundButton
              onClick={handleCopyLink}
              data-tip="copied"
              data-event="click"
              data-event-off="click"
              data-iscapture="true"
              onMouseEnter={() => setHoveredLink(true)}
              onMouseLeave={() => setHoveredLink(false)}
            >
              <ReactTooltip delayHide={2000} />
              {hoveredLink ? (
                <img src={HoveredCopyLink} width={15} alt="copy link" />
              ) : (
                <img src={CopyLink} width={15} alt="copy link" />
              )}
            </RoundButton>
          </RowAround>
        </AutoColumn>
      </WidgetCard>
    )
  ) : null
}

export default SwapWidget

const WidgetCard = styled.div`
  border-radius: 15px;
  box-shadow: 3px 3px 8px 0 rgba(209, 217, 230, 0.5);
  width: 320px;
  margin: 0 auto;
  transform-origin: 100% 0;
  animation: swap-widget 0.5s;
  @keyframes swap-widget {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
   :after {
    position: absolute;
    content: '';
    bottom: -100px;
    height: 40px;
    width: 1px;
  }`}
`

const Row = styled(RowBetween)`
  padding: 5px 0;
  ${(props) => (props.last ? 'border:none' : 'border-bottom:1px solid #d7dee8')}
`
const RowAround = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
`
const Text1 = styled.span`
  font-size: 11px;
  opacity: 0.5;
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-stretch: normal;
  letter-spacing: normal;
  color: ${({ theme }) => theme.color.secondary.main};
`
const Text2 = styled.span`
  font-size: 11px;
  opacity: 0.5;
  font-weight: bold;
  color: ${({ theme }) => theme.color.secondary.main};
`

const ViewPair = styled.div`
  border-radius: 4px;
  border: ${({ theme }) => `solid 1px ${theme.color.border.primary}`};
  display: flex;
  height: 26px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-out;
  background-color: #41dea2; 
  &:hover {
    box-shadow: 0 6px 21px 0 #d1d9e6; !important;
  }
`
const Span = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  margin: 5px 0;
`

const GoTo = styled(DiagonalArrowRightUpOutline)`
  width: 15px;
  height: 15px;
  margin-left: 0px !important;
`

const Address = styled.div`
  color: #2eca93;
  font-size: 11px;
  font-weight: 400;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.color.font.primary};
    opacity: 1;
    font-weight: 800;
    .etherscan-link {
      display: inline-block;
    }
  }
  .etherscan-link {
    display: none;
  }
`

const RoundButton = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #d7dee8;
  :hover {
    border: 1px solid ${(props) => props.theme.color.border.green};
  }
`
