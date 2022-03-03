import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Spinner from 'react-svg-spinner'
import MobileDetect from 'mobile-detect'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import useWallet from 'hooks/useWallet'
import { SUPPORTED_WALLETS, getCurrentChainId } from 'monox/constants'
import { StyledExternalLink } from 'theme'
import { saveWallet, savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'

import ModalTitle from 'components/ModalTitle'
import Modal from 'components/Modal'
import { Row } from 'components/Row'
import Label from 'components/Label'
import Input from 'components/Input'
import StyledIconButton from 'components/StyledIconButton'

export const WalletList = ({ onDismiss }) => {
  const { account, connect, chainId, connector: currentConnector } = useWallet()
  const [connector, setConnector] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleUnlockClick = async (connector, isMobile) => {
    if (
      (connector === 'walletlink' && chainId !== 1) ||
      connector === 'bitski'
    ) {
      return
    }

    setConnector(connector)
    setLoading(true)
    connect(connector)
  }

  useEffect(() => {
    if (account && connector) {
      setLoading(false)
      dispatch(saveWallet(connector))
      setConnector('')
      onDismiss()
    }
  }, [account, connector])

  const md = new MobileDetect(window.navigator.userAgent)
  const wallets = SUPPORTED_WALLETS
  if (md.mobile() && wallets) {
    delete wallets?.METAMASK
  }

  return Object.entries(wallets).map(([key, value]) => {
    return value.name !== 'Install MetaMask' ? (
      <WalletRow
        onClick={() => handleUnlockClick(value.connector, !!md.mobile())}
        key={key}
      >
        {currentConnector === value.connector && <ConnectedMark />}
        {loading && value.connector === connector ? (
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        ) : (
          <Image src={value.iconName} />
        )}
        <Label
          text={value.name}
          size="14"
          weight="800"
          style={{ paddingRight: 5 }}
        />
      </WalletRow>
    ) : (
      <WalletRow key={key}>
        <StyledExternalLink
          href={'https://metamask.io/'}
          target="__blank"
          style={{ justifyContent: 'flex-start' }}
        >
          <Image src={value.iconName} />
          <Label text={`${value.name}`} size="14" weight="800" />
        </StyledExternalLink>
      </WalletRow>
    )
  })
}

const WalletListModal = ({ onDismiss }) => {
  const dispatch = useDispatch()

  const NETWORK_URL = useSelector(({ network }) => network.NETWORK_URL)
  const [isTestWallet, setTestWallet] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')

  const handleConnect = useCallback(async () => {
    try {
      const provider = new PrivateKeyProvider(privateKey, NETWORK_URL)
      const chainId = await getCurrentChainId(provider)
      dispatch(savePrivateKey({ chainId: chainId, privateKey: privateKey }))
      dispatch(saveProvider(provider))
      onDismiss()
    } catch (err) {
      console.log(err)
      setError('Private Key Type Error')
      return
    }
  })

  return (
    <Modal>
      <ModalTitle text="Connect Wallet" height="auto" />
      {isTestWallet ? (
        <Fragment>
          <RowInput>
            <Input
              placeholder="Private Key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </RowInput>
          <Label text={error} size="14" color="red" />
        </Fragment>
      ) : (
        <Fragment>
          <WalletList onDismiss={onDismiss} />
          {process.env.REACT_APP_DEV_ENV === 'development' && (
            <TestWalletRow onClick={() => setTestWallet(true)}>
              <Label
                text="Test Wallet"
                size="16"
                color="#1F1F41"
                weight="600"
              />
            </TestWalletRow>
          )}
        </Fragment>
      )}

      {isTestWallet ? (
        <Fragment>
          <StyledIconButton
            variant="primary"
            icon="arrow"
            onClick={() => setTestWallet(false)}
            block
            style={{ marginTop: 40 }}
          >
            Back
          </StyledIconButton>
          <StyledIconButton
            variant="primary"
            icon="arrow"
            onClick={handleConnect}
            block
            style={{ marginTop: 40 }}
          >
            Connect
          </StyledIconButton>
        </Fragment>
      ) : (
        <StyledIconButton
          variant="primary"
          icon="arrow"
          onClick={onDismiss}
          block
          style={{ marginTop: 40 }}
        >
          Cancel
        </StyledIconButton>
      )}
    </Modal>
  )
}

export default WalletListModal

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 20px;
  height: 50px;
  width: 100%;
  margin: 10px 0;
  padding: 7px;
`

const WalletRow = styled(Row)`
  border-radius: 27px;
  height: 50px;
  margin-top: 35px;
  align-items: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.background.main};
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  div {
    :hover {
      color: ${({ theme }) => theme.color.primary.main};
    }
  }
`
const TestWalletRow = styled(Row)`
  border-radius: 27px;
  height: 50px;
  margin-top: 35px;
  align-items: center;
  padding-left: 20px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.background.main};
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  div {
    :hover {
      color: ${({ theme }) => theme.color.primary.main};
    }
  }
`
const SpinnerContainer = styled.div`
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 29px 0px 16px;
  height: 25px;
`

const Image = styled.img`
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 29px 0px 16px;
  height: 25px;
`

const ConnectedMark = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #27ae60;
  margin-left: 15px;
  margin-right: -14px;
`
