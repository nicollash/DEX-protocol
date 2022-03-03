import React from 'react'
import styled, { keyframes } from 'styled-components'
import { ArrowLeft } from '@styled-icons/bootstrap/ArrowLeft'

import ModalTitle from 'components/ModalTitle'
import { WalletList } from 'components/WalletListModal'

const ConnectWalletCard = ({ toggle, swapSelector = false }) => {
  return (
    <Div swapSelector={swapSelector}>
      <CardNav>
        <LeftArrow onClick={toggle} />
        <NavHeader>
          <ModalTitle text="Connect Wallet" height="auto" />
        </NavHeader>
      </CardNav>
      <WalletList onDismiss={toggle} />
    </Div>
  )
}

export default ConnectWalletCard

const walletConncetion = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`
const Div = styled.div`
  padding: 1rem;
  padding-top: 10px;
  border-radius: 39px;
  position: absolute;
  width: 315px;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px;
  background-color: ${({ theme }) => theme.color.background.main};
  transform-origin: 100% 0;
  animation: ${walletConncetion} 0.3s;
  height: 496px;
`
const CardNav = styled.div`
  display: flex;
  flex-direction: row;
  padding: 35px 0 25px 0;
`
const LeftArrow = styled(ArrowLeft)`
  height: 20px;
  width: 20px;
  color: #364273;
  cursor: pointer;
`
const NavHeader = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  width: 100%;
  align-items: center;
  color: rgb(125, 127, 157);
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  margin-right: 23px;
`
