import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

const trackH = '5px'
const thumbD = '24px'
const trackC = '#cad1de'
const fillA = '#8be2c1'
const fillB = '#3dcf97'

const track = css`
  box-sizing: border-box;
  border: none;
  height: 4px;
  background: ${trackC};
  border-radius: 8px;
`

const trackFill = css`
  ${track};
  height: 6px;
  background-color: transparent;
  background-image: linear-gradient(90deg, ${fillA}, ${fillB}),
    linear-gradient(#d1d9e6, #f5f5f8);
  background-size: var(--sx) 6px, calc(100% - var(--sx)) 4px;
  background-position: left center, right center;
  background-repeat: no-repeat;
`

const fill = css`
  height: ${trackH};
  background: ${fillA};
  border-radius: 4px;
`

const thumb = css`
  box-sizing: border-box;
  border: none;
  width: ${thumbD};
  height: ${thumbD};
  border-radius: 50%;
  background: radial-gradient(circle at 100px 100px, #3dcf97, white);
  box-shadow: 0 10px 25px 0 rgba(188, 195, 207, 0.7),
    0 10px 10px 0 rgba(185, 192, 204, 0.5), inset 0 -14px 23px 0 #3dcf97,
    inset 0 -10px 10px 0 #3ed49a;
`

const StyledRangeInput = styled.input`
  cursor: pointer;
  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * ${thumbD} + var(--ratio) * (100% - ${thumbD}));

  margin: 0;
  padding: 0;
  width: 100%;
  height: ${thumbD};
  background: transparent;
  font: 1em/1 arial, sans-serif;

  &::-webkit-slider-runnable-track {
    ${trackFill};
  }

  &::-moz-range-track {
    ${track};
  }

  &::-ms-track {
    ${track};
  }

  &::-moz-range-progress {
    ${fill};
  }

  &::-ms-fill-lower {
    ${fill};
  }

  &::-webkit-slider-thumb {
    margin-top: calc(0.5 * (${trackH} - ${thumbD}));
    ${thumb};
  }

  &::-moz-range-thumb {
    ${thumb};
  }

  &::-ms-thumb {
    margin-top: 0;
    ${thumb};
  }

  &::-ms-tooltip {
    display: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }
`

export default function Slider({
  value,
  onChange,
  min = 0,
  step = 0.1,
  max = 100,
  size = 28,
}) {
  const changeCallback = useCallback(
    (e) => {
      onChange(parseFloat(e.target.value))
    },
    [onChange]
  )

  return (
    <StyledRangeInput
      size={size}
      type="range"
      value={value}
      style={{
        padding: '10px 0',
        '--min': min,
        '--max': max,
        '--val': value,
      }}
      onChange={changeCallback}
      aria-labelledby="input slider"
      step={step}
      min={min}
      max={max}
    />
  )
}
