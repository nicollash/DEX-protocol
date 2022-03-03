import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import styled from 'styled-components'

import { uriToHttp } from 'monox/getTokenList'
import { isAddress } from 'monox/constants'
import useSearchToken from 'hooks/useSearchToken'
import useKeyPress from 'hooks/useKeyPress'

import Label from 'components/Label'
import { SpacerResponsive } from 'components/Spacer'
import TokenImage from 'components/TokenImage'

import searchIcon from 'assets/img/search.svg'

let address1 = ''
let address2 = ''

const SearchBar = () => {
  const history = useHistory()
  const location = useLocation()
  const { onGetToken } = useSearchToken()
  const networkId = useSelector(({ network }) => network.id)
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const [focus, setFocus] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [hovered, setHovered] = useState(null)
  const [cursor, setCursor] = useState(0)
  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const enterPress = useKeyPress('Enter')

  const params = location.pathname.split('/')
  if (params.length > 1 && params[1] === 'swap') {
    address1 = params[2] || ''
    address2 = params[3] || ''
  }

  const getToken = useCallback(async () => {
    const tokenData = await onGetToken(searchText)
    const sortData = tokenData
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => item?.chainId === networkId)
    setFilteredData(sortData)
  }, [searchText])

  useEffect(() => {
    if (filteredData.length && downPress) {
      setCursor((prevState) =>
        prevState < filteredData.length - 1 ? prevState + 1 : prevState
      )
    }
  }, [downPress, filteredData])

  useEffect(() => {
    if (filteredData.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState))
    }
  }, [upPress, filteredData])

  useEffect(() => {
    if (filteredData.length && enterPress) {
      const token = filteredData[cursor]
      handleClickToken(token)
    }
  }, [enterPress, filteredData, history, cursor])

  useEffect(() => {
    if (filteredData.length && hovered) {
      setCursor(filteredData.indexOf(hovered))
    }
  }, [hovered, filteredData])

  useEffect(() => {
    if (searchText !== '') {
      getToken()
    }
  }, [searchText])

  const handleBlur = () => {
    setFilteredData([])
  }

  const handleClickToken = (token) => {
    setFilteredData([])
    setSearchText('')
    if (address1) {
      history.push(`/swap/${address1}/${token?.symbol}?network=${networkName}`)
    } else {
      history.push(
        `/swap/${
          token?.notInList ? token?.address : token?.symbol
        }?network=${networkName}`
      )
    }
  }

  if (!location.pathname.includes('swap')) {
    return null
  }

  return (
    <OutsideClickHandler onOutsideClick={handleBlur}>
      <StyledSearchBar focus={focus}>
        <SearchInnerContainer>
          <StyledInput
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by token, name, symbol, or contract address"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={searchText}
            style={{
              backgroundColor: 'transparent',
              marginRight: '15px',
            }}
            focus={focus}
          />
          <SearchIcon src={searchIcon} />
        </SearchInnerContainer>
        {filteredData.length > 0 && (
          <DropDown>
            <Label
              size={18}
              color="#212d63"
              style={{ margin: '30px 0px 13px 40px', fontWeight: 'bold' }}
            >
              Tokens
            </Label>
            {filteredData.map((token, index) => {
              if (address1) {
                const key = isAddress(address1) ? 'address' : 'symbol'
                if (address1 === token[key]) {
                  setFilteredData(
                    filteredData.filter((f) => f[key] !== token[key])
                  )
                  return null
                }
              }
              if (address2) {
                const key = isAddress(address2) ? 'address' : 'symbol'
                if (address2 === token[key]) {
                  setFilteredData(
                    filteredData.filter((f) => f[key] !== token[key])
                  )
                  return null
                }
              }
              return (
                <DropDownItem
                  key={index}
                  onClick={() => handleClickToken(token)}
                  style={{
                    backgroundColor:
                      index === cursor ? 'rgba(45, 196, 143, 0.05)' : '',
                    borderLeft: index === cursor && '4px solid #41dea2',
                  }}
                  onMouseEnter={() => setHovered(filteredData)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Row>
                    {token.logoURI ? (
                      <StyledLogo src={token.logoURI} />
                    ) : (
                      <TokenImage
                        src={uriToHttp(token?.logoURI)[0]}
                        letter={token?.symbol && token?.symbol[0]}
                        height={18}
                        width={18}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    )}
                    <b>{token.name}</b>
                    {token.symbol}
                  </Row>
                </DropDownItem>
              )
            })}
            <SpacerResponsive size="20" />
          </DropDown>
        )}
      </StyledSearchBar>
    </OutsideClickHandler>
  )
}

export default SearchBar

const StyledSearchBar = styled.div`
  display: flex;
  position: relative;
  border-radius: 33.5px;
  @media (max-width: 768px) {
    display: none;
  }
  ${(props) => props.focus && props.theme.inputFocusBorder}
  z-index: 2;
`
const SearchIcon = styled.img`
  display: flex;
`
const SearchInnerContainer = styled.div`
  margin: 0.5rem;
  display: flex;
`
const StyledInput = styled.input.attrs((props) => ({
  type: 'text',
}))`
  min-width: 265px;
  height: 18px;
  margin: 0 0 0 13px;
  opacity: 0.3;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.tertiary.main};
  outline: none;
  border: none;
  background-color: ${({ theme }) => theme.color.background.main};
  &:focus {
    outline: none;
  }
  &:placeholder-shown {
    text-overflow: ellipsis;
  }
  @media (max-width: 1200px) {
    min-width: 200px;
    margin-right: 0.5rem;
  }
`
const DropDown = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.color.white};
  top: 100%;
  left: 0px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 25px 40px 0 rgba(14, 19, 41, 0.2);
  background-color: ${(props) => props.theme.color.background.main};
  ${(props) => props.theme.inputFocusBorder}
`

const DropDownItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing[2]}px
    ${(props) => props.theme.spacing[5]}px;
  width: auto;
  :hover {
    background-color: rgba(45, 196, 143, 0.05);
    border-left: 4px solid ${(props) => props.theme.color.border.green};
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  b {
    margin: 0px ${(props) => props.theme.spacing[2]}px;
  }
`
const StyledLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`
