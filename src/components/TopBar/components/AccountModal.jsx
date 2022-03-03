import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Spinner from 'react-svg-spinner'
import ReactTooltip from 'react-tooltip'
import Web3 from 'web3'

import { StyledExternalLink } from 'theme'
import { clearTransactions } from 'state/transaction/actions'
import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'
import useModal from 'hooks/useModal'
import useWallet from 'hooks/useWallet'

import { Check2 } from '@styled-icons/bootstrap/Check2'
import { ExternalLink } from '@styled-icons/evil/ExternalLink'
import { CopyOutline } from '@styled-icons/evaicons-outline/CopyOutline'

import Label from 'components/Label'
import Modal from 'components/Modal'
import WalletListModal from 'components/WalletListModal'
import Divider from 'components/Divider'
import { RowBetween, RowFixed, Row, RowCenter } from 'components/Row'
import { CloseIcon } from 'components/IconButton'

import {
  getEtherscanLink,
  ACTIONS,
  precise,
  TRANSACTION_STATUS,
} from 'monox/util'

const AccountModal = ({ onDismiss }) => {
  const { account, disconnect } = useWallet()
  const WSS_URL = useSelector(({ network }) => network.WSS_URL)
  const chainId = useSelector(({ network }) => network.id)
  const [handleUnlockClick] = useModal(<WalletListModal />)
  const dispatch = useDispatch()
  const transactionsData = useSelector(({ transactions }) => transactions)
  const privateKey = useSelector(({ user }) => user.privateKey)
  const transactions = transactionsData[chainId] ?? []

  const confirmedTransactions = useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.status === TRANSACTION_STATUS.SUCCESS ||
        tx.status === TRANSACTION_STATUS.PENDING
    )
  }, [transactions])

  const sortedTransactions = useMemo(() => {
    return confirmedTransactions.sort(
      (a, b) => b.confirmedTime - a.confirmedTime
    )
  }, [confirmedTransactions])

  const handleClearTransactions = () => {
    dispatch(clearTransactions({ chainId: chainId }))
  }

  const handleDisconnect = () => {
    if (!privateKey) disconnect()
    else {
      const new_provider = new Web3.providers.WebsocketProvider(WSS_URL)
      dispatch(savePrivateKey({ chainId: chainId, privateKey: undefined }))
      dispatch(saveProvider(new_provider))
    }
    onDismiss()
  }

  return (
    <Modal width="450">
      <RowBetween style={{ alignItems: 'center' }}>
        <RowFixed>
          <Label text="My Account" size="16px" weight="800" />
        </RowFixed>
        <RowFixed style={{ alignItems: 'center' }}>
          <RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowFixed>
        </RowFixed>
      </RowBetween>
      <Row
        style={{
          marginTop: '41px',
          justifyContent: 'center',
          alignItems: 'baseline',
        }}
      >
        <Label
          size="32"
          align="center"
          text={`${account?.slice(0, 6)}...${account?.slice(-4)}`}
        />
        <CopyIcon
          data-tip="copied"
          data-event="click"
          data-event-off="click"
          data-iscapture="true"
          onClick={() => navigator?.clipboard?.writeText(account)}
        />
        <ReactTooltip delayHide={1000} />
      </Row>
      {!privateKey && (
        <Label
          size="13"
          weight="800"
          align="center"
          text="Connected with MetaMask"
          opacity="0.3"
          style={{ marginBottom: '20px' }}
        />
      )}
      <RowCenter>
        <Link
          href={getEtherscanLink(chainId, account)}
          target="__blank"
          className="ripple"
        >
          {`View on ${
            chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'
          }`}
        </Link>
      </RowCenter>

      <RowBetween style={{ margin: '53px 0 14px 0', alignItems: 'center' }}>
        <RowFixed>
          <Label size="16" weight="800" text="Recent Transactions" />
        </RowFixed>
        {sortedTransactions.length > 0 ? (
          <RowFixed>
            <Label
              size="12"
              weight="800"
              text="Clear All"
              primary
              pointer
              onClick={handleClearTransactions}
            />
          </RowFixed>
        ) : null}
      </RowBetween>
      <Divider />
      <TransactionsContainer>
        {sortedTransactions.map((t, i) => {
          let message
          switch (t?.type) {
            case 'SWAP':
              message = `${ACTIONS[t?.type]} ${precise(t?.fromAmount, 6)} ${
                t?.fromCurrency?.symbol ?? t.fromCurrency
              } for ${t?.toAmount} ${t?.toCurrency?.symbol ?? t?.toCurrency}`
              break
            case 'STAKE':
            case 'UNSTAKE':
              message = `${ACTIONS[t?.type]} ${precise(t?.amount, 6)} ${
                t?.token?.symbol
              }`
              break
            case 'WRAP':
              message = `${ACTIONS[t?.type]} ${precise(t?.toAmount, 6)} ${
                t?.fromCurrency == 'MATIC' && t?.toCurrency == 'WMATIC'
                  ? 'MATIC to WMATIC'
                  : 'ETH to WETH'
              }`
              break
            case 'HARVEST':
              message = `${ACTIONS[t?.type]} ${precise(t?.amount, 6)} MONO`
              break
            case 'UNWRAP':
              message = `${ACTIONS[t?.type]} ${precise(t?.toAmount, 6)} ${
                t?.fromCurrency == 'WMATIC' && t?.toCurrency == 'MATIC'
                  ? 'WMATIC to MATIC'
                  : 'ETH to WETH'
              }`
              break
            case 'APPROVE':
              message = `${ACTIONS[t?.type]} ${t?.symbol ? t?.symbol : ''}`
              break
            default:
              message = `${ACTIONS[t?.type]} ${precise(t?.fromAmount, 6)} ${
                t?.fromCurrency?.symbol
              }`
          }
          return (
            <React.Fragment key={i}>
              <RowBetween style={{ margin: '13px 0', paddingRight: '8px' }}>
                <RowFixed>
                  <StyledExternalLink
                    href={getEtherscanLink(
                      chainId,
                      t?.tx?.transactionHash ?? t?.tx,
                      'transaction'
                    )}
                    target="__blank"
                  >
                    <Label
                      text={message}
                      size="13"
                      weight="800"
                      opacity={
                        t?.status !== TRANSACTION_STATUS.SUCCESS
                          ? 0.5
                          : undefined
                      }
                      primary={t?.status === TRANSACTION_STATUS.SUCCESS}
                    />
                    <ExternalLink size="20" />
                  </StyledExternalLink>
                </RowFixed>
                <RowFixed>
                  {t?.status === TRANSACTION_STATUS.SUCCESS ? (
                    <CheckMark />
                  ) : (
                    <Spinner size="20px" color="fuchsia" />
                  )}
                </RowFixed>
              </RowBetween>
              <Divider />
            </React.Fragment>
          )
        })}
      </TransactionsContainer>
      <RowBetween style={{ alignItems: 'center', marginTop: '10px' }}>
        <CustomButton onClick={handleUnlockClick}>Change</CustomButton>
        <CustomButton secondary onClick={handleDisconnect}>
          Disconnect
        </CustomButton>
      </RowBetween>
    </Modal>
  )
}

const CheckMark = styled(Check2)`
  height: 20px;
  width: 20px;
  color: ${({ theme }) => theme.color.primary.main};
`
const CopyIcon = styled(CopyOutline)`
  width: 20px;
  margin-left: 8px;
  opacity: 0.5;
  color: ${({ theme }) => theme.color.secondary.main};
  cursor: pointer;
`

const CustomButton = styled.div`
  color: ${(props) =>
    props.secondary ? '#ef466a' : props.theme.color.primary.main};
  border-radius: 8px;
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  background-color: ${({ theme }) => theme.color.background.main};
  font-size: 13px;
  padding: 6px 12px;
  font-weight: 800;
  cursor: pointer;
  width: 40%;
  text-align: center;
`
const Link = styled.a`
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
    color: ${({ theme }) => theme.color.primary.main};
  }
`

const TransactionsContainer = styled.div`
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(33, 45, 99, 0.12);
    border-radius: 10px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      max-height: 100px;
  `}
`

export default AccountModal
