import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow'

import Spacer from 'components/Spacer'
import Input from 'components/Input'
import Label from 'components/Label'
import { UnknownTokenIcon } from 'components/IconButton'

const SCard = ({
  text,
  amount,
  handleChangeAmount,
  currency,
  toggle = false,
  balance,
  showBalance = true,
  showMax = false,
  showRight = true,
}) => {
  const [isSelector, setIsSelector] = useState(toggle ? true : false)
  const [maxClicked, setMaxClicked] = useState(false)
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    setMaxClicked(false)
  }, [currency])

  const handleMaxClick = () => {
    handleChangeAmount(balance)
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
    <>
      <Row>
        <Column>
          <Label
            size={13}
            weight={800}
            opacity={0.5}
            text={text}
            align="left"
          />
        </Column>
        {showRight && (
          <Column style={{ textAlign: 'end' }} flex={2}>
            <BalanceContainer>
              {showMax && currency && !maxClicked ? (
                <MaxButton onClick={handleMaxClick}>MAX</MaxButton>
              ) : null}
              {showBalance && (
                <Label
                  size={13}
                  weight={800}
                  opacity={0.5}
                  text={
                    text === 'Price'
                      ? ''
                      : ` ${
                          currency
                            ? `Balance: ${balance > 0 ? balance : 0}`
                            : '-'
                        }`
                  }
                />
              )}
            </BalanceContainer>
          </Column>
        )}
      </Row>
      <Spacer size="sm" />
      <RowInput focus={focus}>
        {text === 'Price' ? (
          <Text onClick={toggle} isSelector={isSelector}>
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
              style={{
                marginLeft: '30px',
              }}
            />
            <Text
              onClick={toggle}
              token={currency?.symbol}
              isSelector={isSelector}
            >
              {currency
                ? `${currency.symbol}${!showBalance ? ' LP Token' : ''}`
                : 'Choose Token'}{' '}
              {isSelector ? <ArrowDown isPad={currency?.symbol} /> : ''}
            </Text>
            <ImageWrapper>
              {currency?.logoURI ? (
                <Image src={currency?.logoURI} />
              ) : (
                <UnknownTokenIcon />
              )}
            </ImageWrapper>
          </>
        )}
      </RowInput>
      <Spacer />
    </>
  )
}
const ArrowDown = styled(DownArrow)`
  height: 9px;
  margin: ${(props) => props.isPad && '4px 14px 7px 0'};
  opacity: 0.32;
  color: ${({ theme }) => theme.color.secondary.main};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 55px;
  align-items: center;
  ${(props) => props.focus && props.theme.inputFocusBorder}
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: ${({ flex }) => flex ?? 1};
  padding: 4px 5px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top:0
  `}
`

const Text = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  width: ${(props) => !props.token && '110px'};
  cursor: ${(props) => props.isSelector && 'pointer'};
  margin-left: 10px;
  margin-right: ${(props) => !props.isSelector && '12px'};
  margin-top: 1px;
  text-align: left;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 10px;
  `}
`

const ImageWrapper = styled.div`
  box-shadow: 0 10px 25px 0 rgba(188, 195, 207, 0.49),
    0 10px 10px 0 rgba(185, 192, 204, 0.3),
    inset 0 -14px 23px 0 rgba(176, 183, 194, 0.5),
    inset 0 -10px 10px 0 rgba(253, 244, 229, 0.7);
  width: 55px;
  height: 55px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img`
  width: 55px;
  height: 55px;
`
const MaxButton = styled.div`
  background: rgba(61, 207, 151, 0.15);
  width: 40px;
  height: 20px;
  font-family: Lato;
  font-size: 11px;
  font-weight: 900;
  color: ${({ theme }) => theme.color.font.primary};
  transition: background-color 0.3s ease-out;
  border-radius: 4px;
  text-align: center;
  line-height: 1.9;
  margin-right: 5px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: ${({ theme }) => theme.color.font.primary};
  }
`

const BalanceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction:column-reverse;
  align-items:flex-end;
  margin-top:0
  `}
`

export default SCard
