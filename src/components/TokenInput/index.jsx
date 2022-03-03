import React from 'react'
import styled from 'styled-components'

import Button from 'components/Button'

const TokenInput = ({ label }) => {
  const handleSetMax = () => {
    console.log('handleSetMax')
  }

  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledInputWrapper>
        <StyledInput></StyledInput>
        <Button text={'Max'} onClick={handleSetMax} />
      </StyledInputWrapper>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  border: 1px solid ${(props) => props.theme.spacing[4]};
  border-radius: 20px;
`

const StyledLabel = styled.label`
  font-size: 14px;
  color: ${(props) => props.theme.color.grey[400]};
`

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledInput = styled.input`
  border: none;
  font-size: 24px;
  font-weight: 500;
  background-color: ${(props) => props.theme.color.white};
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default TokenInput
