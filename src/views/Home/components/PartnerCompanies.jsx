import React from 'react'
import styled from 'styled-components'

import { ColumnCenter } from 'components/Column'
import Label from 'components/Label'
import { SpacerResponsive } from 'components/Spacer'
import WorkingWith from 'assets/img/working-with.png'

const PartnerCompanies = ({ companies }) => {
  return (
    <Container len={companies.length}>
      <Background src={WorkingWith} len={companies.length} />
      <SpacerResponsive size="90" />
      <ColumnCenter>
        <Label text="Working With" weight="800" size="32" />
        <Label weight="800" size="14" opacity="0.5" align="center">
          Meet our partners and leading DeFi investors
        </Label>
      </ColumnCenter>
      <Grid>
        {companies.map((company, index) => {
          return (
            <Link href={company?.website?.url} key={index} target="_blank">
              <Item>
                <img src={company?.logo?.url} width="120" />
              </Item>
            </Link>
          )
        })}
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  height: ${(props) =>
    props.len > 4 ? 170 * Math.ceil(props.len / 4) + 200 : 450}px;
  margin-top: 180px;
  margin-bottom: -24px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: ${(props) =>
      props.len > 3 ? 160 * Math.ceil(props.len / 3) + 240 : 450}px;
          margin-bottom: -40px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: ${(props) =>
      props.len > 2 ? 150 * Math.ceil(props.len / 2) + 200 : 350}px;
          margin-bottom: -62px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: ${(props) =>
      props.len > 1 ? 130 * Math.ceil(props.len) + 200 : 350}px;
          margin-bottom: -62px;
  `}
`

const Background = styled.img`
  width: 100%;
  height: ${(props) =>
    props.len > 4 ? 170 * Math.ceil(props.len / 4) + 200 : 450}px;
  position: absolute;
  left: 0;
  z-index: -1;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: ${(props) =>
      props.len > 3 ? 160 * Math.ceil(props.len / 3) + 240 : 450}px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: ${(props) =>
      props.len > 2 ? 150 * Math.ceil(props.len / 2) + 200 : 350}px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: ${(props) =>
      props.len > 1 ? 130 * Math.ceil(props.len) + 200 : 350}px;
  `}
`

const Grid = styled.div`
  display: grid;
  margin: auto;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1012px;
  grid-column-gap: 60px;
  grid-row-gap: 60px;
  margin-top: 70px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(3, 1fr);
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: repeat(2, 1fr);
    margin-top:30px
    `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    text-align: center;
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 39px;
    max-width:300px
  `}
`
const Item = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  width: 190px;
  height: 90px;
  border-radius: 18px;
  box-shadow: 18px 18px 30px 0 #d0d8e6, -4px -4px 4px 0 #f6f8fe;
  background-color: #f5f5f8;
`
const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  display: contents;
`
export default PartnerCompanies
