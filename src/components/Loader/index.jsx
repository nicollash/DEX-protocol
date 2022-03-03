import React from 'react'
import styled from 'styled-components'
import { LoaderAlt } from '@styled-icons/boxicons-regular/LoaderAlt'

const Loader = ({ color, height, style = {} }) => (
  <Loading color={color} height={height} style={style} />
)

const Loading = styled(LoaderAlt)`
  height: ${(props) => props.height ?? '40'}px;
  color: ${(props) => props.theme.color[props?.color ?? 'primary'].main};
  animation: spin 1.2s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
export default Loader
