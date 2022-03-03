import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useHistory, useParams } from 'react-router-dom'

import useWallet from 'hooks/useWallet'
import useModal from 'hooks/useModal'
import useSearchToken from 'hooks/useSearchToken'
import useSwapToken from 'hooks/useSwapToken'
import useTokenBalance from 'hooks/useTokenBalance'
import usePool from 'hooks/usePool'
import useContributedPoolList from 'hooks/useContributedPoolList'
import { addTransaction } from 'state/transaction/actions'
import useApprove from 'hooks/useApprove'

import { AccountContext } from 'contexts/AccountProvider'
import SwapWidget from 'views/Swapper/components/SwapWidget'
import CurrencySelector from 'views/Swapper/components/CurrencySelector'
import StartTrading from 'views/Swapper/components/StartTrading'
import { ubetToEth, weiToEthNum } from 'monox/constants'
import {
  precise,
  poolValue,
  showToast,
  TRANSACTION_STATUS,
  ACTIONS,
} from 'monox/util'
import config from 'monox/config'
import { setSwapTolerance } from 'state/settings/action'
import { updateSwapTransaction } from 'state/swap/actions'

import WalletListModal from 'components/WalletListModal'
import ImportTokenModal from 'components/ImportTokenModal'
import ConfirmOrderModal from 'components/ConfirmOrderModal'
import Spacer from 'components/Spacer'
import StyledIconButton from 'components/StyledIconButton'
import { StyledSwapIcon, StyledSettingIcon } from 'components/StyledIcon'
import PriceInput from 'components/PriceInput'
import TransactionSettingModal from 'components/TransactionSettingModal'

import Warning from 'assets/img/alert-warning.svg'
import Spinner from 'react-svg-spinner'

