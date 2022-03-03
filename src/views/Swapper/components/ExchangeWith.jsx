import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import useSearchToken from 'hooks/useSearchToken'
import useWallet from 'hooks/useWallet'
import usePoolList from 'hooks/usePoolList'
import config from 'monox/config'

import Label from 'components/Label'
import { StyledChevronIcon } from 'components/StyledIcon'

const ExchangeWith = ({
  setToCurrency,
  fromCurrency,
  setFromCurrency,
  setIsDropdown,
}) => {
  const { chainId } = useWallet()
  const { poolList } = usePoolList()
  const poolTokenList = poolList.map((item) => item?.token)
  const networkId = useSelector(({ network }) => network.id)
  const vUSDData = config[networkId || chainId].vUSD
  const [isOpen, setIsOpen] = useState(false)
  const { filteredTokenList: tokenList } = useSearchToken()
  const filteredTokens = useMemo(
    () => tokenList.filter((token) => token.symbol !== fromCurrency?.symbol),
    [fromCurrency, chainId || networkId]
  )

  const availableTokens = filteredTokens.filter(
    (item) =>
      poolTokenList?.includes(item?.address) ||
      !item?.address ||
      item?.address === vUSDData?.address
  )
  const handleSelectedToken = (token) => {
    if (fromCurrency) {
      setToCurrency(token)
    } else {
      setFromCurrency(token)
    }
    setIsDropdown(true)
  }
  const tokens = isOpen ? availableTokens : availableTokens.slice(0, 4)

  return (
    <>
      <Label text="Exchange with" size="16" weight="800" />
      <ExpandingTokenContainer>
        <ExpandingTokenAbsoluteContainer open={isOpen}>
          {tokens.map((t, index) => (
            <TokenContainer
              key={t.symbol}
              onClick={() => handleSelectedToken(t)}
              data-testid={`container-${index}`}
            >
              <img height={24} width={24} src={t.logoURI} />
              <Tag>{t.symbol}</Tag>
            </TokenContainer>
          ))}
        </ExpandingTokenAbsoluteContainer>
        {availableTokens.length > 4 && (
          <ChevronContainer
            onClick={() => setIsOpen(!isOpen)}
            data-testid="chevron-container"
          >
            <StyledChevronIcon isSwapped={isOpen} />
          </ChevronContainer>
        )}
      </ExpandingTokenContainer>
    </>
  )
}

const TokenContainer = styled.div`
  width: 100px;
  height: 35px;
  border-radius: 29px;
  box-shadow: 8px 8px 20px 0 #d0d8e6, -8px -8px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  background-color: ${({ theme }) => theme.color.background.main};
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 25px;
  margin-bottom: 20px;
  padding: 5px 8px;
  box-sizing: border-box;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height: auto;
  `};
`
const Tag = styled.span`
  font-family: Nunito;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.color.secondary.main};
  margin-left: 0.5625rem;
`

const ExpandingTokenContainer = styled.div`
  width: 100%;
  position: relative;
  will-change: height;
  margin-bottom: 16px;
  padding-top: 2px;
  opacity: 1;
  margin-top: 1.6875rem;
  display: flex;
  max-width: 545px;
`
const ExpandingTokenAbsoluteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  will-change: width, height;
  padding: 0px;
  background-color: ${({ theme }) => theme.color.background.main};
  border-radius: 5px;
  height: ${(props) => (props.open ? 'auto' : '50px')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height: auto;
  `}
`

const ChevronContainer = styled.div`
  height: 33px;
  width: 33px;
  will-change: transform, background-color, box-shadow;
  cursor: pointer;
  border-radius: 100%;
  transition: all 0.18s ease-in 0s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-left : 5px
  `};
`
export default ExchangeWith
