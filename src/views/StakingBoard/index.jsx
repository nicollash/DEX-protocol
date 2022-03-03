import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import useWallet from 'hooks/useWallet'

import {
  EarningsColumn,
  LiquidityColumn,
  RoiColumn,
  StakedColumn,
  YieldColumn,
  NameColumn,
  ActionColumn,
} from 'views/StakingBoard/columns'

import { AccountContext } from 'contexts/AccountProvider'
import useStaking from 'hooks/useStaking'
import useModal from 'hooks/useModal'
import { showToast, ACTIONS, TRANSACTION_STATUS } from 'monox/util'
import { getPoolList } from 'api'
import { savePoolList, setPoolsLoading } from 'state/pools/actions'

import ConfirmStakingModal from 'components/ConfirmStakingModal'
import StyledDataTable from 'components/StyledDataTable'
import { RowFixed } from 'components/Row'
import WalletListModal from 'components/WalletListModal'
import Spacer from 'components/Spacer'
import { ApproveStakeToast } from 'components/ToastPopup'

let buffer
function StakingBoard() {
  const [searchTxt, setSearchTxt] = useState('')
  const [isStake, setIsStake] = useState(false)
  const [stakeData, setStakeData] = useState()
  const [approvingId, setApprovingId] = useState(null)
  const [approvingIds, setApprovingIds] = useState([])
  const { chainId, account } = useWallet()
  const dispatch = useDispatch()

  const {
    stakeContract,
    poolsContract,
    infuraContract,
    infuraStakeContract,
  } = useContext(AccountContext)
  const { data, approveStake, getFullPoolList, loading } = useStaking()
  const poolsLoading = useSelector(({ pools }) => pools.poolsLoading)
  const transactions = useSelector(({ transactions }) => transactions[chainId])

  useEffect(() => {
    if (
      (stakeContract && poolsContract) ||
      (infuraContract && infuraStakeContract)
    ) {
      getFullPoolList()
    }
  }, [
    account,
    stakeContract,
    poolsContract,
    infuraContract,
    infuraStakeContract,
    poolsLoading,
  ])

  useEffect(() => {
    const fetchPoolList = async () => {
      try {
        dispatch(setPoolsLoading(true))
        const data = await getPoolList(chainId)
        if (data && data.result) {
          dispatch(savePoolList({ chainId, pools: data.response }))
        }
      } catch (e) {
        console.log(e)
      } finally {
        dispatch(setPoolsLoading(false))
      }
    }
    if (chainId) {
      fetchPoolList()
    }
  }, [chainId, dispatch])

  useEffect(() => {
    if (stakeData) {
      if (transactions) {
        const stakeTransactions = transactions.filter(
          (tx) =>
            (tx.type === ACTIONS.STAKE || tx.type === ACTIONS.UNSTAKE) &&
            (tx.status === TRANSACTION_STATUS.REQUESTED ||
              tx.status === TRANSACTION_STATUS.PENDING)
        )
        if (stakeTransactions.length === 0) {
          handleConfirmStaking()
        }
      } else {
        handleConfirmStaking()
      }
    }
  }, [stakeData, transactions])

  useEffect(() => {
    if (transactions) {
      const stakingTxs = transactions.filter(
        (tx) =>
          tx.type === ACTIONS.STAKE ||
          tx.type === ACTIONS.UNSTAKE ||
          tx.type === ACTIONS.HARVEST
      )
      if (stakingTxs.length > 0) {
        const lastTx = stakingTxs[stakingTxs.length - 1]
        if (lastTx.status === 'SUCCESS') {
          getFullPoolList(false)
        }
      }
    }
  }, [transactions])

  const [OnpresentWalletListModal] = useModal(<WalletListModal />)

  const handleUnlockClick = useCallback(() => {
    OnpresentWalletListModal()
  }, [OnpresentWalletListModal])

  const handleApproveStaking = async (poolData, balance) => {
    if (balance <= 0) {
      return
    }
    setApprovingId(poolData.pid)
    setApprovingIds([...approvingIds, poolData.pid])
    buffer = [...approvingIds, poolData.pid]
    const tx = await approveStake(poolData.symbol)
    if (tx) {
      showToast(
        <ApproveStakeToast
          poolData={poolData}
          link={tx?.transactionHash}
          chainId={chainId}
        />
      )
      getFullPoolList()
    }
    setApprovingId(null)
    const filteredApprovingIds = buffer.filter((item) => item !== poolData.pid)
    setApprovingIds(filteredApprovingIds)
    buffer = filteredApprovingIds
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Farm',
        style: { width: '7%', textAlign: 'center' },
        Cell: function earnRow({ row }) {
          const { name, symbol, token } = row.original
          return <NameColumn name={name} symbol={symbol} token={token} />
        },
      },
      {
        Header: 'Yield per $1,000',
        accessor: 'lastName',
        style: { width: '15%', textAlign: 'center' },
        Cell: function yieldRow({ row }) {
          const {
            pid,
            price,
            stakedAmount,
            allocPoint,
            totalAllocPoint,
            lpTokenId,
            vusdDebt,
            vusdCredit,
            tokenBalance,
          } = row.original

          return (
            <YieldColumn
              pid={pid}
              price={price}
              lpTokenId={lpTokenId}
              stakedAmount={stakedAmount}
              totalAllocPoint={totalAllocPoint}
              allocPoint={allocPoint}
              tokenBalance={tokenBalance}
              vusdCredit={vusdCredit}
              vusdDebt={vusdDebt}
            />
          )
        },
      },
      {
        Header: 'Yearly / Monthly / Daily ROI',
        accessor: 'age',
        style: { width: '15%', textAlign: 'center' },
        Cell: function roiRow({ row }) {
          const {
            pid,
            price,
            stakedAmount,
            allocPoint,
            totalAllocPoint,
            lpTokenId,
            vusdDebt,
            vusdCredit,
            tokenBalance,
          } = row.original
          return (
            <RoiColumn
              pid={pid}
              price={price}
              lpTokenId={lpTokenId}
              stakedAmount={stakedAmount}
              totalAllocPoint={totalAllocPoint}
              allocPoint={allocPoint}
              tokenBalance={tokenBalance}
              vusdCredit={vusdCredit}
              vusdDebt={vusdDebt}
            />
          )
        },
      },
      {
        Header: 'Liquidity',
        accessor: 'visits',
        style: { width: '15%', textAlign: 'center' },
        Cell: function liquidityRow({ row }) {
          const {
            token,
            lpTokenId,
            symbol,
            price,
            tokenBalance,
            vusdDebt,
            vusdCredit,
            stakedAmount,
          } = row.original
          return (
            <LiquidityColumn
              pid={lpTokenId}
              token={token}
              symbol={symbol}
              price={price}
              tokenBalance={tokenBalance}
              vusdCredit={vusdCredit}
              vusdDebt={vusdDebt}
              stakedAmount={stakedAmount}
            />
          )
        },
      },
      {
        Header: 'Staked',
        accessor: 'status',
        style: { width: '15%', textAlign: 'center' },
        Cell: function stakedRow({ row }) {
          const {
            token,
            amount,
            lpTokenId,
            price,
            symbol,
            tokenBalance,
            vusdDebt,
            vusdCredit,
          } = row.original
          return (
            <StakedColumn
              token={token}
              amount={amount}
              price={price}
              symbol={symbol}
              tokenBalance={tokenBalance}
              vusdDebt={vusdDebt}
              vusdCredit={vusdCredit}
              pid={lpTokenId}
            />
          )
        },
      },
      {
        Header: 'Claimable MONO',
        accessor: 'progress',
        style: { width: '15%', textAlign: 'center' },
        Cell: function earningsRow({ row }) {
          const { stakePoolId } = row.original
          return <EarningsColumn poolData={row.original} pid={stakePoolId} />
        },
      },
      {
        Header: '',
        accessor: 'status2',
        style: { width: '10%' },
        Cell: function actionRow({ row }) {
          return (
            <ActionColumn
              poolData={row.original}
              handleApproveStaking={handleApproveStaking}
              handleStaking={handleStaking}
              handleUnStaking={handleUnStaking}
              handleUnlockClick={handleUnlockClick}
              approvingId={approvingId}
              approvingIds={approvingIds}
            />
          )
        },
      },
    ],
    [data, approvingIds]
  )

  const handleClear = () => {
    setStakeData(null)
    setIsStake(false)
  }

  const [handleConfirmStaking] = useModal(
    <ConfirmStakingModal poolData={stakeData} isStake={isStake} />,
    handleClear
  )

  const handleStaking = (poolData, balance) => {
    if (balance <= 0) {
      return
    }
    setStakeData(poolData)
  }

  const handleUnStaking = async (poolData) => {
    setIsStake(true)
    setStakeData(poolData)
  }

  const filteredData = useMemo(() => {
    if (searchTxt) {
      return data.filter(
        (el) =>
          el.name.toLowerCase().includes(searchTxt.toLowerCase()) ||
          el.symbol.toLowerCase().includes(searchTxt.toLowerCase()) ||
          el.token.toLowerCase() === searchTxt.toLowerCase()
      )
    }
    return data
  }, [searchTxt, data])

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>Farms | MonoX</title>
        </Helmet>
        <StyledDataTable
          columns={columns}
          data={filteredData}
          isFiltering
          searchTxt={searchTxt}
          setSearchTxt={setSearchTxt}
          loading={loading || poolsLoading}
          striped={false}
          hoverable={true}
          withOutPagePagination={true}
          tab="farm"
        />
        <Spacer size="lg" />
      </Container>
    </HelmetProvider>
  )
}

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  max-width: 1168px;
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 850px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 700px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:0 40px;
  `}
`

export const Col = styled(RowFixed)`
  flex-direction: column;
  justify-content: ${(props) => props.icon && 'center'};
  margin-left: ${(props) => props.last && '15px'};
`

export const Span = styled.span`
  color: ${(props) => props.theme.color.secondary.main};
  font-size: 12px;
  font-weight: 800;
  opacity: 0.4;
  margin-left: 2px;
`

export const Image = styled.img`
  width: 45px;
  height: 45px;
`

export default StakingBoard
