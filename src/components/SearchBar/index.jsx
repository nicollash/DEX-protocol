import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import styled from 'styled-components'

import useSearchToken from 'hooks/useSearchToken'
import useKeyPress from 'hooks/useKeyPress'
import { uriToHttp } from 'monox/getTokenList'
import { lpToken } from 'monox/constants'

import Label from 'components/Label'
import { Row } from 'components/Row'
import Spacer from 'components/Spacer'
import TokenImage from 'components/TokenImage'
import useWallet from 'hooks/useWallet'
import searchIcon from 'assets/img/search.svg'
import whiteSearchIcon from 'assets/img/white-search.svg'

const SearchBar = ({
  fullWidth = true,
  text = null,
  style = {},
  innerStyle = {},
  isHome = true,
  setDataFetched = null,
}) => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const history = useHistory()
  const [focus, setFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const { onGetToken } = useSearchToken()

  const getToken = useCallback(async () => {
    const tokenData = await onGetToken(searchValue)
    const sortData = tokenData
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => item?.chainId === networkId)
    setFilteredData(sortData)
  }, [searchValue])

  useEffect(
    () => {
      if (searchValue !== '') {
        getToken()
      } else {
        setFilteredData([])
      }
    },
    [searchValue],
    getToken
  )

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const enterPress = useKeyPress('Enter')
  const [cursor, setCursor] = useState(0)
  const [hovered, setHovered] = useState(null)

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

  const handleClickToken = useCallback(
    (token) => {
      setFilteredData([])
      setSearchValue('')
      if (setDataFetched) {
        setDataFetched(false)
      }
      if (lpToken.address === token.address) {
        window.open(
          'https://docs.monox.finance/getting-started/vusd-stablecoin',
          '_blank'
        )
      } else {
        history.push(
          `/analytics/${token?.address || token?.symbol}?network=${networkName}`
        )
      }
    },
    [setDataFetched]
  )

  useEffect(() => {
    if (filteredData.length && enterPress) {
      handleClickToken(filteredData[cursor])
    }
  }, [cursor, enterPress, filteredData, handleClickToken])

  useEffect(() => {
    if (filteredData.length && hovered) {
      setCursor(filteredData.indexOf(hovered))
    }
  }, [hovered, filteredData])

  const handleBlur = () => {
    setFilteredData([])
  }

  return (
    <Div fullWidth={fullWidth}>
      <OutsideClickHandler onOutsideClick={handleBlur} display="flex">
        <RowInput focus={focus} style={{ ...style }} isHome={isHome}>
          <StyledInput
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder={
              text ?? 'Search by token, name, symbol, or contract address'
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ ...innerStyle, marginLeft: '30px' }}
            isHome={isHome}
            focus={focus}
          />
          <SearchIcon
            src={!isHome && !focus ? whiteSearchIcon : searchIcon}
            style={{ marginRight: '30px' }}
          />
          {filteredData.length > 0 && (
            <DropDown>
              <Label
                size={18}
                color="#212d63"
                style={{ margin: '30px 0px 13px 40px', fontWeight: 'bold' }}
              >
                Tokens
              </Label>
              {filteredData.map((token, index) => (
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
                        height={40}
                        width={40}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    )}
                    <Label
                      color="#212d63"
                      size={14}
                      weight="bold"
                      style={{ marginRight: '15px' }}
                    >
                      {token.name} - <Span>{token.symbol}</Span>
                    </Label>
                  </Row>
                  <ViewButton>
                    {lpToken.address === token.address ? 'Read' : 'View'}
                  </ViewButton>
                </DropDownItem>
              ))}
              <Spacer size={'md'} />
              <Spacer size={'sm'} />
            </DropDown>
          )}
        </RowInput>
      </OutsideClickHandler>
    </Div>
  )
}

const Div = styled.div`
  max-width: ${(props) => `${props.fullWidth ? '538px' : '320px'}`};
  height: ${(props) => `50px`};
  width: 100%;
  > div {
    width: 100%;
    height: 100%;
  }
`

const RowInput = styled(Row)`
  box-shadow: ${(props) => (props.isHome ? props.theme.shadows.inset : '')};
  border-radius: 50px;
  position: relative;
  height: 50px;
  align-items: center;
  z-index: 2;
  height: 100%;
  ${(props) => props.focus && props.theme.inputFocusBorder}
`
const StyledInput = styled.input`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  appearance: textfield;
  font-weight: ${(props) => (props.size === 'sm' ? 'bold' : 'normal')};
  flex: 1;
  outline: none;
  border: none;
  background-color: inherit;
  font-size: 14px;
  font-weight: 800;
  text-align: left;
  width: 100%;
  color: ${({ theme }) => theme.color.secondary.main} !important;
  opacity: 0.5;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-right:5px;
  `}
  ::placeholder {
    color: ${(props) =>
      !props.focus && !props.isHome
        ? 'white'
        : props.theme.color.secondary.main};
    opacity: ${(props) => (!props.focus && !props.isHome ? 1 : 0.8)};
  }
`
const SearchIcon = styled.img`
  display: flex;
  height: 22px;
  width: 22px;
`
const DropDown = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.color.white};
  top: 100%;
  left: 0px;
  width: 100%;
  border-radius: 40px;
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
const StyledLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 20px;
  object-fit: contain;
  box-shadow: 0 5px 8px 0 rgba(14, 19, 41, 0.2);
`

const ViewButton = styled.button`
  padding: ${(props) => props.theme.spacing[1]}px
    ${(props) => props.theme.spacing[3]}px;
  border-radius: 4px;
  box-shadow: 6px 6px 20px 0 #c2cccc, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  background-color: ${(props) => props.theme.color.background.main};
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => props.theme.color.primary.main};
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
`
const Span = styled.span`
  color: ${(props) => props.theme.color.primary.main};
  font-size: 14px;
  font-weight: bold;
`

export default SearchBar
