import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import useWallet from 'hooks/useWallet'
import useSearchToken from 'hooks/useSearchToken'
import useModal from 'hooks/useModal'
import useTokenBalance from 'hooks/useTokenBalance'
import { AccountContext } from 'contexts/AccountProvider'
import useWindowSize from 'hooks/useWindowSize'

import useApprove from 'hooks/useApprove'
import useCreatePool from 'hooks/useCreatePool'
import { isAddress, weiToEthNum } from 'monox/constants'
import { ACTIONS, showToast, TRANSACTION_STATUS } from 'monox/util'
import { ubetToEth } from 'monox/constants'

import { BackRoute } from 'views/AddLiquidity/components/BackRoute'
import Card from 'components/Card'
import { ColumnCenter } from 'components/Column'
import TransactionSuccessModal from 'components/TransactionSuccessModal'
import WalletListModal from 'components/WalletListModal'
import CardContainer, { PoolContainer } from 'components/CardContainer'
import TipCard from 'components/TipCard'
import StyledIconButton from 'components/StyledIconButton'
import { Row, RowFixed, RowBetween } from 'components/Row'
import Input from 'components/Input'
import Label from 'components/Label'
import Loader from 'components/Loader'
import TokenImage from 'components/TokenImage'
import Spacer from 'components/Spacer'
import Button from 'components/Button'
import TransactionSettingModal from 'components/TransactionSettingModal'
import { setAddLiquidityTolerance } from 'state/settings/action'
import { addTransaction } from 'state/transaction/actions'
import QuestionHelper from 'components/QuestionHelper'

