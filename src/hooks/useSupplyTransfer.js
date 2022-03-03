import { useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'

const useSupplyTransfer = () => {
  const { account } = useWallet()
  const { getToken } = useContext(AccountContext)
  const SWAP_ADDRESS = useSelector(({ network }) => network.SWAP_ADDRESS)
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address

  const handleTransferSupply = useCallback(async (ERC20TokenAddress) => {
    try {
      ERC20TokenAddress = ERC20TokenAddress || VUSD_ADDRESS
      const ERC20Token = await getToken(ERC20TokenAddress)
      const tx = await ERC20Token.methods
        .transfer(SWAP_ADDRESS, ethers.constants.MaxUint256.toString())
        .send({ from: account })

      return tx
    } catch (e) {
      console.log('error: ', e)
      return false
    }
  }, [])

  return { onTransfer: handleTransferSupply }
}

export default useSupplyTransfer
