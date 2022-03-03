import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Spinner from 'react-svg-spinner'

import ArrowIcon from 'assets/img/swapBtn.svg'
import AddIcon from 'assets/img/liquidity-add.svg'
import RemoveIcon from 'assets/img/liquidity-remove.svg'

const icons = {
  arrow: ArrowIcon,
  add: AddIcon,
  remove: RemoveIcon,
}

const StyledIconButton = ({
  children,
  onClick,
  disabled,
  block,
  variant,
  icon,
  isPerforming,
  isConfirmSwap = false,
  fontColor,
  style = {},
  transition = false,
}) => {
  const { color } = useContext(ThemeContext)
  let backgroundColor = ''
  let borderLeft = ''
  let borderRight = ''
  let hover = ''
  let boxShadow = '0 12px 20px 0 #d1d9e6;'

  switch (variant) {
    case 'primary':
      backgroundColor = disabled ? `${color.button.disable}` : color.button.main
      borderLeft = !disabled ? '#3db57e' : '#8e93a3'
      borderRight = !disabled ? '#4de69f' : '#f5f5f8'
      hover = !disabled && color.button.hover.main
      break
    case 'secondary':
      backgroundColor = disabled
        ? `${color.button.disable}`
        : color.button.light
      borderLeft = !disabled ? '#b04a4a' : '#8e93a3'
      borderRight = !disabled ? '#e36060' : '#f5f5f8'
      hover = !disabled && color.button.hover.light
      break
    default:
      backgroundColor = disabled
        ? `${color.background.disable}`
        : color.background.main
      borderLeft = !disabled ? '#cdd3dd' : '#8e93a3'
      borderRight = !disabled ? '#f8fcff' : '#f5f5f8'
      boxShadow =
        '6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff, -1px -1px 3px 0 #ffffff'
      fontColor = color?.font?.[fontColor] ?? fontColor
      hover = !disabled && color.button.hover.main
  }

  return (
    <ButtonContainer
      onClick={onClick}
      disabled={disabled}
      color={color}
      backgroundColor={backgroundColor}
      block={block}
      boxShadow={boxShadow}
      style={style}
      className={transition ? 'btn-press' : ''}
      hover={hover}
    >
      <Div block={block} fontColor={fontColor}>
        {children}
      </Div>
      {(icon && !isPerforming) || !isConfirmSwap ? (
        <>
          {icons[icon] && (
            <Border
              disabled={disabled}
              borderLeft={borderLeft}
              borderRight={borderRight}
            />
          )}
          <Image src={icons[icon]} />
        </>
      ) : (
        <>
          <Border
            disabled={disabled}
            borderLeft={borderLeft}
            borderRight={borderRight}
          />
          <SpinnerContainer>
            <Spinner color="#ffffff" size="20px" />
          </SpinnerContainer>
        </>
      )}
    </ButtonContainer>
  )
}

const ButtonContainer = styled.div`
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  border-radius: 6px;
  color: ${(props) => (!props.color ? props.color : `#fff`)};
  cursor: ${(props) => !props.disabled && 'pointer'};
  font-size: 14px;
  font-weight: 900;
  height: 46px;
  align-items: center;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: ${(props) => (props.block ? '100%' : 'fit-content')};
  box-shadow: ${(props) => props.boxShadow};
  transition: color 0.3s ease, background-color 0.3s ease,
    border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  &:hover {
    background-color: ${(props) => !props.disabled && props.hover};
    box-shadow: none !important;
  }
`
const Image = styled.img`
  padding: 16px;
`

const Border = styled.div`
  border-left: 1px solid ${(props) => props.borderLeft};
  border-right: 1px solid ${(props) => props.borderRight};
  height: 50%;
`

const Div = styled.div`
  display: flex;
  border-radius: 4px;
  color: ${(props) => (props.fontColor ? props.fontColor : 'white')};
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  height: 46px;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.block
      ? `width:100%;padding-left:calc(100% - 93%)`
      : `padding-left:35px;padding-right:24px`};
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`

export default StyledIconButton
