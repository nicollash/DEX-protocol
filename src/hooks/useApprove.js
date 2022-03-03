import { useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'
import { addTransaction } from 'state/transaction/actions'
import { TRANSACTION_STATUS } from 'monox/util'

const useApprove = (onFinishTransaction) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { getToken } = useContext(AccountContext)
  const SWAP_ADDRESS = useSelector(({ network }) => network.SWAP_ADDRESS)
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address

  const handleApprove = useCallback(
    async (ERC20TokenAddress, payload) => {
      try {
        ERC20TokenAddress = ERC20TokenAddress || VUSD_ADDRESS
        const ERC20Token = await getToken(ERC20TokenAddress)
        const searchedTokenSymbol = await ERC20Token.methods.symbol().call()
        const updatedPayload = {
          ...payload,
          symbol: searchedTokenSymbol,
        }
        const tx = await ERC20Token.methods
          .approve(SWAP_ADDRESS, ethers.constants.MaxUint256.toString())
          .send({ from: account })
          .on('transactionHash', function (tx) {
            updatedPayload.tx = tx
            dispatch(addTransaction(updatedPayload))
            return tx
          })
          .on('receipt', function (data) {
            dispatch(
              addTransaction({
                ...updatedPayload,
                status: TRANSACTION_STATUS.SUCCESS,
                tx: data.transactionHash,
              })
            )
          })
        onFinishTransaction()
        return tx
      } catch (e) {
        onFinishTransaction()
        console.log('error: ', e)
        return false
      }
    },
    [getToken, account]
  )

  return { onApprove: handleApprove }
}

export default useApprove
