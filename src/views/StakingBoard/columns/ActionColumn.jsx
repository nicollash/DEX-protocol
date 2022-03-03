import React from 'react'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import { StyledExternalLink } from 'theme'
import { weiToEthNum } from 'monox/constants'
import { Col } from 'views/StakingBoard/index'
import Label from 'components/Label'
import { Row } from 'components/Row'

const ActionColumn = ({
  poolData,
  handleApproveStaking,
  handleStaking,
  handleUnStaking,
  handleUnlockClick,
  approvingId,
  approvingIds,
}) => {
  const { account } = useWallet()
  const { allowance, pid, amount, balance } = poolData

  const onClickApproveBtn = () => {
    if (approvingIds.indexOf(pid) === -1) {
      handleApproveStaking(poolData, balance)
    }
  }

  if (!account) {
    return (
      <Row>
        <StyledExternalLink
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleUnlockClick}
          style={{ justifyContent: 'left' }}
        >
          <Label text="Connect Wallet" size="13" weight="800" primary pointer />
        </StyledExternalLink>
      </Row>
    )
  }

  return (
    <Col>
      <Row>
        <StyledExternalLink
          href={`/add/${poolData?.token}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ justifyContent: 'left' }}
        >
          <Label
            text="Add Liquidity"
            size="13"
            weight="800"
            style={{ margin: '5px 0' }}
            primary
            pointer
          />
        </StyledExternalLink>
      </Row>
      {!allowance && balance > 0 && (
        <Row>
          <Col icon>
            <Row
              onClick={onClickApproveBtn}
              disabled={approvingIds.indexOf(pid) >= 0}
            >
              <Label
                text={
                  approvingIds.indexOf(pid) >= 0
                    ? 'Approving'
                    : 'Approve Staking'
                }
                size="13"
                weight="800"
                primary
                pointer
                style={{ margin: '5px 0' }}
              />
            </Row>
          </Col>
        </Row>
      )}
      {allowance && balance > 0 && (
        <Row onClick={() => handleStaking(poolData, balance)}>
          <Label text="Stake" size="13" weight="800" primary pointer />
        </Row>
      )}
      {weiToEthNum(BigNumber(amount)) > 0 && (
        <Row onClick={() => handleUnStaking(poolData)}>
          <Label
            text="Unstake"
            size="13"
            weight="800"
            primary
            pointer
            style={{ margin: '5px 0' }}
            color="#eb9a76"
          />
        </Row>
      )}
    </Col>
  )
}

export default ActionColumn
