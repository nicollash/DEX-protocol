import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Input = ({
  size,
  onBlur,
  onFocus,
  type = 'text',
  onChange,
  placeholder,
  value,
  style = {},
  focus = false,
  testid = 'input',
}) => {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && focus && value) {
      ref.current.selectionStart = value.length
      ref.current.selectionEnd = value.length
    }
  }, [focus, value])

  const handleChange = (e) => {
    if (type === 'number') {
      const updatedValue = e.target.value.replace(',', '.')
      onChange({ target: { value: updatedValue } })
    } else {
      onChange(e)
    }
  }

  return (
    <StyledInput
      onBlur={onBlur}
      onFocus={onFocus}
      size={size}
      placeholder={placeholder || '0.0'}
      value={value}
      onChange={handleChange}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      minLength={1}
      maxLength={79}
      spellCheck="false"
      style={{ ...style }}
      ref={ref}
      data-testid={testid}
    />
  )
}

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
  color: ${({ theme }) => theme.color.secondary.main};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-right:5px;
  `}
  ::placeholder {
    color: ${({ theme }) => theme.color.secondary.main};
    opacity: 0.3;
    font-size: 14px;
    font-weight: 800;
  }
`

export default Input
