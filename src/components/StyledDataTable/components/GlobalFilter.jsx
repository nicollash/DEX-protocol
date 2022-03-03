import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import useWallet from 'hooks/useWallet'
import useTokenBalance from 'hooks/useTokenBalance'
import { weiToEth, monoTokenKovan, monoTokenMumbai } from 'monox/constants'

import { Row, RowBetween } from 'components/Row'
import Input from 'components/Input'
import Label from 'components/Label'

import searchIcon from 'assets/img/search.svg'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [focus, setFocus] = useState(false)
  const { chainId } = useWallet()
  const { balance, fetchBalance } = useTokenBalance(
    chainId === 80001 ? monoTokenMumbai : monoTokenKovan
  )
  const transactions = useSelector(({ transactions }) => transactions[chainId])

  useEffect(() => {
    if (transactions) {
      const stakingTxs = transactions.filter(
        (tx) => tx.type === 'STAKE' || tx.type === 'UNSTAKE'
      )
      if (stakingTxs.length > 0) {
        const lastTx = stakingTxs[stakingTxs.length - 1]
        if (lastTx.status === 'SUCCESS') {
          fetchBalance()
        }
      }
    }
  }, [transactions, fetchBalance])

  return (
    <Container>
      <Row>
        <Label text="Farm" weight="800" size="24" />
        <Label
          text={`MONO Balance: ${weiToEth(balance)} MONO`}
          weight="800"
          size="16"
          opacity={0.4}
          style={{ marginLeft: 15 }}
        />
      </Row>
      <Col>
        <RowInput focus={focus}>
          <Input
            style={{
              opacity: '0.5',
              fontSize: '13px',
              fontWeight: '800',
              marginLeft: '30px',
            }}
            placeholder={`Filter Tokens`}
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <SearchIcon src={searchIcon} />
        </RowInput>
      </Col>
    </Container>
  )
}

const Container = styled(Row)`
  align-items: baseline;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column-reverse;
  position: sticky;
  top: 0;
  padding-top: 20px;
  background-color: ${({ theme }) => theme.color.background.main};
  z-index: 10
  `};
`

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  align-items: center;
  margin-bottom: 34px;
  max-width: 350px;
  height: 37px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-right: 0px;
  `};

  ${(props) => props.focus && props.theme.inputFocusBorder};
`
const SearchIcon = styled.img`
  display: flex;
  height: 14px;
  width: 14px;
  margin-right: 25px;
`
const Col = styled(RowBetween)`
  justify-content: flex-end;
`

export default GlobalFilter
