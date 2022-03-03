import React from 'react'
import styled from 'styled-components'

import useModal from 'hooks/useModal'
import Label from 'components/Label'
import { Row } from 'components/Row'
import Spacer from 'components/Spacer'

import NetworkWarningImg from 'assets/img/network-warning.png'
import CardContainer from 'components/CardContainer'
import StyledIconButton from 'components/StyledIconButton'
import NetworkListModal from 'components/NetworkListModal'

const NetworkWarning = () => {
  const [handleNetworkClick] = useModal(<NetworkListModal />)

  return (
    <CardContainer
      style={{
        width: '100%',
        height: '220px',
        borderRadius: '15px',
        padding: '0px 25px',
      }}
      maxWidth="1067"
    >
      <Background src={NetworkWarningImg} />
      <Row
        style={{
          marginTop: '46px',
          justifyContent: 'center',
          zIndex: 3,
        }}
      >
        <Label
          size="16"
          weight="800"
          align="center"
          color="white"
          style={{ width: '324px' }}
        >
          Please change the network in your wallet or the app network to view
          the page
        </Label>
      </Row>
      <Row
        style={{
          marginTop: '25px',
          justifyContent: 'center',
          zIndex: 3,
        }}
      >
        <StyledIconButton
          block
          icon="arrow"
          variant="primary"
          style={{
            height: '38px',
            boxShadow: '0 18px 30px 0 rgba(50, 171, 125, 0.3)',
            width: '300px',
          }}
          onClick={handleNetworkClick}
        >
          {'Change App Network'}
        </StyledIconButton>
      </Row>

      <Spacer size="lg" />
    </CardContainer>
  )
}

const Background = styled.img`
  width: 100%;
  height: 220px;
  position: absolute;
  left: 0;
  z-index: -1;
`
export default NetworkWarning
