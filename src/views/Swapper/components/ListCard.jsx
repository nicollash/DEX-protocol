import React, { useState } from 'react'
import styled from 'styled-components'
import { Cross } from '@styled-icons/entypo/Cross'
import { matchSorter } from 'match-sorter'

const ListCard = ({
  items,
  currency,
  setCurrency,
  text,
  toggleList,
  setIsDropdown,
}) => {
  const [filteredData, setFilteredData] = useState(items)

  const handleCurrency = (value) => {
    setIsDropdown(true)
    setCurrency(value)
    toggleList()
  }

  const handleSearch = (value) => {
    setFilteredData(
      matchSorter(items, value, { keys: ['address', 'symbol', 'name'] })
    )
  }

  const Image = ({ data }) => (
    <div>
      <img src={data.logoURI} height="48" width="48"></img>
      <Symbol>
        {data.name} - <Span>{data.symbol}</Span>
      </Symbol>
    </div>
  )
  return (
    <Div>
      {text} <CrossIcon onClick={toggleList} />{' '}
      <StyledSearchBarWrapper>
        <StyledSearchBar onChange={(e) => handleSearch(e.target.value)} />{' '}
      </StyledSearchBarWrapper>
      {filteredData.map((i) => (
        <div onClick={() => handleCurrency(i)} key={i.symbol + text}>
          {currency ? (
            currency.symbol !== i.symbol ? (
              <Item>
                <Image data={i} />
              </Item>
            ) : null
          ) : (
            <Item>
              <Image data={i} />
            </Item>
          )}
        </div>
      ))}
    </Div>
  )
}

const Div = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  position: absolute;
  width: 92%;
  height: 93%;
  margin: -1rem;
  transition: all 2s;
  overflow: auto;
  transform: 'translate3d(0px, 0px, 0px)';
`
const Item = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.color.primary.light};
    border: 1px solid pink;
  }
  cursor: pointer;
  border: 1px solid white;
  margin: 1rem 0.5rem;
  padding: 0.3rem;
  padding-top: 0.55rem;
  border-radius: 8px;
`
const Span = styled.span`
  color: #ff007d;
`
const Symbol = styled.div`
  width: 75%;
  float: right;
  padding: 1rem;
  font-weight: 500;
`
const CrossIcon = styled(Cross)`
  height: 20px;
  float: right;
  cursor: pointer;
`
const StyledSearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`
const StyledSearchBar = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #cecece;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export default ListCard
