import React from 'react'
import styled from 'styled-components'

import { UnknownTokenIcon } from 'components/IconButton'

const TokenImage = ({ src, style, width = 45, height = 45, letter }) => {
  return (
    <ImageContainer style={style} height={height} width={width}>
      {src && src !== 'undefined' ? (
        <Image height={height} width={width} src={src} />
      ) : letter ? (
        <Div height={height} width={width}>
          {letter}
        </Div>
      ) : (
        <UnknownTokenIcon height={height} width={width} />
      )}
    </ImageContainer>
  )
}

export default TokenImage

const Div = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border-radius: 100%;
  border: 1.5px dashed ${(props) => props.theme.color.font.green};
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 800;
  color: #3fd69c;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ImageContainer = styled.div`
  object-fit: contain;
  background-color: #f5f5f8;
  border-radius: 100%;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Image = styled.img`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border-radius: 100%;
`