export default function CreatePool({
  match: {
    params: { currencyIdA },
  },
  history,
}) {
  const { width } = useWindowSize()
  const [currency, setCurrency] = useState(null)
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [focusAddress, setFocusAddress] = useState(false)
  const [focusSupply, setFocusSupply] = useState(false)
  const [focus, setFocus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [enteredToken, setEnteredToken] = useState('')
  const [displayToken, setDisplayToken] = useState('')
  const [allowance, setAllowance] = useState(null)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingCreateTx, setPendingCreateTx] = useState(false)
  const [successResult, setSuccessResult] = useState(null)
  const [validPrice, setValidPrice] = useState(false)
  const { onGetToken } = useSearchToken()
  const { onApprove } = useApprove(() => setRequestedApproval(false))
  const { onCreatePool } = useCreatePool()
  const [pool, setPool] = useState(0)
  const transactions = useSelector((state) => state.transactions)
  const { isUpdated } = useSelector((state) => state.application)

  const handleCreatePoolClick = async () => {
    const payload = {
      fromCurrency: currency,
      fromAmount: amount,
      type: ACTIONS.CREATE,
      status: TRANSACTION_STATUS.PENDING,
      startTime: +new Date(),
      chainId,
    }
    setPendingCreateTx(true)
    try {
      const tx = await onCreatePool(currency, amount, price, payload)
      if (tx) {
        setSuccessResult(tx)
      }
    } catch (err) {
      console.log(err)
    }
    setPendingCreateTx(false)
  }

  const {
    poolsContract,
    swapContract,
    getAllowance,
    infuraContract,
  } = useContext(AccountContext)
  const { balance } = useTokenBalance(currency)
  const tolerance = useSelector(
    ({ settings }) => settings.addLiquidityTolerance
  )
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address
  const [deadline, setDeadline] = useState(20)
  const [isPending, setIsPending] = useState(false)

  const dispatch = useDispatch()

  const setToken = useCallback(
    async (currency) => {
      const ts = await onGetToken(currency ?? currencyIdA)
      if (ts && ts.length > 0) {
        setCurrency(ts[0])
        const address = ts[0]?.address
        setDisplayToken(address)
      }
    },
    [currencyIdA, onGetToken]
  )

  useEffect(() => {
    if (
      !currencyIdA &&
      currency?.symbol &&
      currency?.address !== VUSD_ADDRESS
    ) {
      history.push(
        `/create/${
          currency
            ? currency?.notInList
              ? currency.address
              : currency.symbol
            : currencyIdA
        }?network=${networkName}`
      )
    }
  }, [history, currencyIdA, currency])

  useEffect(() => {
    if ((poolsContract || infuraContract) && currencyIdA) {
      setToken()
    }
  }, [poolsContract, infuraContract, currencyIdA])

  useEffect(() => {
    if (currencyIdA && !currency) {
      setEnteredToken(currencyIdA)
    }
  }, [currencyIdA, currency])

  useEffect(() => {
    if (pool && pool.status !== '0') {
      showToast(
        'This pool already exists. Now redirecting you to add liquidity',
        { toastId: 'poolExists' }
      )
      setTimeout(() => {
        history.push(`/add/${currencyIdA}?network=${networkName}`)
        toast.dismiss('poolExists')
      }, 2500)
    }
  }, [pool])

  const isApproved = useMemo(() => {
    if (currencyIdA) {
      return allowance &&
        allowance > 0 &&
        weiToEthNum(balance, currency?.decimals) >= amount &&
        price > 0 &&
        pool.status === '0'
        ? false
        : true
    }
  }, [allowance, currencyIdA, amount, balance, currency, price])

  useEffect(() => {
    if (swapContract && currency) {
      swapContract.methods
        .pools(currency.address)
        .call()
        .then((res) => {
          setPool(res)
        })
      getAllowance(currency.address, true).then((res) =>
        setAllowance(Number(res))
      )
    } else if (infuraContract && currency) {
      infuraContract.methods
        .pools(currency.address)
        .call()
        .then((res) => {
          setPool(res)
        })
    } else {
      setAllowance(null)
    }
  }, [currency, swapContract, infuraContract])

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

      const CreatingTxs = transactions[chainId].filter(
        (tx) => tx.type === ACTIONS.CREATE
      )
      if (CreatingTxs.length > 0) {
        const lastTx = CreatingTxs[CreatingTxs.length - 1]
        if (
          lastTx.status === 'SUCCESS' &&
          Date.now() - lastTx.confirmedTime < 50
        ) {
          setIsPending(false)
          history.push(`/pool?network=${networkName}`)
        } else if (lastTx.status === 'PENDING') {
          handleTransferSubmit(lastTx?.tx)
          setIsPending(true)
        }
      }
    }
  }, [transactions, isUpdated, currency])

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal />,
    'success'
  )

  const handleChangeAmount = (evt) => {
    const value = evt.target.value
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
    if (value > 1000000) {
      setValidPrice(true)
    } else {
      setValidPrice(false)
    }
  }

  const [onPresentWalletListModal] = useModal(<WalletListModal />)

  const handleUnlockClick = useCallback(() => {
    onPresentWalletListModal()
  }, [onPresentWalletListModal])

  const { account, chainId } = useWallet()

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

  const handleCreatePool = async () => {
    if (allowance && allowance > 0) {
      handleCreatePoolClick()
    } else {
      handleApproveTransaction()
    }
  }

  const handleTokenAddress = async (e) => {
    setEnteredToken(e.target.value.trim())
    setDisplayToken(isAddress(e.target.value.trim()) && e.target.value.trim())
    setIsLoading(true)
    if (isAddress(e.target.value.trim())) {
      const ts = await onGetToken(e.target.value.trim())
      if (ts && ts.length > 0) {
        setCurrency(ts[0])
      }
    }
    setIsLoading(false)
  }

  const handleMaxClick = () => {
    if (currency?.address) {
      setAmount(weiToEthNum(balance, currency?.decimals))
    } else {
      setAmount(weiToEthNum(balance - 0.01, currency?.decimals))
    }
  }

  const setTolerance = (value) => {
    dispatch(setAddLiquidityTolerance(value))
  }

  const text = useMemo(() => {
    if (!enteredToken.length || focusAddress) {
      return enteredToken?.replace(/ /g, '') //remove space from string
    }
    let threshold = 0.4
    if (width < 960) {
      threshold = 0.3
    }
    if (width < 560) {
      threshold = 0.15
    }
    const splitIndex = Math.round(enteredToken.length * threshold)

    const leftText = enteredToken.slice(0, splitIndex)
    const rightText = enteredToken.slice(-splitIndex)

    return leftText + '...' + rightText
  }, [width, enteredToken, focusAddress])

  return (
    <PoolContainer>
      <BackRoute creating={true} adding={true} />
      <TipCard page={'add'} />
      <CardContainer top="40">
        <ColumnCenter>
          <Card>
            <Label
              text="Enter Token Address"
              opacity="0.5"
              size="13"
              weight="800"
              style={{ marginBottom: '10px' }}
              align="left"
            />
            <RowInput focus={focusAddress}>
              <Input
                size="sm"
                placeholder="Token Address"
                value={text}
                onChange={handleTokenAddress}
                style={{ textAlign: 'left' }}
                onFocus={() => setFocusAddress(true)}
                onBlur={() => setFocusAddress(false)}
                focus={focusAddress}
              />
              {!isLoading ? (
                <>
                  <Label text={currency?.symbol} size="14" weight="800" />
                  {currency?.logoURI && (
                    <TokenImage
                      src={currency?.logoURI}
                      height="28"
                      width="28"
                      style={{ margin: '11px' }}
                      letter={currency?.symbol && currency?.symbol[0]}
                    />
                  )}
                  <Spacer />
                </>
              ) : (
                <>
                  <Loader color="secondary" height="20" />
                  <Spacer />
                </>
              )}
            </RowInput>
            {isAddress(currency?.address || enteredToken) ? (
              ''
            ) : (
              <StyledIconButton
                onClick={handleCreatePool}
                block
                icon="arrow"
                variant="primary"
                disabled={true}
              >
                Create
              </StyledIconButton>
            )}
            {isAddress(currency?.address || enteredToken) &&
              currency?.address !== VUSD_ADDRESS && (
                <>
                  <RowBetween style={{ marginBottom: 10 }}>
                    <RowFixed>
                      <Label
                        text="Initial Supply"
                        opacity="0.5"
                        size="13"
                        weight="800"
                      />
                    </RowFixed>
                    <RowFixed>
                      {amount < weiToEthNum(balance, currency?.decimals) && (
                        <MaxButton onClick={handleMaxClick}>MAX</MaxButton>
                      )}
                      <Label
                        text={`Balance ${
                          (account && ubetToEth(balance, currency?.decimals)) ||
                          0
                        }`}
                        opacity="0.5"
                        size="13"
                        weight="800"
                      />
                    </RowFixed>
                  </RowBetween>
                  <RowInput focus={focusSupply}>
                    <Input
                      size="sm"
                      placeholder="0.0"
                      value={amount}
                      onChange={handleChangeAmount}
                      style={{ textAlign: 'left' }}
                      onFocus={() => setFocusSupply(true)}
                      onBlur={() => setFocusSupply(false)}
                    />
                  </RowInput>
                  <Label
                    size="13"
                    weight="800"
                    style={{ marginBottom: '10px' }}
                    align="left"
                  >
                    <span style={{ opacity: 0.5 }}>Set your price</span>
                    <QuestionHelper
                      id="deadline"
                      text=" Make sure to set a competitive initial price for your token, or you may have issues trading your token. "
                    />
                  </Label>
                  <RowInput focus={focus}>
                    <Input
                      size="sm"
                      placeholder="0.0"
                      value={price}
                      onChange={handleChangePrice}
                      style={{ textAlign: 'left' }}
                      onFocus={() => setFocus(true)}
                      onBlur={() => setFocus(false)}
                    />
                    <Row style={{ width: 'auto' }}>
                      <Dollar>$</Dollar>
                      <Label opacity={0.3} weight={800} size={13}>
                        per
                      </Label>
                      <TokenImage
                        src={currency?.logoURI}
                        height="28"
                        width="28"
                        style={{ margin: '11px' }}
                        letter={currency?.symbol[0]}
                      />
                    </Row>
                  </RowInput>
                  {(!allowance || allowance === 0) &&
                    amount > 0 &&
                    account &&
                    price && (
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
                  {!account ? (
                    <Button
                      text={'Connect Wallet'}
                      onClick={handleUnlockClick}
                    />
                  ) : amount ? (
                    <StyledIconButton
                      onClick={handleCreatePool}
                      block
                      icon="arrow"
                      isPerforming={pendingCreateTx}
                      isConfirmSwap={true}
                      variant="primary"
                      disabled={
                        isApproved || pendingCreateTx || validPrice || isPending
                      }
                    >
                      {pendingCreateTx
                        ? 'Waiting For Confirmation'
                        : validPrice
                        ? 'Please Lower Token Price'
                        : 'Create'}
                    </StyledIconButton>
                  ) : (
                    <Button text={'Enter an amount'} />
                  )}
                  {currency?.address === VUSD_ADDRESS && (
                    <Button text={`You can't create vUSD pool`} />
                  )}
                </>
              )}
            {isAddress(currency?.address || enteredToken) &&
              currency?.address === VUSD_ADDRESS && (
                <StyledIconButton
                  onClick={handleCreatePool}
                  block
                  icon="arrow"
                  variant="primary"
                  disabled={true}
                >
                  You can't create vUSD pool
                </StyledIconButton>
              )}
          </Card>
        </ColumnCenter>
      </CardContainer>
    </PoolContainer>
  )
}

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 50px;
  align-items: center;
  margin-bottom: 40px;
  justify-content: space-between;
  input {
    margin-left: 30px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-left: 20px;
  input {
    margin-left: 15px;
  }
  `}
  ${(props) => props.focus && props.theme.inputFocusBorder}
`
const MaxButton = styled.div`
  width: 31px;
  height: 14px;
  margin-right: 8px;
  border-radius: 7.5px;
  border: solid 1px ${({ theme }) => theme.color.font.green};
  font-size: 10px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.font.green};
  transition: background-color 0.3s ease-out;
  text-align: center;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: ${({ theme }) => theme.color.font.green};
  }
`
const Dollar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.font.green};
  color: #fff;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`
