import React, { useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import useModal from 'hooks/useModal'
import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'
import { addTransaction } from 'state/transaction/actions'
import { precise, showToast, TRANSACTION_STATUS } from 'monox/util'

import { RowBetween, RowInput } from 'components/Row'
import Input from 'components/Input'
import { CloseIcon } from 'components/IconButton'
import Modal from 'components/Modal'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'
import { TransactionStartToast } from 'components/ToastPopup'
import Spacer from 'components/Spacer'
import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import Divider from 'components/Divider'
import StyledIconButton from 'components/StyledIconButton'

const ConfirmSignatureRequestModal = ({
  onDismiss,
  amount,
  willRecieveToken,
  willRecieveLPToken,
  currency,
  price,
  maxClicked,
  lPAmount,
  redirectUrl,
}) => {
  const [isRemoving, setRemoving] = useState(false)
  const { account, chainId } = useWallet()

  const dispatch = useDispatch()
  const { swapContract } = useContext(AccountContext)

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal redirectUrl={redirectUrl} />,
    'success'
  )

  const [handleTransferReject] = useModal(
    <TransactionRejectModal message={`Remove ${amount} ${currency?.symbol}`} />
  )

  const handleRemoveConfirmed = async () => {
    const payload = {
      fromCurrency: currency,
      fromAmount: willRecieveToken,
      type: 'REMOVE',
      status: TRANSACTION_STATUS.PENDING,
      startTime: +new Date(),
      chainId,
    }
    try {
      setRemoving(true)
      const amountBigNum = BigNumber(10 ** 18)
        .times(BigNumber(amount))
        .toFixed(0)
      const amountSend = maxClicked ? lPAmount : amountBigNum
      if (currency && !currency?.address) {
        await swapContract.methods
          .removeLiquidityETH(amountSend, account, 0, 0)
          .send({ from: account })
          .on('transactionHash', function (tx) {
            payload.tx = tx
            dispatch(addTransaction(payload))
            showToast(<TransactionStartToast />, {
              autoClose: false,
            })
            handleTransferSubmit(tx)
            return tx
          })
      } else {
        await swapContract.methods
          .removeLiquidity(currency?.address, amountSend, account, 0, 0)
          .send({ from: account })
          .on('transactionHash', function (tx) {
            payload.tx = tx
            dispatch(addTransaction(payload))
            showToast(<TransactionStartToast />, {
              autoClose: false,
            })
            handleTransferSubmit(tx)
            return tx
          })
      }

      setRemoving(false)
    } catch (e) {
      handleTransferReject()
      console.log(e)
    }
  }

  return (
    <Modal>
      <RowBetween>
        <Label text="You will receive" weight={800} />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <Spacer size="md" />
      <RowInput style={{ marginRight: '0px' }}>
        <Input
          size="sm"
          value={precise(willRecieveToken, 6)}
          disabled
          style={{ textAlign: 'left' }}
        />
        <Label weight={800} size={13} style={{ marginRight: '11px' }}>
          {currency && currency.symbol}
        </Label>
        <TokenImage
          src={currency?.logoURI}
          height="25"
          width="28"
          letter={currency?.symbol && currency?.symbol[0]}
          style={{ marginRight: '0px' }}
        />
      </RowInput>
      <Spacer size="md" />
      <Divider />
      {willRecieveLPToken !== 0 && (
        <>
          <Row>
            <Text opacity={0.5}>vUSD Amount</Text>
            <Text>{precise(willRecieveLPToken, 6)} vUSD</Text>
          </Row>
          <Divider />
        </>
      )}
      <Row>
        <Text opacity={0.5}>{currency && currency.symbol} LP Burned</Text>
        <Text>{precise(amount, 6)}</Text>
      </Row>
      <Divider />
      <Row>
        <Text opacity={0.5}>Rates</Text>
        <Text>
          1 {currency && currency.symbol} =&nbsp;
          {precise(price, 4)} USD
        </Text>
      </Row>
      <Divider />
      <Spacer />
      <StyledIconButton
        block
        disabled={isRemoving}
        icon="arrow"
        variant="primary"
        isPerforming={isRemoving}
        isConfirmSwap={true}
        onClick={handleRemoveConfirmed}
      >
        {isRemoving ? 'Waiting for Confirmation' : 'Confirm Supply'}
      </StyledIconButton>
    </Modal>
  )
}

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`

const Text = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  opacity: ${(props) => props.opacity ?? 1};
`

export default ConfirmSignatureRequestModal
