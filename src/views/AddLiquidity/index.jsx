import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import useSearchToken from 'hooks/useSearchToken'
import useModal from 'hooks/useModal'
import usePoolList from 'hooks/usePoolList'
import useTokenBalance from 'hooks/useTokenBalance'

import { AccountContext } from 'contexts/AccountProvider'
import useApprove from 'hooks/useApprove'
import { ubetToEth, weiToEthNum } from 'monox/constants'

import CurrencySelector from 'views/Swapper/components/CurrencySelector'
import PositionCard from 'views/AddLiquidity/components/PositionCard'
import PoolBar from 'views/AddLiquidity/components/PoolBar'
import ConfirmSupplyModal from 'views/AddLiquidity/components/ConfirmSupplyModal'
import { BackRoute } from 'views/AddLiquidity/components/BackRoute'
import Card from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import Spacer from 'components/Spacer'
import WalletListModal from 'components/WalletListModal'
import ApproveTransferModal from 'components/ApproveTransferModal'
import Button from 'components/Button'
import CardContainer, { PoolContainer } from 'components/CardContainer'
import TipCard from 'components/TipCard'
import StyledIconButton from 'components/StyledIconButton'
import { StyledSettingIcon } from 'components/StyledIcon'
import TransactionSettingModal from 'components/TransactionSettingModal'
import { setAddLiquidityTolerance } from 'state/settings/action'
import { addTransaction } from 'state/transaction/actions'
import PriceInput from 'components/PriceInput'
import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'
import config from 'monox/config'

