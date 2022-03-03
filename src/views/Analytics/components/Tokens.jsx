import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import usePool from 'hooks/usePool'
import useSearchToken from 'hooks/useSearchToken'
import useWallet from 'hooks/useWallet'
import { precise } from 'monox/util'
import { uriToHttp } from 'monox/getTokenList'
import { weiToEthNum } from 'monox/constants'
import config from 'monox/config'

import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import { Row, RowBetween, RowFixed } from 'components/Row'
import Divider from 'components/Divider'
import Spacer from 'components/Spacer'

const Card = ({ img1, img2, text1, text2, title, token }) => {
  const { address } = useParams()

  return (
    <>
      <Label
        text={title}
        size="18"
        weight="800"
        style={{ margin: '0 auto 25px 13px' }}
      />
      <CardContainer>
        <Div>
          <Row>
            <RowFixed>
              <TokenImage
                src={img1}
                letter={token?.symbol && token?.symbol[0]}
                width="40"
                height="40"
                style={{ marginRight: '10px' }}
              />
            </RowFixed>
            <RowFixed>
              <Label text={text1} size="16" weight="bold" />
            </RowFixed>
          </Row>
          {address !== '0xEa9f04b2806b60aA97309eE3D44F48A84034baA8' && (
            <>
              <Row>
                <Spacer />
                <Spacer />

                <Divider style={{ width: '85%' }} />
              </Row>
              <Row>
                <RowFixed>
                  <TokenImage
                    src={img2}
                    width="40"
                    height="40"
                    style={{ marginRight: '10px' }}
                  />
                </RowFixed>
                <RowFixed>
                  <Label text={text2} size="16" weight="bold" />
                </RowFixed>
              </Row>
            </>
          )}
        </Div>
      </CardContainer>
    </>
  )
}

const Tokens = () => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)

  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const vUSDData = config[networkId || chainId].vUSD

  const [token, setToken] = useState({})
  const { address } = useParams()
  const { onGetToken } = useSearchToken()
  const { pool } = usePool(token?.address || (!!token?.symbol && WRAPPED_MAIN_ADDRESS))
  const price = weiToEthNum(BigNumber(pool?.price))

  useEffect(() => {
    if (address) {
      onGetToken(address)
        .then((res) => {
          setToken(res[0])
        })
        .catch((err) => console.log(err))
    }
  }, [address])

  return (
    <Box>
      <Col>
        <Card
          img1={`${
            address == '0xEa9f04b2806b60aA97309eE3D44F48A84034baA8'
              ? vUSDData.logoURI
              : uriToHttp(token.logoURI)[0]
          }`}
          img2={`${vUSDData.logoURI}`}
          text1={`1 ${token?.symbol} = ${precise(price, 6)} vUSD`}
          text2={`1 vUSD = ${precise(1 / precise(price, 6), 6)} ${
            token?.symbol
          }`}
          title="Tokens"
          token={token}
        />
      </Col>
    </Box>
  )
}

export default Tokens

const Box = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`
const Col = styled(RowBetween)`
  flex-direction: column;
  margin: 15px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin:0px;
  margin-bottom:20px;
`};
`
const Div = styled.div`
  margin: 30px 50px;
  margin-right: auto;
  width: 70%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 20px;
    width: 80%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
     margin: 30px;
     width: 85%;
  `};
`
const CardContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 500px;
  min-height: 171px;
  border-radius: 38px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width:90%;
    margin-bottom: 20px;
  `};
`
