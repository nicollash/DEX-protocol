import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ExternalLink } from '@styled-icons/evil/ExternalLink'

import { RowFixed, Row } from 'components/Row'
import Label from 'components/Label'
import StyledDataTable from 'components/StyledDataTable'
import { StyledExternalLink } from 'theme'
import { weiToEthNum } from 'monox/constants'
import { getEtherscanLink, precise } from 'monox/util'
import useStakingTrans from 'hooks/useStakingTrans'
import { AccountContext } from 'contexts/AccountProvider'

import CheckedIcon from 'assets/img/checked.svg'
import UnCheckedIcon from 'assets/img/unchecked.svg'

function StakingTrans() {
  const chainId = useSelector(({ network }) => network.id)

  const { infuraContract } = useContext(AccountContext)
  const [tab, setTab] = useState('withdrawal_deposit')
  const { transList: data, loading, getStakingTransactions } = useStakingTrans(
    tab
  )
  useEffect(() => {
    if (infuraContract) {
      getStakingTransactions()
    }
  }, [infuraContract, tab])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'Date',
        style: { width: '18%' },

        Cell: function tokenRow({ row }) {
          const { timestamp } = row.original
          const formattedDate = dayjs(new Date(timestamp * 1000)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          return <Label text={formattedDate} size="13" weight="800" />
        },
      },
      {
        Header: 'Type',
        accessor: 'Type',
        style: { width: '10%' },

        Cell: function symbolRow({ row }) {
          const { type } = row.original
          return <Label text={type} size="13" weight="800" />
        },
      },
      {
        Header: 'Amount',
        accessor: 'Amount',
        style: { width: '20%' },
        Cell: function priceRow({ row }) {
          const { amount } = row.original
          const price = weiToEthNum(BigNumber(amount))
          return (
            <Label
              text={`$${new Intl.NumberFormat().format(precise(price, 4))}`}
              size="13"
              weight="800"
            />
          )
        },
      },
      {
        Header: 'Status',
        accessor: 'Status',
        style: { width: '11%' },

        Cell: function dayRow({ row }) {
          const { status } = row.original
          return (
            <Row>
              {status === 'success' ? (
                <SearchIcon src={CheckedIcon} />
              ) : (
                <SearchIcon src={UnCheckedIcon} />
              )}
            </Row>
          )
        },
      },
      {
        Header: '',
        accessor: 'status2',
        style: { width: '12%' },
        Cell: function actionRow({ row }) {
          const { transactionHash } = row.original
          return (
            <Row>
              <Col icon>
                <Row>
                  <StyledExternalLink
                    target="_blank"
                    href={getEtherscanLink(
                      chainId,
                      transactionHash,
                      'transaction'
                    )}
                    rel="noopener noreferrer"
                    style={{ justifyContent: 'left' }}
                  >
                    <Label
                      text={`View on ${chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'}`}
                      size="13"
                      weight="800"
                      primary
                      pointer
                    />
                    <ExternalLink size="20" />
                  </StyledExternalLink>
                </Row>
              </Col>
            </Row>
          )
        },
      },
    ],
    []
  )

  return (
    <StyledDataTable
      columns={columns}
      data={data}
      full
      justify="center"
      pagination
      loading={loading}
      striped={false}
      hoverable={true}
      withOutPagePagination={true}
    />
  )
}

const Col = styled(RowFixed)`
  flex-direction: column;
  justify-content: center;
  margin-left: ${(props) => props.last && '15px'};
`

const SearchIcon = styled.img`
  display: flex;
  height: 20px;
  width: 20px;
`

export default StakingTrans
