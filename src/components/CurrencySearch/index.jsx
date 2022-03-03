import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

import { ETHER } from '@uniswap/sdk'
import { TokenContext } from 'contexts/TokenProvider'
import { isAddress } from 'monox/constants'

import Label from 'components/Label'
import CurrencyList from 'components/CurrencySearch/CurrencyList'
import Spacer from 'components/Spacer'
import Card from 'components/Card'

const CurrencySearch = ({
  selectedCurrency,
  onCurrencySelect,
  handleBlack,
  onChangeList,
}) => {
  const fixedList = useRef()
  const [searchQuery, setSearchQuery] = useState('')
  const { selectedTokenList } = useContext(TokenContext)
  const isAddressSearch = isAddress(searchQuery)

  const showETH = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const filteredTokens = useMemo(() => {
    if (!selectedTokenList || selectedTokenList.length === 0) return []

    if (isAddressSearch) {
      let searchToken
      searchToken = selectedTokenList.tokens.filter((token) =>
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return searchToken ? [searchToken] : []
    }

    return selectedTokenList.tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [isAddressSearch, selectedTokenList, searchQuery])

  const handleCurrencySelect = useCallback(
    (currency) => {
      onCurrencySelect(currency)
      handleBlack()
    },
    [handleBlack, onCurrencySelect]
  )

  useEffect(() => {
    setSearchQuery('')
  }, [])

  const inputRef = useRef()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredTokens.length > 0) {
          if (
            filteredTokens[0].symbol.toLowerCase() ===
              searchQuery.trim().toLowerCase() ||
            filteredTokens.length === 1
          ) {
            handleCurrencySelect(filteredTokens[0])
          }
        }
      }
    },
    [filteredTokens, handleCurrencySelect, searchQuery]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Label text="Select a token" size={14} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={'Search name or paste address'}
          value={searchQuery}
          ref={inputRef}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
      </PaddedColumn>

      <div style={{ flex: '1' }}>
        <CurrencyList
          height={500}
          showETH={showETH}
          currencies={filteredTokens}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          fixedListRef={fixedList}
        />
      </div>

      <Spacer />
      <Card>
        <PaddedColumn>
          <RowBetween>
            {selectedTokenList ? (
              <Row>
                {selectedTokenList.logoURI ? (
                  <StyledImage
                    style={{ marginRight: 12 }}
                    src={selectedTokenList.logoURI}
                    alt={`${selectedTokenList.name} list logo`}
                  />
                ) : null}
                <Label text={selectedTokenList.name} size={14} />
              </Row>
            ) : null}
            <LinkStyledButton
              style={{ fontWeight: 500, color: '#565A69', fontSize: 16 }}
              onClick={onChangeList}
              id="currency-search-change-list-button"
            >
              {selectedTokenList ? 'Change' : 'Select a list'}
            </LinkStyledButton>
          </RowBetween>
        </PaddedColumn>
      </Card>
      <Spacer />
    </Column>
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

export const LinkStyledButton = styled.button`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :active {
    text-decoration: none;
  }
`

const RowBetween = styled(Row)`
  justify-content: space-between;
`

const StyledImage = styled.img`
  width: 24px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const AutoColumn = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === 'sm' && '8px') ||
    (gap === 'md' && '12px') ||
    (gap === 'lg' && '24px') ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export default CurrencySearch
