import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow'

import useWallet from 'hooks/useWallet'

import Label from 'components/Label'
import { Row, RowFixed } from 'components/Row'
import Input from 'components/Input'
import TokenImage from 'components/TokenImage'
import Spacer from 'components/Spacer'

const PriceInput = ({
  text,
  amount,
  handleChangeAmount,
  currency,
  toggle = false,
  balance,
  showBalance = true,
  showMax = false,
  showRight = true,
  testid = 'price-input',
  testToggleId = 'toggle',
}) => {
  const { account } = useWallet()
  const [isSelector, setIsSelector] = useState(toggle ? true : false)
  const [maxClicked, setMaxClicked] = useState(false)
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    setMaxClicked(false)
  }, [currency])

  const handleMaxClick = () => {
    if (currency?.address) {
      handleChangeAmount(balance)
    } else {
      handleChangeAmount(balance - 0.01)
    }
    setMaxClicked(true)
  }

  const handleInputChange = (e) => {
    if (handleChangeAmount) {
      handleChangeAmount(e.target.value)
    }
    if (maxClicked === true) {
      setMaxClicked(false)
    }
  }
  return (
    <RowInput focus={focus}>
      <Div>
        <Row>
          <RowFixed style={{ marginRight: 'auto' }}>
            <Label size={12} weight={800} opacity={0.5} text={text} />
          </RowFixed>
          <RowFixed>
            {showMax && currency && !maxClicked ? (
              account ? (
                <RowFixed>
                  <MaxButton onClick={handleMaxClick}>MAX</MaxButton>
                </RowFixed>
              ) : (
                ''
              )
            ) : null}
            {showRight &&
              (account ? (
                <BalanceContainer balance={balance ? balance.toString() : ''}>
                  {showBalance && (
                    <>
                      {currency && (
                        <Label
                          size={13}
                          weight={800}
                          opacity={0.5}
                          text={`Balance: `}
                          style={{ margin: '0 3px 0 2px' }}
                        />
                      )}
                      <Label
                        size={13}
                        weight={800}
                        opacity={0.5}
                        text={
                          text === 'Price'
                            ? ''
                            : ` ${
                                currency ? `${balance > 0 ? balance : 0}` : '-'
                              }`
                        }
                      />
                    </>
                  )}
                </BalanceContainer>
              ) : (
                <Label
                  size={12}
                  weight={800}
                  opacity={0.5}
                  text="Wallet Disconnected"
                />
              ))}
          </RowFixed>
        </Row>
        <Row style={{ marginTop: '12px' }}>
          {text === 'Price' ? (
            <Text
              onClick={toggle}
              isSelector={isSelector}
              data-testid={testToggleId}
            >
              vUSD {isSelector ? <ArrowDown /> : ''}
            </Text>
          ) : (
            <>
              <Input
                value={amount}
                type="number"
                onChange={handleInputChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                testid={testid}
              />
              {currency?.logoURI && (
                <TokenImage
                  height={24}
                  width={24}
                  src={currency?.logoURI}
                  letter={currency?.symbol && currency?.symbol[0]}
                />
              )}
              <Spacer size="sm" />
              <Text
                onClick={toggle}
                data-testid={testToggleId}
                token={currency?.symbol}
                isSelector={isSelector}
              >
                {currency
                  ? `${currency.symbol}${!showBalance ? ' LP Token' : ''}`
                  : 'Choose Token'}{' '}
                {isSelector ? <ArrowDown /> : ''}
              </Text>
            </>
          )}
        </Row>
      </Div>
    </RowInput>
  )
}

export default PriceInput

const RowInput = styled.div`
  box-shadow: ${(props) =>
    props.focus ? props.theme.shadows.insetFocus : props.theme.shadows.inset};
  border-radius: 23px;
  height: 98px;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  ${(props) =>
    props.focus
      ? props.theme.inputFocusBorder
      : `border: 1.5px solid ${props.theme.color.background.main}`};
`
const Div = styled.div`
  margin: 20px 30px;
  width: 100%;
`
export const MaxButton = styled.div`
  width: 31px;
  height: 14px;
  border-radius: 7.5px;
  border: solid 1px ${({ theme }) => theme.color.font.green};
  font-size: 10px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.font.green};
  transition: background-color 0.3s ease-out;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: ${({ theme }) => theme.color.font.green};
  }
`

const Text = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  cursor: ${(props) => props.isSelector && 'pointer'};
  text-align: left;
`
const ArrowDown = styled(DownArrow)`
  height: 9px;
  opacity: 0.32;
  color: ${({ theme }) => theme.color.secondary.main};
`
export const BalanceContainer = styled.div`
  display: flex;
  width: ${(props) => props.balance.length > 14 && 'min-content'};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  
  width: ${(props) => props.balance.length > 7 && 'min-content'};
  `}
`
