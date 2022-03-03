import React from 'react'
import styled, { keyframes } from 'styled-components'

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`

const Label = styled.label`
  position: relative;
  display: inline-block;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin: 0em 1.5em;
  color: ${({ theme }) => theme.color.font.warning};
  font-size: 13px;
  font-weight: 800;
`
const Container = styled.div``

const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(45deg);
  }
`

const Indicator = styled.div`
  width: 13px;
  height: 13px;
  background: ${({ theme }) => theme.color.background.main};
  position: absolute;
  top: 0em;
  left: -1.6em;
  border: 1px solid ${({ theme }) => theme.color.font.warning};
  border-radius: 0.2em;

  ${Input}:not(:disabled):checked & {
    background: #d1d1d1;
  }

  &::after {
    content: '';
    position: absolute;
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    top: 0em;
    left: 3px;
    width: 35%;
    height: 70%;
    border: solid ${({ theme }) => theme.color.font.warning};
    border-width: 0 2px 2px 0;
    animation-name: ${rotate};
    animation-fill-mode: forwards;
  }

  &::disabled {
    cursor: not-allowed;
  }
`

export default function Checkbox({
  value,
  checked,
  onChange,
  name,
  id,
  label,
  disabled,
  style,
}) {
  return (
    <Container style={style}>
      <Label htmlFor={id} disabled={disabled}>
        {label}
        <Input
          id={id}
          type="checkbox"
          name={name}
          value={value}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />
        <Indicator />
      </Label>
    </Container>
  )
}
