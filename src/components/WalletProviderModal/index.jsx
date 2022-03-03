import React, { useEffect, useContext } from 'react'

import { AccountContext } from 'contexts/AccountProvider'
import useWallet from 'hooks/useWallet'

import Modal from 'components/Modal'
import ModalContent from 'components/ModalContent'
import ModalTitle from 'components/ModalTitle'
import WalletCard from 'components/WalletProviderModal/components/WalletCard'

import metamaskLogo from 'assets/img/metamask-fox.svg'

const WalletProviderModal = ({ onDismiss }) => {
  const { loadAccount } = useContext(AccountContext)
  const { account, connect } = useWallet()

  useEffect(() => {
    if (account) {
      loadAccount()
      onDismiss()
    }
  }, [account, onDismiss, loadAccount])

  return (
    <Modal>
      <ModalTitle text="Wallet Provider" />

      <ModalContent>
        <WalletCard
          icon={
            <img src={metamaskLogo} style={{ height: 32 }} alt="metamask" />
          }
          onConnect={() => connect('injected')}
          onDismiss={onDismiss}
          title="Metamask"
        />
      </ModalContent>
    </Modal>
  )
}

export default WalletProviderModal
