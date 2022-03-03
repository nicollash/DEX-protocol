import React from 'react'
import styled from 'styled-components'

const Selector = ({
  dataTip,
  dataFor,
  startAdornment,
  endAdornment,
  placeholder,
  selectedOption,
  handleOpenMenu,
}) => (
  <StyledWrapper dataTip={dataTip} dataFor={dataFor}>
    {!!startAdornment && startAdornment}
    <StyledSelector>
      <StyledSelectButton onClick={handleOpenMenu}>
        {selectedOption ? (
          <StyledButtonLabel>
            <img src={selectedOption.logoURI} height="25" alt="dice" />
            <span>{selectedOption.name}</span>
          </StyledButtonLabel>
        ) : (
          placeholder
        )}
      </StyledSelectButton>
    </StyledSelector>
    {!!endAdornment && endAdornment}
  </StyledWrapper>
)

const StyledWrapper = styled.div.attrs(({ dataTip, dataFor }) => ({
  'data-tip': dataTip,
  'data-for': dataFor,
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.color.grey[600]};
`

const StyledSelector = styled.div`
  position: relative;
  width: 126px;
  margin-right: 10px;
  margin-left: 20px;
  height: 40px;
  overflow: visible;
  display: flex;
  flex-direction: column;
`

const StyledSelectButton = styled.button`
  border-radius: 10px;
  width: 100%;
  border: 0;
  font-size: 14px;
  font-weight: bold;
  background-color: ${(props) => props.theme.color.primary.main};
  height: 40px;
  outline: none !important;
  color: ${(props) => props.theme.color.grey[100]};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;

  &:hover {
    background-color: ${(props) => props.theme.color.red[300]};
  }
`

const StyledButtonLabel = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  align-items: center;
  font-family: Arial;
  color: ${(props) => (!props.disabled ? props.color : `${props.color}55`)};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[100]};
  }

  & > img {
    margin-right: 10px;
  }

  & > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export default Selector
