import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

export const Row = styled(Box)`
  width: 100%;
  display: flex;
  padding: 0;
  justify-content: flex-start;
  align-items: center;
`

export const RowClickable = styled(Row)`
  cursor: pointer;
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowCenter = styled(Row)`
  justify-content: center;
`

export const RowHomePage = styled(Row)`
  margin-left: 50px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: center;
  margin-left: 0;
  `};
`
export const RowFixed = styled(Row)`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
  display: flex;
  align-items: center;
`
export const RowInput = styled(Row)`
  box-shadow: inset -8px -8px 20px 0 #ffffff, inset 8px 8px 20px 0 #d0d8e6;
  border-radius: 50px;
  height: 50px;
  align-items: center;
  padding: 0 11px 0 30px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-left: 20px;
  `}
`
