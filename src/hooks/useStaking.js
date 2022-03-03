import React, { useState, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Bignumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import useSearchToken from 'hooks/useSearchToken'
import { AccountContext } from 'contexts/AccountProvider'
import { weiToEthNum, weiToEthString } from 'monox/constants'
import { ACTIONS, showToast, TRANSACTION_STATUS } from 'monox/util'
import { addTransaction } from 'state/transaction/actions'

import { TransactionStartToast } from 'components/ToastPopup'

const useStaking = () => {
  const dispatch = useDispatch()
  const STAKING_ADDRESS = useSelector(({ network }) => network.STAKING_ADDRESS)
  const networkId = useSelector(({ network }) => network.id)
  const wallet = useSelector(({ user }) => user.wallet)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [stakeContractData, setStakeContractData] = useState({})
  const { account, chainId } = useWallet()
  const poolsInfo = useSelector(
    ({ pools }) => pools[chainId || networkId] ?? []
  )
  const poolsLoading = useSelector(({ pools }) => pools.poolsLoading)

  const {
    stakeContract,
    swapContract,
    poolsContract,
    infuraContract,
    infuraPoolContract,
    infuraStakeContract,
  } = useContext(AccountContext)
  const { onGetToken } = useSearchToken()

  const getFullPoolList = useCallback(
    async (loading = true) => {
      if (poolsContract && stakeContract && !poolsLoading) {
        try {
          setLoading(loading)
          const poolLength = await stakeContract.methods.poolLength().call()
          const pools = []

          for (let i = 0; i < poolLength; i += 1) {
            const [
              stakePool,
              stakeUserInfo,
              totalAllocPoint,
            ] = await Promise.all([
              stakeContract.methods.poolInfo(i).call(),
              stakeContract.methods.userInfo(i, account).call(),
              stakeContract.methods.totalAllocPoint().call(),
            ])

            if (!stakePool?.bActive) continue
            const poolData = poolsInfo?.find(
              p => Number(stakePool.lpTokenId) === p.pid
            )
            if (!poolData?.status) continue
            const [tokenData, isApproved] = await Promise.all([
              onGetToken(poolData?.token),
              poolsContract.methods
                .isApprovedForAll(account, STAKING_ADDRESS)
                .call(),
            ])

            const balance = await poolsContract.methods
              .balanceOf(account, poolData.pid)
              .call()
            pools.push({
              ...stakePool,
              ...poolData,
              ...tokenData[0],
              ...stakeUserInfo,
              totalAllocPoint,
              balance,
              allowance: isApproved,
              stakePoolId: i,
            })
          }
          setData(pools)
          setLoading(false)
        } catch (err) {
          console.log('get full poollist error: ', err)
          setLoading(false)
        }
      } else if (!wallet) {
        try {
          setLoading(loading)
          const poolLength = await Promise.all([
            infuraStakeContract.methods.poolLength().call(),
          ])
          const pools = []

          for (let i = 0; i < poolLength; i += 1) {
            const stakePool = await infuraStakeContract.methods
              .poolInfo(i)
              .call()
            if (!stakePool?.bActive) continue
            const poolData = poolsInfo?.find(
              p => Number(stakePool.lpTokenId) === p.pid
            )
            if (!poolData?.status) continue
            const tokenData = await onGetToken(poolData?.token)
            pools.push({
              ...stakePool,
              ...poolData,
              ...tokenData[0],
              allowance: false,
              stakePoolId: i,
            })
          }
          setData(pools)
          setLoading(false)
        } catch (err) {
          console.log('get full poollist error: ', err)
          setLoading(false)
        }
      }
    },
    [
      account,
      chainId || networkId,
      infuraStakeContract,
      infuraContract,
      onGetToken,
      poolsContract,
      stakeContract,
      poolsInfo,
      poolsLoading,
    ]
  )

  const getStakeData = useCallback(async () => {
    let contract = stakeContract ? stakeContract : infuraStakeContract

    if (swapContract && contract && !poolsLoading) {
      try {
        setLoading(true)

        const [monoToken, currentPeriod, config] = await Promise.all([
          contract.methods.mono().call(),
          contract.methods.currentPeriod().call(),
          contract.methods.config().call(),
        ])
        const {
          _blockPerPeriod: blockPerPeriod,
          _decay: decay,
          _monoPerPeriod: monoPerPeriod,
        } = config
        const [monoPool, ratiosData] = await Promise.all([
          swapContract.methods.pools(monoToken).call(),
          contract.methods.ratios(currentPeriod).call(),
        ])
        const monoPrice = weiToEthNum(new Bignumber(monoPool?.price))
        const ratios = weiToEthNum(new Bignumber(ratiosData), 12)
        setStakeContractData({
          monoPrice,
          currentPeriod,
          monoPerPeriod: weiToEthNum(new Bignumber(monoPerPeriod)),
          ratios,
          decay: weiToEthNum(new Bignumber(decay), 12),
          blockPerPeriod,
          monoToken,
          periodsPerDay: 1,
        })
        setLoading(false)
      } catch (err) {
        console.log('get full poollist error: ', err)
        setLoading(false)
      }
    }
  }, [infuraStakeContract, stakeContract, poolsInfo, poolsLoading])

  const calculateBalance = async pid => {
    try {
      const balance = await poolsContract.methods.balanceOf(account, pid).call()
      return balance
    } catch (err) {
      console.log('calculatebalance: ', err)
      return 0
    }
  }

  const calculateTotalSupply = async pid => {
    try {
      if (poolsContract) {
        const totalSupply = await poolsContract.methods.totalSupply(pid).call()
        return totalSupply
      } else if (infuraContract) {
        const totalSupply = await infuraPoolContract.methods
          .totalSupply(pid)
          .call()
        return totalSupply
      }
    } catch (err) {
      console.log('calculateTotalSupply: ', err)
      return 0
    }
  }

  const calculateBalanceData = async (token, amount) => {
    let balanceData = {
      poolValue: 0,
      vusdOut: 0,
      tokenOut: 0,
    }
    try {
      if (weiToEthNum(Bignumber(amount)) > 0) {
        balanceData = await swapContract.methods
          ._removeLiquidity(token, amount, account)
          .call()
      }
    } catch (err) {
      console.log('calculateBalanceData: ', err)
    }
    return balanceData
  }

  const depositPool = async (poolData, amount, payload, balance = '') => {
    try {
      const isMaxClicked =
        parseFloat(amount) >= parseFloat(weiToEthString(Bignumber(balance)))
      const amountBigNum = Bignumber(10 ** 18)
        .times(Bignumber(amount))
        .toFixed(0)
      const amountToSend = isMaxClicked ? balance : amountBigNum
      return stakeContract.methods
        .deposit(poolData.stakePoolId, amountToSend)
        .send({ from: account })
        .on('transactionHash', function (tx) {
          showToast(<TransactionStartToast staking={true} />, {
            autoClose: false,
            id: poolData?.token,
          })
          dispatch(
            addTransaction({
              ...payload,
              status: TRANSACTION_STATUS.PENDING,
              tx,
            })
          )
          return tx
        })
        .on('error', function (error) {
          console.log('error: ', error)
          dispatch(
            addTransaction({
              ...payload,
              status: TRANSACTION_STATUS.FAIL,
            })
          )
        })
    } catch (err) {
      console.log('error: ', err)
      dispatch(
        addTransaction({
          ...payload,
          status: TRANSACTION_STATUS.FAIL,
        })
      )
      return false
    }
  }

  const withdrawPool = async (poolData, amount, payload, balance = '') => {
    try {
      const isMaxClicked =
        parseFloat(amount) >= parseFloat(weiToEthString(Bignumber(balance)))
      const amountBigNum = Bignumber(10 ** 18)
        .times(Bignumber(amount))
        .toFixed(0)
      const amountToSend = isMaxClicked ? balance : amountBigNum
      return stakeContract.methods
        .withdraw(poolData.stakePoolId, amountToSend)
        .send({ from: account })
        .on('transactionHash', function (tx) {
          showToast(<TransactionStartToast staking={true} />, {
            autoClose: false,
            id: poolData?.token,
          })
          dispatch(
            addTransaction({
              ...payload,
              status: TRANSACTION_STATUS.PENDING,
              tx,
            })
          )
          return tx
        })
        .on('error', function (error) {
          console.log('error: ', error)
          dispatch(
            addTransaction({
              ...payload,
              status: TRANSACTION_STATUS.FAIL,
            })
          )
        })
    } catch (err) {
      console.log('error: ', err)
      dispatch(
        addTransaction({
          ...payload,
          status: TRANSACTION_STATUS.FAIL,
        })
      )
      return false
    }
  }

  const approveStake = useCallback(
    async symbol => {
      try {
        let payload = {
          type: ACTIONS.APPROVE,
          status: TRANSACTION_STATUS.PENDING,
          symbol,
          startTime: +new Date(),
          chainId,
          isChecked: false,
          tx: undefined,
        }
        const tx = await poolsContract.methods
          .setApprovalForAll(STAKING_ADDRESS, true)
          .send({ from: account })
          .on('transactionHash', function (tx) {
            payload.tx = tx
            dispatch(addTransaction(payload))
            return tx
          })
        return tx
      } catch (err) {
        return false
      }
    },
    [poolsContract, account, onGetToken]
  )

  const getEarnings = useCallback(
    async pid => {
      if (stakeContract) {
        try {
          const tx = await stakeContract.methods
            .pendingMono(pid, account)
            .call()
          return tx
        } catch (err) {
          console.log('error: ', err)
          return false
        }
      } else {
        return false
      }
    },
    [stakeContract, account]
  )

  const havestRewards = useCallback(
    async (pid, payload) => {
      if (stakeContract) {
        try {
          const tx = await stakeContract.methods
            .deposit(pid, 0)
            .send({ from: account })
            .on('transactionHash', function (tx) {
              showToast(<TransactionStartToast />, {
                autoClose: false,
                id: pid,
              })
              dispatch(
                addTransaction({
                  ...payload,
                  status: TRANSACTION_STATUS.PENDING,
                  tx,
                })
              )
            })
            .on('receipt', function (data) {
              dispatch(
                addTransaction({
                  ...payload,
                  status: TRANSACTION_STATUS.SUCCESS,
                  tx: data.transactionHash,
                })
              )
            })
            .on('error', function (error) {
              console.log('error: ', error)
              dispatch(
                addTransaction({
                  ...payload,
                  status: TRANSACTION_STATUS.FAIL,
                })
              )
            })
          return tx
        } catch (err) {
          console.log('havest err: ', err)
          dispatch(
            addTransaction({
              ...payload,
              status: TRANSACTION_STATUS.FAIL,
            })
          )
          return false
        }
      } else {
        return false
      }
    },
    [stakeContract, account]
  )

  return {
    data,
    stakeContractData,
    depositPool,
    withdrawPool,
    approveStake,
    getFullPoolList,
    getStakeData,
    calculateBalance,
    calculateTotalSupply,
    calculateBalanceData,
    getEarnings,
    havestRewards,
    loading,
  }
}

export default useStaking
