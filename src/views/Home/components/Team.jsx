import React from 'react'
import styled from 'styled-components'

import Label from 'components/Label'
import Spacer from 'components/Spacer'
import { ColumnCenter } from 'components/Column'
import { Row, RowBetween } from 'components/Row'

const PersonCard = ({ name, profileLink, title, img, link }) => {
  return (
    <Container>
      <RowBetween>
        <Col>
          <Label size={16} weight={800}>
            {name}
          </Label>
          <Link href={link} target="__blank">
            {profileLink}
          </Link>
        </Col>
        <Image src={img} />
      </RowBetween>
      <Spacer size="sm" />
      <RowBetween>
        <Label size={16} weight={800} color="#38bf8c">
          {title}
        </Label>
      </RowBetween>
    </Container>
  )
}

const Team = ({ members }) => {
  return (
    <>
      <ColumnCenter>
        <Label text="Team" weight="800" size="42" />
        <Label weight="800" size="16" opacity="0.5" align="center">
          This is our team. We work very hard to provide
          <br /> awesome DeFi products for you
        </Label>
      </ColumnCenter>
      <Grid>
        {members.map((member, index) => {
          return (
            <PersonCard
              key={index}
              name={member?.full_name?.[0]?.text}
              profileLink={member?.social_media_accounts?.[0]?.text}
              title={member?.title?.[0]?.text}
              img={member?.profile_picture?.url}
              link={member?.social_media_accounts?.[0]?.spans?.[1]?.data?.url}
            />
          )
        })}
      </Grid>
    </>
  )
}

export default Team

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 3rem;
`
const Container = styled.div`
  width: 220px;
  height: 110px;
  padding: 27px 40px 29px 40px;
  display: flex;
  flex-direction: column;
  border-radius: 38px;
  margin: 15px 50px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 15px 25px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 20px;
    margin: 15px;
  `};
`
const Col = styled(Row)`
  flex-direction: column;
  justify-content: ${(props) => props.justify};
  align-items: end;
  max-width: ${(props) => props.maxWidth}px;
`

const Link = styled.a`
  opacity: 0.5;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.5;
  color: #212d63;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 0.5;
  }
`
const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: -2px;
`
