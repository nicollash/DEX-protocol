import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { toEllipsis } from 'monox/util'
import useWindowSize from 'hooks/useWindowSize'
import { StyledModalWrapper, StyledModalBackdrop } from 'contexts/Modals/Modals'
import { saveToken } from 'state/users/actions'
import theme from 'theme'

import { CloseIcon } from 'components/IconButton'
import { RowBetween, Row } from 'components/Row'
import Label from 'components/Label'
import Spacer from 'components/Spacer'
import TokenImage from 'components/TokenImage'
import Checkbox from 'components/CheckBox'
import StyledIconButton from 'components/StyledIconButton'

import Warning from 'assets/img/alert-warning.svg'

const ImportTokenModal = ({ onDismiss, payload }) => {
  const { currrency, setCurrency, close } = payload
  const [checked, setChecked] = useState(false)
  const { width } = useWindowSize()
  const dispatch = useDispatch()

  let numCharsToHide = useMemo(() => {
    if (width < 960 && width > 720) {
      return 3
    } else if (width < 720 && width > 500) {
      return 6
    } else if (width < 500) {
      return 9
    }
    return 0
  }, [width])

  const handleConfirm = () => {
    dispatch(saveToken({ ...currrency, showWarning: false }))
    setCurrency(currrency)
    close()
    onDismiss()
  }

  return (
    <StyledModalWrapper>
      <StyledModalBackdrop style={{ display: 'flex' }}>
        <Div>
          <InnerWrapper>
            <RowParent>
              <Label size="16px" weight="800" text="Import Token" />
              <CloseIcon onClick={onDismiss} />
            </RowParent>
            <Spacer />
            <NewToken>
              <div>
                <Row style={{ marginBottom: '9px', flexWrap: 'wrap' }}>
                  <TokenImage
                    src={currrency?.logoURI}
                    letter={currrency?.symbol[0]}
                    width="24"
                    height="24"
                  />
                  <Label
                    text={currrency?.symbol}
                    size="15"
                    weight="800"
                    style={{ margin: '0 8px 0 10px' }}
                  />
                  <Label
                    text={currrency?.name}
                    size="15"
                    weight="800"
                    opacity="0.3"
                  />
                </Row>
                <Row style={{ textDecoration: 'underline' }}>
                  <Label
                    text={toEllipsis(currrency?.address, numCharsToHide)}
                    size="12"
                    weight="800"
                  />
                </Row>
              </div>
            </NewToken>
            <Spacer />
            <Spacer size="sm" />
            <TradeRisk>
              <div style={{ padding: '0 35px 0 30px' }}>
                <Label
                  text="Trade at your own risk !"
                  size="16"
                  weight="800"
                  color={theme.color.font.warning}
                  style={{ marginBottom: '6px' }}
                />
                <Label
                  text="Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects."
                  size="13"
                  weight="bold"
                  color={theme.color.font.warning}
                />
              </div>
              <img
                src={Warning}
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '-11px',
                }}
                alt="warning"
              />
            </TradeRisk>
            <CheckboxWrapper>
              <Checkbox
                label="I understand the risk"
                value={checked}
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            </CheckboxWrapper>
            <StyledIconButton
              block
              icon="arrow"
              variant="primary"
              disabled={!checked}
              onClick={handleConfirm}
            >
              Confirm
            </StyledIconButton>
          </InnerWrapper>
        </Div>
      </StyledModalBackdrop>
    </StyledModalWrapper>
  )
}

export default ImportTokenModal

const InnerWrapper = styled.div`
  margin: 40px 40px 50px 40px;
`
const CheckboxWrapper = styled.div`
  padding: 20px 0 35px 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 10px 0 20px 0;
   `}
`
const NewToken = styled.div`
  border-radius: 6px;
  background-color: rgb(65, 222, 162, 0.05);
  height: 92px;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  justify-content: center;
`

const TradeRisk = styled.div`
  border-left: 5px solid ${({ theme }) => theme.color.font.warning};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: #f4eded;
  height: 121px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: auto;
  padding:.5rem 0;
   `}
`

const Div = styled.div`
  margin: auto;
  background: ${({ theme }) => theme.color.background.main};

  border-radius: 39px;
  height: 524px;
  transform-origin: 0 100%;
  overflow: hidden;
  width: 450px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 400px
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 350px
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 300px
  `}
`

const RowParent = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    align-items: flex-start; 
  `}
`
