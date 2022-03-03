import React from 'react'
import styled from 'styled-components'
import { Cross } from '@styled-icons/entypo/Cross'

import Modal from 'components/Modal'
import Label from 'components/Label'
import { Row } from 'components/Row'
import AlertTriangle from 'assets/img/alert-triangle.svg'
import StyledIconButton from 'components/StyledIconButton'

const TransactionRejectModal = ({ onDismiss, payload, message }) => {
  return (
    <Modal maxWidth>
      <Row>
        <Label text="Error" size="16" weight="800" />
        <CrossIcon onClick={onDismiss} />
      </Row>
      <Error>
        <Label
          text="Transaction rejected."
          size="16"
          weight="800"
          color="#ef3d62"
        />
        <Label text={message} size="13" weight="bold" color="#ef3d62" />
        <img
          src={AlertTriangle}
          style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-10px',
          }}
        />
      </Error>
      <StyledIconButton
        fontColor="secondary"
        icon="arrow"
        block
        variant="secondary"
        style={{
          height: 42,
          boxShadow: '0 12px 20px 0 rgba(207, 53, 85, 0.3)',
        }}
        onClick={onDismiss}
      >
        Dismiss
      </StyledIconButton>
    </Modal>
  )
}

export default TransactionRejectModal

const CrossIcon = styled(Cross)`
  height: 20px;
  float: right;
  cursor: pointer;
  margin-left: auto;
`

const Error = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 25px;
  margin-bottom: 40px;
  border-left: 5px solid ${({ theme }) => theme.color.font.error};
  border-radius: 6px;
  background-color: #f4ebf0;
  min-height: 89px;
  display: flex;
  position: relative;
  overflow: hidden;
  margin-top: 30px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: auto;
  padding:.5rem 15px;
   `}
`
