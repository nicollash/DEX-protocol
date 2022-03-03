import { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'
import { addTransaction } from 'state/transaction/actions'
import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'
import config from 'monox/config'

const useRemovablePool = (ERC20TokenAddress) => {
  const dispatch = useDispatch()
  const [isApproved, setIsApproved] = useState(false)
  const { poolsContract, swapContract, getToken } = useContext(AccountContext)
  const { account, chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const SWAP_ADDRESS = useSelector(({ network }) => network.SWAP_ADDRESS)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const onCheckApproval = async () => {
    try {
      if (poolsContract) {
        const approveResult = await poolsContract.methods
          .isApprovedForAll(account, SWAP_ADDRESS)
          .call()
        setIsApproved(approveResult)
      }
    } catch (err) {
      console.log('onCheckApproval error: ', err)
    }
  }

  const onApprove = async () => {
    const ERC20Token = await getToken(ERC20TokenAddress)
    const searchedTokenSymbol = await ERC20Token.methods.symbol().call()
    try {
      let payload = {
        type: ACTIONS.APPROVE,
        status: TRANSACTION_STATUS.PENDING,
        symbol: searchedTokenSymbol,
        startTime: +new Date(),
        chainId,
        isChecked: false,
        tx: undefined,
      }
      await poolsContract.methods
        .setApprovalForAll(SWAP_ADDRESS, true)
        .send({ from: account })
        .on('transactionHash', function (tx) {
          payload.tx = tx
          dispatch(addTransaction(payload))
          return tx
        })
      setIsApproved(true)
      return true
    } catch (err) {
      return false
    }
  }

  const onGetRemoveResult = async (ERC20Token, amount) => {
    try {
      const amountBigNum = BigNumber(10 ** ERC20Token?.decimals)
        .times(BigNumber(amount))
        .toFixed(0)
      const result = await swapContract.methods
        ._removeLiquidity(
          ERC20Token?.address || (!!ERC20TokenAddress && WRAPPED_MAIN_ADDRESS),
          amountBigNum,
          account
        )
        .call()
      return result
    } catch (err) {
      return false
    }
  }

  useEffect(() => {
    if ((poolsContract, ERC20TokenAddress)) {
      if (ERC20TokenAddress === 'ETH' || ERC20TokenAddress === 'Matic') {
        setIsApproved(true)
      } else {
        onCheckApproval()
      }
    }
  }, [ERC20TokenAddress, poolsContract])

  return { onApprove, isApproved, onGetRemoveResult }
}

export default useRemovablePool