export default function AddLiquidity({
  match: {
    params: { currencyIdA },
  },
  history,
}) {
  const isCreate = history.location.pathname.includes('/create')
  const [currency, setCurrency] = useState(null)
  const [isDropdown, setsetIsDropdown] = useState(false)
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState(0)
  const [allowance, setAllowance] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const [deadline, setDeadline] = useState(20)
  const { poolList } = usePoolList()
  const { onGetToken } = useSearchToken()
  const { onApprove } = useApprove(() => setRequestedApproval(false))
  const { chainId, account } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const transactions = useSelector((state) => state.transactions)
  const { isUpdated } = useSelector((state) => state.application)

  const tolerance = useSelector(
    ({ settings }) => settings.addLiquidityTolerance
  )

  const dispatch = useDispatch()

  const toggleList = () => {
    handleCurrencySelector()
  }

  const [pool, setPool] = useState(0)
  const {
    poolsContract,
    swapContract,
    infuraContract,
    getAllowance,
  } = useContext(AccountContext)
  const { balance } = useTokenBalance(currency)

  useEffect(() => {
    if (
      currency?.symbol &&
      (currency.symbol !== currencyIdA || currency?.address !== currencyIdA)
    ) {
      history.push(
        `/add/${
          currency?.notInList ? currency?.address : currency?.symbol
        }?network=${networkName}`
      )
    }
  }, [currency, currencyIdA])

  const setToken = useCallback(async () => {
    const ts = await onGetToken(currencyIdA)
    if (ts && ts.length > 0) {
      setCurrency(ts[0])
    }
  }, [currencyIdA, onGetToken])

  useEffect(() => {
    if (
      (poolsContract || infuraContract) &&
      currencyIdA &&
      currencyIdA !== 'create' &&
      !isDropdown
    ) {
      setToken()
    }
  }, [poolsContract, infuraContract, currencyIdA, isDropdown])

  useEffect(() => {
    if (poolsContract && currency) {
      swapContract.methods
        .pools(currency.address || WRAPPED_MAIN_ADDRESS)
        .call()
        .then((res) => {
          setPool(res)
        })
        .catch((err) => {
          console.log(err)
          setPool(null)
        })
      currency?.address &&
        getAllowance(currency?.address, true).then((res) =>
          setAllowance(Number(res))
        )
    } else if (infuraContract && currency) {
      infuraContract.methods
        .pools(currency.address || WRAPPED_MAIN_ADDRESS)
        .call()
        .then((res) => {
          setPool(res)
        })
        .catch((err) => {
          console.log(err)
          setPool(null)
        })
    } else {
      setAllowance(null)
      setPool(null)
    }
  }, [currency, poolsContract, infuraContract, getAllowance])

  useEffect(() => {
    const getAllowanceCallback = async () => {
      const allowance = await getAllowance(currency && currency.address, true)
      setAllowance(Number(allowance))
    }
    if (transactions[chainId]) {
      const savedTx = transactions[chainId].find(
        (tx) => tx.type === ACTIONS.APPROVE && !tx?.isChecked
      )
      if (savedTx && savedTx.status === TRANSACTION_STATUS.SUCCESS) {
        getAllowanceCallback()
        setRequestedApproval(false)
        dispatch(
          addTransaction({
            ...savedTx,
            isChecked: true,
          })
        )
      }

      const AddingTxs = transactions[chainId].filter(
        (tx) => tx.type === ACTIONS.ADD
      )
      if (AddingTxs.length > 0) {
        const lastTx = AddingTxs[AddingTxs.length - 1]
        if (
          lastTx.status === 'SUCCESS' &&
          Date.now() - lastTx.confirmedTime < 50
        ) {
          setIsPending(false)
          history.push(`/pool?network=${networkName}`)
        } else if (lastTx.status === 'PENDING') {
          setIsPending(true)
        }
      }
    }
  }, [transactions, isUpdated, currency, chainId, getAllowance])

  const handleChangeAmount = (value) => {
    if (typeof value == 'number') {
      setAmount(value)
      return
    }
    if (!value || value?.match(/^\d{0,}(\.\d{0,10})?$/)) {
      if (value === '.') {
        setAmount(value)
      } else if (value && value.slice(-1) === '.') {
        setAmount(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        setAmount(value)
      }
    }
  }

  const handleChangePrice = (evt) => {
    const value = evt.target.value
    if (typeof value == 'number') {
      setPrice(value)
      return
    }
    if (!value || value?.match(/^\d{0,}(\.\d{0,10})?$/)) {
      if (value === '.') {
        setPrice(value)
      } else if (value && value.slice(-1) === '.') {
        setPrice(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        setPrice(value)
      }
    }
  }

  const isApproved = useMemo(() => {
    if (!currency?.address) return false
    const finalPrice = isCreate ? price : weiToEthNum(BigNumber(pool?.price))

    if (currencyIdA && isCreate) {
      const existedPoolIndex = poolList.findIndex(
        (pool) => pool.token === currency?.address
      )
      return allowance &&
        allowance > 0 &&
        weiToEthNum(balance, currency?.decimals) >= amount &&
        finalPrice > 0 &&
        pool.status === '0'
        ? false
        : true
    }

    return allowance &&
      allowance > 0 &&
      weiToEthNum(balance, currency?.decimals) >= amount &&
      finalPrice > 0
      ? false
      : true
  }, [allowance, currencyIdA, amount, balance, currency, poolList, price])

  const [onPresentWalletListModal] = useModal(<WalletListModal />)

  const [handleConfirmSupplyModal] = useModal(
    <ConfirmSupplyModal
      currency={currency}
      pool={pool}
      amount={amount}
      tolerance={tolerance}
    />
  )

  const setTolerance = (value) => {
    dispatch(setAddLiquidityTolerance(value))
  }

  const [handleSettingsModal] = useModal(
    <TransactionSettingModal
      tolerance={tolerance}
      setTolerance={setTolerance}
      setDeadline={setDeadline}
      initDeadline={deadline}
    />
  )

  const handleUnlockClick = useCallback(() => {
    onPresentWalletListModal()
  }, [onPresentWalletListModal])

  const handleApproveTransaction = useCallback(async () => {
    try {
      const tempTransactionTime = +new Date()
      const payload = {
        type: ACTIONS.APPROVE,
        status: TRANSACTION_STATUS.PENDING,
        startTime: tempTransactionTime,
        chainId,
        isChecked: false,
        tx: undefined,
      }
      setRequestedApproval(true)
      onApprove(currency && currency.address, payload)
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval, currency])

  const hanleAddLiquidity = async () => {
    if (
      (allowance && weiToEthNum(BigNumber(allowance)) > amount) ||
      (currency && !currency?.address)
    ) {
      handleConfirmSupplyModal()
    } else {
      handleApproveTransaction()
    }
  }

  const amountBig = new BigNumber(amount)
  const balanceConverted = ubetToEth(balance, currency?.decimals)

  const insufficientBalance = amountBig.isGreaterThan(balanceConverted)

  const [handleCurrencySelector] = useModal(
    <CurrencySelector
      setCurrency={setCurrency}
      setIsDropdown={setsetIsDropdown}
      selected={[currency]}
      isOnLiquidity={true}
    />
  )

  return (
    <PoolContainer>
      <BackRoute
        creating={isCreate}
        adding={true}
        settings={
          <StyledSettingIcon
            style={{ justifyContent: 'flex-end' }}
            onClick={handleSettingsModal}
          />
        }
      />
      <TipCard page={'add'} />
      <div
        style={{
          marginTop: '40px',
          position: 'relative',
        }}
      >
        <CardContainer top="0">
          <ColumnCenter>
            <Card>
              <>
                <PriceInput
                  text={'Input'}
                  amount={amount}
                  handleChangeAmount={handleChangeAmount}
                  currency={currency}
                  toggle={toggleList}
                  balance={account && balanceConverted}
                  showMax={account && balanceConverted == 0 ? false : true}
                />
                <Spacer />
                {currency && (
                  <PoolBar
                    isCreate={isCreate}
                    price={price}
                    onChangePrice={handleChangePrice}
                    currency={currency}
                    pool={pool}
                    amount={amount}
                  />
                )}
                {!account ? (
                  <Button
                    text={!currency ? 'Choose Token' : 'Connect Wallet'}
                    disabled={!currency ? true : false}
                    onClick={handleUnlockClick}
                  />
                ) : insufficientBalance ? (
                  <Button
                    text={`Insufficient ${currency?.symbol} balance`}
                    disabled
                    block
                    shadow
                  />
                ) : amount > 0 ? (
                  <AutoColumn>
                    {(!allowance || allowance === 0) && currency?.address && (
                      <>
                        <StyledIconButton
                          disabled={
                            !currency || requestedApproval ? true : false
                          }
                          onClick={handleApproveTransaction}
                          block
                          isPerforming={requestedApproval}
                          isConfirmSwap={true}
                          icon="arrow"
                          variant="primary"
                        >
                          {!currency
                            ? 'Invalid Token'
                            : requestedApproval
                            ? 'Waiting for Approval'
                            : `Approve ${currency.symbol}`}
                        </StyledIconButton>
                        <Spacer size="sm" />
                      </>
                    )}
                    {currency && (
                      <StyledIconButton
                        disabled={isApproved || isPending}
                        onClick={hanleAddLiquidity}
                        block
                        icon="arrow"
                        variant="primary"
                      >
                        Supply
                      </StyledIconButton>
                    )}
                  </AutoColumn>
                ) : (
                  <Button text={'Enter an amount'} disabled={!amount} />
                )}
              </>
            </Card>
          </ColumnCenter>
        </CardContainer>
      </div>
      {currencyIdA && currency && (
        <>
          <PositionCard currency={currency} pool={pool} />
        </>
      )}
    </PoolContainer>
  )
}
