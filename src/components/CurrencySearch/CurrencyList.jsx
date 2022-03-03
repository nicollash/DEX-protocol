import React, { useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'

import Label from 'components/Label'
import { Currency, currencyEquals, ETHER } from '@uniswap/sdk'

const currencyKey = (currency) => {
  return currency ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const CurrencyRow = ({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}) => {
  const key = currencyKey(currency)
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <StyledImage src={currency.logoURI} />
      <Column>
        <Label text={currency.name} size={16} />
      </Column>
    </MenuItem>
  )
}

const CurrencyList = ({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
}) => {
  const itemData = useMemo(
    () => (showETH ? [Currency.ETHER, ...currencies] : currencies),
    [currencies, showETH]
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency = data[index]
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      )
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      )
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index, data) => {
    return currencyKey(data[index])
  }, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

const Row = styled.div`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

const RowBetween = styled(Row)`
  justify-content: space-between;
`

const MenuItem = styled(RowBetween)`
  box-sizing: border-box;
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

const StyledImage = styled.img`
  width: 24px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export default CurrencyList
