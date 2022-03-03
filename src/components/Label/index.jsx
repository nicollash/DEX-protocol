import React from 'react'
import styled from 'styled-components'

const Label = ({
  text,
  size,
  color,
  title,
  weight,
  align,
  opacity,
  style = {},
  primary = false,
  pointer,
  maxWidth,
  onClick = () => {},
  children,
}) => (
  <StyledLabel
    size={size}
    color={color}
    title={title}
    weight={weight}
    opacity={opacity}
    style={style}
    onClick={onClick}
    align={align}
    primary={primary}
    pointer={pointer}
    maxWidth={maxWidth}
  >
    {text ?? children}
  </StyledLabel>
)

const StyledLabel = styled.div`
  color: ${(props) =>
    props.color
      ? props.color
      : props.primary
      ? props.theme.color.primary.main
      : props.theme.color.secondary.main};
  font-size: ${(props) => (props.size ? props.size : 16)}px;
  font-weight: ${(props) => (props.weight ? props.weight : 400)};
  opacity: ${(props) => (props.opacity > 0 ? props.opacity : 1)};
  font-family: Nunito;
  text-align: ${(props) => props.align};
  cursor: ${(props) => props.pointer && 'pointer'};
  text-overflow: ${(props) => (props.maxWidth > 0 ? 'ellipsis' : 'unset')};
  overflow: hidden;
  white-space: ${(props) => (props.maxWidth > 0 ? 'nowrap' : 'normal')};
  max-width: ${(props) => props.maxWidth}px;
`

export default Label
