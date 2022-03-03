import React, { useEffect, useState } from 'react'

import useSearchToken from 'hooks/useSearchToken'

import Label from 'components/Label'
import { Row } from 'components/Row'
import { Col } from 'views/StakingBoard/index'
import TokenImage from 'components/TokenImage'

const NameColumn = ({ name, symbol, token }) => {
  const [tokenData, setTokenData] = useState(null)
  const { onGetToken } = useSearchToken()

  useEffect(() => {
    let isMounted = true
    if (token) {
      onGetToken(token).then((res) => {
        if (isMounted) setTokenData(res[0])
      })
    }
    return () => {
      isMounted = false
    }
  }, [token, onGetToken])

  return (
    <Row>
      <Col icon>
        <TokenImage
          width="35"
          height="35"
          src={tokenData?.notInList ? null : tokenData?.logoURI}
          letter={symbol && symbol[0]}
        />
      </Col>
      <Col last>
        <Row>
          <Label text={name} size="13" weight="800" />
        </Row>
        <Row>
          <Label text={symbol} size="13" opacity="0.4" weight="800" />
        </Row>
      </Col>
    </Row>
  )
}

export default NameColumn