const SwapperCard = ({
  toCurrency,
  setToCurrency,
  fromCurrency,
  setFromCurrency,
  isDropdown,
  setIsDropdown,
  isSwapped,
  setIsSwapped,
  fromPoolData,
  toPoolData,
  loading,
  initialFetch,
}) => {
  const { account, chainId } = useWallet()
  const wallet = useSelector(({ user }) => user.wallet)
  const networkId = useSelector(({ network }) => network.id)
  const MAIN_CURRENCY = config[networkId || chainId].MAIN_CURRENCY
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const VUSD_ADDRESS = config[networkId || chainId].vUSD?.address
  const { pool } = usePool(
    fromCurrency?.address || (!!fromCurrency?.symbol && WRAPPED_MAIN_ADDRESS)
  )

  const {
    poolList: contributedPoolList,
    loading: contributedPoolListLoading,
  } = useContributedPoolList(initialFetch)

  const { getAllowance, swapContract: contract, infuraContract } = useContext(
    AccountContext
  )

  const { onGetToken } = useSearchToken()
  const dispatch = useDispatch()
  const { onGetAmountIn, onGetAmountOut } = useSwapToken()
  const tolerance = useSelector(({ settings }) => settings.swapTolerance)
  const { address1, address2 } = useParams()

  const history = useHistory()
  const transactions = useSelector((state) => state.transactions)
  const { isUpdated } = useSelector((state) => state.application)
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const { onApprove } = useApprove(() => setApproving(false))

  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [exactAmount, setExactAmount] = useState(false)
  const [deadline, setDeadline] = useState(20)
  const [isSwitching, setSwitching] = useState(false)
  const [contractError, setContractError] = useState(false)
  const [liquidityError, setLiquidityError] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [scError, setSCError] = useState(false)
  const [allowance, setAllowance] = useState(null)
  const [isApproving, setApproving] = useState(false)

  const swapContract = account ? contract : infuraContract
  const {
    balance: fromBalance,
    fetchBalance: fetchFromBalance,
  } = useTokenBalance(fromCurrency)

  const { balance: toBalance, fetchBalance: fetchToBalance } = useTokenBalance(
    toCurrency
  )

  useEffect(() => {
    !fromAmount && setContractError(false)
  }, [fromAmount])

  useEffect(() => {
    setContractError(false)
  }, [fromCurrency])

  const close = () => {
    setIsDropdown(false)
  }

  const [handleImportTokenModal] = useModal(<ImportTokenModal />)

  const setToken1 = useCallback(async () => {
    let address = address1
    let flag = false
    if (
      address1?.toLowerCase() === 'eth' ||
      address1?.toLowerCase() === 'matic'
    ) {
      address = MAIN_CURRENCY?.symbol
      flag = true
    } else if (
      address1?.toLowerCase() === 'weth' ||
      address1?.toLowerCase() === 'wmatic'
    ) {
      address = `W${MAIN_CURRENCY?.symbol}`
      flag = true
    }
    const tokens = await onGetToken(address, flag)
    const ts =
      tokens.filter(
        (token) =>
          (chainId && token?.chainId === chainId) ||
          (!chainId && token?.chainId === networkId)
      ) || []
    if ((ts && ts.length === 1) || address === MAIN_CURRENCY?.symbol) {
      const pool = ts[0]?.address
        ? await swapContract.methods.pools(ts[0]?.address).call()
        : null
      if (
        (pool && pool.status !== '0') ||
        ts[0].address === VUSD_ADDRESS ||
        !ts[0]?.address
      ) {
        const fromHomePage = history.location?.state?.fromHomePage
        const fromExplorePage = history.location?.state?.fromExplorePage
        const setAsReceiving = history.location?.state?.setAsReceiving

        const fromContributedList = contributedPoolList.find(
          (token) => token.token === ts[0].address
        )

        if (
          ts[0]?.notInList &&
          ts[0]?.showWarning &&
          contributedPoolList?.length > 0 &&
          !fromContributedList
        ) {
          let setCurrency
          if (fromHomePage || fromExplorePage || setAsReceiving) {
            setCurrency = setToCurrency
          } else {
            setCurrency = setFromCurrency
          }
          handleImportTokenModal({ currrency: ts[0], close, setCurrency })
          return
        }
        if (fromHomePage || fromExplorePage || setAsReceiving) {
          !contributedPoolListLoading && setToCurrency(ts[0])
        } else {
          !contributedPoolListLoading && setFromCurrency(ts[0])
        }
      } else {
        history.push(
          `/swap/vUSD${address2 ? `/${address2}` : ''}?network=${networkName}`
        )
      }
    } else {
      history.push(
        `/swap/vUSD${address2 ? `/${address2}` : ''}?network=${networkName}`
      )
    }
  }, [address1, onGetToken, history, networkId])

  const setToken2 = useCallback(async () => {
    let address = address2
    let flag = false
    if (
      address2?.toLowerCase() === 'eth' ||
      address2?.toLowerCase() === 'matic'
    ) {
      address = MAIN_CURRENCY?.symbol
      flag = true
    } else if (
      address2?.toLowerCase() === 'weth' ||
      address2?.toLowerCase() === 'wmatic'
    ) {
      address = `W${MAIN_CURRENCY?.symbol}`
      flag = true
    }
    if (address1 !== address2) {
      const tokens2 = await onGetToken(address, flag)
      const ts2 =
        tokens2.filter(
          (token) =>
            (chainId && token?.chainId === chainId) ||
            (!chainId && token?.chainId === networkId)
        ) || []
      if ((ts2 && ts2.length === 1) || address === MAIN_CURRENCY?.symbol) {
        const pool = ts2[0]?.address
          ? await swapContract.methods.pools(ts2[0]?.address).call()
          : null
        if (
          (pool && pool.status !== '0') ||
          ts2[0].address === VUSD_ADDRESS ||
          !ts2[0]?.address
        ) {
          const fromContributedList = contributedPoolList.find(
            (token) => token.token === ts2[0].address
          )
          if (
            ts2[0]?.notInList &&
            ts2[0]?.showWarning &&
            contributedPoolList?.length > 0 &&
            !fromContributedList
          ) {
            handleImportTokenModal({
              currrency: ts2[0],
              close,
              setCurrency: setToCurrency,
            })
            return
          }
          !contributedPoolListLoading && setToCurrency(ts2[0])
        }
        !contributedPoolListLoading && setToCurrency(ts2[0])
      } else if (address1?.toLowerCase() !== 'vusd') {
        history.push(`/swap/${address1 ? address1 : ''}?network=${networkName}`)
      } else {
        history.push(`/swap/vUSD?network=${networkName}`)
      }
    }
  }, [address2, onGetToken, networkId])

  useEffect(() => {
    if (
      address1 &&
      (!isDropdown || fromCurrency?.chainId !== chainId) &&
      swapContract &&
      contributedPoolList
    ) {
      if (
        chainId == MAIN_CURRENCY?.chainId ||
        (!wallet && !contributedPoolListLoading)
      ) {
        setToken1()
      }
    }
  }, [
    address1,
    networkId,
    isDropdown,
    swapContract,
    contributedPoolList,
    contributedPoolListLoading,
  ])

  useEffect(() => {
    if (
      address2 &&
      (!isDropdown || toCurrency) &&
      swapContract &&
      contributedPoolList
    ) {
      if (
        chainId == MAIN_CURRENCY?.chainId ||
        (!wallet && !contributedPoolListLoading)
      ) {
        setToken2()
      }
    }
  }, [
    address2,
    networkId,
    isDropdown,
    swapContract,
    contributedPoolList,
    contributedPoolListLoading,
  ])

  useEffect(() => {
    const calAllowance = async () => {
      const res = await getAllowance(fromCurrency?.address, true)
      setAllowance(res)
    }

    if (fromCurrency?.address) {
      calAllowance()
    }
  }, [fromCurrency])

  useEffect(() => {
    if (
      fromPoolData &&
      toPoolData &&
      fromPoolData?.token !== toPoolData?.token
    ) {
      handleChangeAmount()
    }
  }, [fromPoolData, toPoolData])

  useEffect(() => {
    const getAllowanceCallback = async () => {
      const allowance = await getAllowance(fromCurrency?.address, true)
      setAllowance(Number(allowance))
    }
    if (transactions[chainId]) {
      const savedTx = transactions[chainId].find(
        (tx) => tx.type === ACTIONS.APPROVE && !tx?.isChecked
      )
      if (savedTx && savedTx.status === TRANSACTION_STATUS.SUCCESS) {
        getAllowanceCallback()
        setApproving(false)
        dispatch(
          addTransaction({
            ...savedTx,
            isChecked: true,
          })
        )
      }
    }
  }, [transactions, isUpdated, fromCurrency])

  const checkValuable = () => {
    if (!fromCurrency || (!fromPoolData && toAmount)) {
      showToast('Please select the token you’d like to swap from.', {
        toastId: 'fromCurrency',
      })
      return false
    }
    if (!toCurrency || (!toPoolData && fromAmount)) {
      showToast('Please select the token you’d like to swap to.', {
        toastId: 'toCurrency',
      })
      return false
    }
    if (
      fromCurrency?.address &&
      fromCurrency?.address !== VUSD_ADDRESS &&
      fromPoolData?.status === '0'
    ) {
      showToast(
        `You should create a pool before using ${fromCurrency.symbol} token`,
        {
          toastId: 'fromCurrencyPool',
        }
      )
      return false
    }
    if (
      toCurrency?.address &&
      toCurrency?.address !== VUSD_ADDRESS &&
      toPoolData?.status === '0'
    ) {
      showToast(
        `You should create a pool before using ${toCurrency.symbol} token`,
        {
          toastId: 'toCurrencyPool',
        }
      )
      return false
    }
    return true
  }

  const getAmountOut = async (amount, currency = null) => {
    setCalculating(true)
    const res = await onGetAmountOut(
      currency || fromCurrency,
      toCurrency,
      amount
    )
    if (res) {
      const amountOut = BigNumber(res.amountOut)
        .div(10 ** toCurrency?.decimals)
        .toNumber()
      const tradeVusdValue = BigNumber(res.tradeVusdValue)
        .div(10 ** toCurrency?.decimals)
        .toNumber()
      const fromVusdCredit = BigNumber(fromPoolData?.vusdCredit)
        .div(10 ** toCurrency?.decimals)
        .toNumber()
      const priceData = weiToEthNum(BigNumber(toPoolData?.price))
      const tokenBalanceData = weiToEthNum(BigNumber(toPoolData?.tokenBalance))

      const poolBalance = poolValue(0, tokenBalanceData, priceData)

      setToAmount(precise(amountOut, 6))
      setCalculating(false)
      setSCError(false)
      if (
        tradeVusdValue > poolBalance &&
        toPoolData?.token === WRAPPED_MAIN_ADDRESS
      ) {
        setLiquidityError(true)
        return
      } else if (
        amountOut > tokenBalanceData &&
        toCurrency?.address !== VUSD_ADDRESS
      ) {
        setLiquidityError(true)
        return
      } else {
        setLiquidityError(false)
      }
      if (
        tradeVusdValue > fromVusdCredit &&
        fromCurrency?.address !== VUSD_ADDRESS &&
        pool?.status !== '2'
      ) {
        setContractError(true)
        setSwitching(false)
        return
      }
      setExactAmount(false)
      setContractError(false)
    } else {
      setToAmount(0)
      setContractError(true)
      setCalculating(false)
      if (!fromCurrency) {
        showToast(
          `Token balance is not enough. Please add some liquidity on the pool page.`,
          {
            toastId: 'toLiquidity',
          }
        )
      } else {
        setSCError(true)
      }
    }
    setSwitching(false)
  }

  const getAmountIn = async (amount, currency = null) => {
    setCalculating(true)
    const res = await onGetAmountIn(
      fromCurrency,
      currency || toCurrency,
      amount
    )
    if (res) {
      const amountIn = BigNumber(res.amountIn)
        .div(10 ** fromCurrency?.decimals)
        .toNumber()
      const tradeVusdValue = BigNumber(res.tradeVusdValue)
        .div(10 ** fromCurrency?.decimals)
        .toNumber()
      const fromVusdCredit = BigNumber(fromPoolData.vusdCredit)
        .div(10 ** fromCurrency?.decimals)
        .toNumber()
      setFromAmount(precise(amountIn, 6))
      setCalculating(false)
      setSCError(false)
      if (
        tradeVusdValue > fromVusdCredit &&
        fromCurrency.address !== VUSD_ADDRESS &&
        pool?.status !== '2'
      ) {
        setContractError(true)
        setSwitching(false)
        return
      }
      setExactAmount(true)
      setContractError(false)
    } else {
      setFromAmount(0)
      setContractError(true)
      setCalculating(false)
      if (!fromCurrency) {
        showToast(
          `Token balance is not enough. Please add some liquidity on the pool page.`,
          {
            toastId: 'fromLiquidity',
          }
        )
      } else {
        setSCError(true)
      }
    }
    setSwitching(false)
  }

  const toggleToList = () => {
    handleToCurrencySelector()
  }

  const toggleFromList = () => {
    handleFromCurrencySelector()
  }

  const handleFinishTransaction = () => {
    setFromAmount(0)
    setToAmount(0)
    fetchFromBalance()
    fetchToBalance()
  }

  const handleClearInputs = () => {
    setFromAmount(0)
    setToAmount(0)
  }

  const [onPresentConfirmOrderModal] = useModal(
    <ConfirmOrderModal
      fromToken={fromCurrency}
      toToken={toCurrency}
      fromAmount={fromAmount}
      toAmount={toAmount}
      exactAmount={exactAmount}
      deadline={deadline}
      onCloseModal={handleClearInputs}
      onFinishTransaction={handleFinishTransaction}
    />,
    'success'
  )

  const handleConfirmOrder = async () => {
    dispatch(
      updateSwapTransaction({
        isPerforming: false,
        isRejected: false,
        successResult: undefined,
        successEnded: false,
      })
    )
    if (Number(fromAmount) > weiToEthNum(fromBalance)) {
      showToast(`Insufficient balance`, { toastId: 'balance' })
      return
    }
    if (fromCurrency?.symbol && !fromCurrency?.address) {
      onPresentConfirmOrderModal()
      return
    }
    if (allowance && weiToEthNum(BigNumber(allowance)) > fromAmount) {
      onPresentConfirmOrderModal()
    } else {
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
        setApproving(true)
        onApprove(fromCurrency?.address, payload)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const handleChangeAmount = () => {
    if (!exactAmount) {
      handleChangeFromAmount(fromAmount, true)
    } else {
      handleChangeToAmount(toAmount, true)
    }
  }

  const handleChangeFromAmount = (value, isChecking = false) => {
    if (typeof value == 'number') {
      setFromAmount(value)
    } else if (!value || value?.match(/^\d{0,}(\.\d{0,18})?$/)) {
      if (value === '.') {
        setFromAmount(value)
      } else if (value && value.slice(-1) === '.') {
        setFromAmount(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        if (
          value &&
          parseFloat(value) < 1 &&
          parseFloat(value) !== value &&
          value.slice(-1) !== '0'
        ) {
          setFromAmount(
            parseFloat(value)
              .toFixed(value.length - 1)
              .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
          )
        } else {
          setFromAmount(
            value === '0' ? '0' : value.replace(/^0+/, '').replace(/^\./, '0.')
          )
        }
      }
    }

    if (isNaN(value) || value == 0) {
      setToAmount(0)
      return
    }
    if (
      (checkValuable() &&
        fromCurrency?.address == WRAPPED_MAIN_ADDRESS &&
        !toCurrency?.address) ||
      (toCurrency?.address == WRAPPED_MAIN_ADDRESS && !fromCurrency?.address)
    ) {
      setToAmount(value)
      return
    }
    if (isChecking || checkValuable()) {
      getAmountOut(value, fromCurrency)
    } else {
      setToAmount(0)
    }
  }

  const handleChangeToAmount = (value, isChecking = false) => {
    if (typeof value == 'number') {
      setToAmount(value)
    } else if (!value || value?.match(/^\d{0,}(\.\d{0,18})?$/)) {
      if (value === '.') {
        setToAmount(value)
      } else if (value && value.slice(-1) === '.') {
        setToAmount(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        if (
          value &&
          parseFloat(value) < 1 &&
          parseFloat(value) !== value &&
          value.slice(-1) !== '0'
        ) {
          setToAmount(
            parseFloat(value)
              .toFixed(value.length - 1)
              .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
          )
        } else {
          setToAmount(
            value === '0' ? '0' : value.replace(/^0+/, '').replace(/^\./, '0.')
          )
        }
      }
    }

    if (isNaN(value) || value == 0) {
      setFromAmount(0)
      return
    }

    if (
      (checkValuable() &&
        fromCurrency?.address == WRAPPED_MAIN_ADDRESS &&
        !toCurrency?.address) ||
      (toCurrency?.address == WRAPPED_MAIN_ADDRESS && !fromCurrency?.address)
    ) {
      setFromAmount(value)
      return
    }

    if (isChecking || checkValuable()) {
      getAmountIn(value, toCurrency)
    } else {
      setFromAmount(0)
    }
  }

  const handleSwapItems = () => {
    if (loading) {
      return
    }
    setSwitching(!isSwitching)
    setIsSwapped(!isSwapped)
    setToCurrency(fromCurrency)
    setFromCurrency(toCurrency)
    setExactAmount(!exactAmount)
    if (exactAmount) {
      setFromAmount(toAmount)
    } else {
      setToAmount(fromAmount)
    }
  }

  const setTolerance = (value) => {
    dispatch(setSwapTolerance(parseFloat(value)))
  }

  const [handleSettingsModal] = useModal(
    <TransactionSettingModal
      tolerance={tolerance}
      setTolerance={setTolerance}
      setDeadline={setDeadline}
      initDeadline={deadline}
    />
  )

  const [handleConnectClick] = useModal(<WalletListModal />)

  const [handleToCurrencySelector] = useModal(
    <CurrencySelector
      setCurrency={setToCurrency}
      setIsDropdown={setIsDropdown}
      swapSelector={true}
      selected={[fromCurrency, toCurrency]}
    />
  )

  const [handleFromCurrencySelector] = useModal(
    <CurrencySelector
      setCurrency={setFromCurrency}
      setIsDropdown={setIsDropdown}
      selected={[toCurrency, fromCurrency]}
    />
  )

  const fromAmountBig = new BigNumber(fromAmount)
  const fromBalanceConverted = ubetToEth(fromBalance, fromCurrency?.decimals)
  const toBalanceConverted = ubetToEth(toBalance, toCurrency?.decimals)

  const insufficientFromBalance = fromAmountBig.isGreaterThan(
    fromBalanceConverted
  )

  const errors = account && (contractError || liquidityError || scError)

  const isApproved = useMemo(() => {
    return (
      (allowance && weiToEthNum(BigNumber(allowance)) > fromAmount) ||
      !fromCurrency?.address
    )
  }, [allowance, fromAmount])

  return (
    <Div>
      <SwapCard>
        <CardHeader>
          <CardTabs>
            <Span active>Market</Span>
          </CardTabs>
          <StyledSettingIcon
            style={{ justifyContent: 'flex-end' }}
            onClick={handleSettingsModal}
          />
        </CardHeader>
        <Content>
          <PriceInput
            text={'You Pay'}
            amount={fromAmount}
            handleChangeAmount={handleChangeFromAmount}
            currency={fromCurrency}
            toggle={toggleFromList}
            balance={fromBalanceConverted}
            showMax={fromCurrency}
            testToggleId="from-toggle"
            testid="from-price-input"
          />
          <Spacer />
          {!loading && (
            <StyledSwapIcon
              onClick={handleSwapItems}
              isSwapped={isSwapped}
              style={{ justifyContent: 'center' }}
              testid="swap-icon"
            />
          )}
          {loading && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Spinner size="35px" thickness={3} color="#2dc48f" />
            </div>
          )}
          <Spacer />
          <PriceInput
            text={'You Receive'}
            amount={toAmount}
            handleChangeAmount={handleChangeToAmount}
            currency={toCurrency}
            toggle={toggleToList}
            balance={toBalanceConverted}
            showMax={toCurrency}
            testToggleId="to-toggle"
            testid="to-price-input"
          />
          <div style={{ height: 30 }}></div>
          {account ? (
            insufficientFromBalance ? (
              <StyledIconButton disabled block shadow variant="primary">
                {`Insufficient ${fromCurrency?.symbol} token balance`}
              </StyledIconButton>
            ) : toPoolData &&
              toPoolData?.status === '0' &&
              contractError &&
              fromAmount ? (
              <StyledIconButton
                disabled
                block
                shadow
                variant="primary"
                icon="arrow"
              >
                {!fromCurrency?.address &&
                toCurrency?.address === WRAPPED_MAIN_ADDRESS
                  ? 'Wrap'
                  : fromCurrency?.address === WRAPPED_MAIN_ADDRESS &&
                    !toCurrency?.address
                  ? 'Unwrap'
                  : 'Swap'}
              </StyledIconButton>
            ) : toAmount && fromAmount ? (
              <StyledIconButton
                onClick={handleConfirmOrder}
                disabled={
                  contractError ||
                  liquidityError ||
                  scError ||
                  insufficientFromBalance ||
                  calculating ||
                  isApproving
                }
                block
                isPerforming={isApproving}
                isConfirmSwap={true}
                icon="arrow"
                variant="primary"
              >
                {calculating
                  ? 'Calculating'
                  : !fromCurrency?.address &&
                    toCurrency?.address === WRAPPED_MAIN_ADDRESS
                  ? 'Wrap'
                  : fromCurrency?.address === WRAPPED_MAIN_ADDRESS &&
                    !toCurrency?.address
                  ? 'Unwrap'
                  : isApproved
                  ? 'Swap'
                  : isApproving
                  ? 'Waiting for Approval'
                  : 'Approve Swap'}
              </StyledIconButton>
            ) : (
              <StyledIconButton disabled={true} block variant="primary">
                {calculating ? 'Calculating' : 'Enter an Amount'}
              </StyledIconButton>
            )
          ) : (
            <StyledIconButton
              onClick={handleConnectClick}
              block
              icon="arrow"
              variant="primary"
            >
              Connect Wallet
            </StyledIconButton>
          )}
        </Content>
        {errors && (
          <Error>
            <ul>
              {scError && (
                <StyledItem>Insufficient liquidity for this trade</StyledItem>
              )}
              {contractError && (
                <StyledItem>{`Insufficient vUSD balance for ${fromCurrency?.symbol} pool.`}</StyledItem>
              )}
              {liquidityError && (
                <StyledItem>{`${toCurrency?.symbol} pool does not have enough liquidity to execute this transaction.`}</StyledItem>
              )}
            </ul>
            <img
              src={Warning}
              style={{
                position: 'absolute',
                bottom: '-12px',
                right: '-11px',
              }}
            />
          </Error>
        )}
      </SwapCard>
      {(!fromCurrency?.address &&
        toCurrency?.address === WRAPPED_MAIN_ADDRESS) ||
      (fromCurrency?.address === WRAPPED_MAIN_ADDRESS &&
        !toCurrency?.address) ? null : (
        <SwapWidget
          fromToken={fromCurrency}
          fromPoolData={fromPoolData}
          toPoolData={toPoolData}
          toToken={toCurrency}
          fromAmount={fromAmount}
          toAmount={toAmount}
        />
      )}
      {toCurrency && fromCurrency && (
        <StartTrading
          toCurrency={toCurrency}
          fromCurrency={fromCurrency}
          toAmount={toAmount}
          fromAmount={fromAmount}
        />
      )}
    </Div>
  )
}

const SwapCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px;
  object-fit: contain;
  border-radius: 39px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  background-color: ${({ theme }) => theme.color.background.main};
`
const CardTabs = styled.div`
  margin-top: 0.8rem;
  width: fit-content;
  float: left;
`
const Span = styled.span`
  color: ${({ theme }) => theme.color.secondary.main};
  font-weight: 800;
  cursor: pointer;
  margin: 8px 29px 8px 0;
  ${(props) =>
    props.active
      ? `
        font-size: 18px`
      : `
        opacity: 0.5;
        font-size: 14px;`};
`
const Div = styled.div`
  position: relative;
  max-width: 390px;
  display: flex;
  flex-direction: column;
`
const CardHeader = styled.div``

const Content = styled.div`
  padding-top: 35px;
`

const Error = styled.div`
  border-left: 5px solid ${({ theme }) => theme.color.font.warning};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: #f4eded;
  min-height: 80px;
  display: flex;
  position: relative;
  overflow: hidden;
  margin-top: 30px;
  ul {
    padding: 18px 20px;
    margin-block-start:0;
    margin-block-end:0;
    padding-inline-start: 18px;
    list-style: none;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: auto;
  padding:.5rem 0;
  `}
`

const StyledItem = styled.li`
  font-size: 14px;
  font-weight: 800;
  width: 248px;
  color: ${({ theme }) => theme.color.font.warning};
  &::before {
    content: '•';
    color: ${({ theme }) => theme.color.font.warning};
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    margin-right: 8px;
  }
`

export default SwapperCard
