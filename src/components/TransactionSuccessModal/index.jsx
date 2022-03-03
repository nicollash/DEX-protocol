import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import useWallet from 'hooks/useWallet'
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask'
import { getEtherscanLink } from 'monox/util'

import { Row, RowCenter } from 'components/Row'
import { CloseIcon } from 'components/IconButton'
import Label from 'components/Label'
import StyledIconButton from 'components/StyledIconButton'
import Modal from 'components/Modal'
import Spacer from 'components/Spacer'

import txSubmit from 'assets/img/tx-submit.svg'

const TransactionSuccessModal = ({
  onDismiss,
  payload,
  redirectUrl,
  token,
}) => {
  const { chainId } = useWallet()
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const history = useHistory()
  const { addToken, success } = useAddTokenToMetamask(token)

  const handleDismiss = () => {
    if (redirectUrl) {
      history.push(`${redirectUrl}?network=${networkName}`)
    }
    onDismiss()
  }

  return (
    <Modal maxWidth>
      <Row>
        <CloseIcon onClick={handleDismiss} style={{ marginLeft: 'auto' }} />
      </Row>
      <RowCenter>
        <Image src={txSubmit} />
      </RowCenter>
      <RowCenter>
        <Label weight={800} size={18} text="Transaction Submitted" />
      </RowCenter>
      <Spacer />
      <Link
        href={getEtherscanLink(chainId, payload, 'transaction')}
        target="__blank"
      >
        {`View on ${chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'}`}
      </Link>
      <Spacer />
      {token?.address && token?.symbol && (
        <Row>
          <Link onClick={addToken} target="__blank">
            Add {token?.symbol} to Metamask
          </Link>
        </Row>
      )}
      <Spacer size="sm" />
      <Spacer />
      <StyledIconButton
        onClick={handleDismiss}
        variant="primary"
        icon="arrow"
        block
      >
        Close
      </StyledIconButton>
    </Modal>
  )
}

export default TransactionSuccessModal

const Image = styled.img`
  width: 142px;
  height: 172px;
  object-fit: contain;
  margin: 0 26px 10px;
`

const Link = styled.a`
  box-sizing: border-box;
  font-weight: 800;
  font-size: 14px;
  color: ${({ theme }) => theme.color.secondary.main};
  border-radius: 27px;
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  margin: auto;
  padding: 10px 22px;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`
