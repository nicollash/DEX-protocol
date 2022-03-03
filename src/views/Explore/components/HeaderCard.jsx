import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import Label from 'components/Label'
import Spacer from 'components/Spacer'
import StyledIconButton from 'components/StyledIconButton'

const Card = ({ id, src, title, text, onClick = () => {}, clickAble }) => {
  const history = useHistory()
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const handleCard = () => {
    onClick(id)
    history.push(`/explore/${id}?network=${networkName}`)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Container
      clickAble={clickAble}
      onClick={handleCard}
      style={{ cursor: 'pointer' }}
    >
      <img src={src} height="100" width="87" />
      <Spacer />
      <Label
        text={title}
        size="21"
        weight="800"
        style={{ marginBottom: '12px' }}
      />
      <Label
        text={text}
        size="14"
        weight="800"
        opacity="0.5"
        style={{ textAlign: 'center' }}
      />
      <Spacer size="lg" />
      <StyledIconButton
        block
        icon="arrow"
        variant="primary"
        style={{
          height: '38px',
          boxShadow: '0 18px 30px 0 rgba(50, 171, 125, 0.3)',
          width: '180px',
        }}
      >
        {'LEARN MORE'}
      </StyledIconButton>
    </Container>
  )
}

const HeaderCard = ({ filter, setFilter, collections, clickable = false }) => {
  return (
    <Grid filter={filter}>
      {Object.entries(collections ?? {}).map(([key, item]) => {
        if (filter === key) {
          return null
        }
        return (
          <Card
            key={key}
            src={item?.image?.url}
            title={item?.name}
            text={item?.short_description?.[0]?.text}
            onClick={setFilter}
            id={key}
            left={item?.name === 'Yield Farming' && '15'}
            clickAble={clickable}
          />
        )
      })}
    </Grid>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: ${(props) => (props.filter ? '60%' : '100%')};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  justify-content: space-evenly;
  width:100%
  `}
`

const Container = styled.div`
  width: ${(props) => (props.width ? '226' : '180')}px;
  min-height: 300px;
  display: flex;
  margin: 15px;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`
export default HeaderCard
