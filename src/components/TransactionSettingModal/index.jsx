import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { RowBetween, Row } from 'components/Row'
import Divider from 'components/Divider'
import Label from 'components/Label'
import Input from 'components/Input'
import Spacer from 'components/Spacer'
import QuestionHelper from 'components/QuestionHelper'
import { CloseIcon } from 'components/IconButton'
import Modal from 'components/Modal'
import StyledIconButton from 'components/StyledIconButton'

const preDefinedValues = [0.1, 0.5, 1]

const TransactionSettingModal = ({
  tolerance,
  setTolerance,
  setDeadline,
  initDeadline,
  onDismiss,
}) => {
  const [focus, setFocus] = useState('')
  const [tempTolerance, setTempTolerance] = useState(tolerance)
  const [tempDeadline, setTempDeadline] = useState(initDeadline)

  const warningTolerance = useMemo(() => {
    if (tempTolerance > 5) {
      return 'Your transaction may be frontrun'
    }
    return ''
  }, [tempTolerance])

  const warningDeadline = useMemo(() => {
    if (tempDeadline && tempDeadline < 1) {
      setTimeout(function () {
        setTempDeadline(20)
      }, 2500)
      return 'Your transaction may fail if the deadline is less than one minute'
    }

    return ''
  }, [tempDeadline])

  const handleTolerance = (value) => {
    if (typeof value == 'number') {
      setTempTolerance(value)
      return
    }
    if (!value || value?.match(/^\d{0,}(\.\d{0,10})?$/)) {
      if (value === '.') {
        setTempTolerance(value)
      } else if (value && value.slice(-1) === '.') {
        setTempTolerance(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        setTempTolerance(value)
      }
    }
  }

  const handleInputChange = (evt) => {
    const value = evt.target.value
    if (typeof value == 'number') {
      setTempDeadline(value)
      return
    }
    if (!value || value?.match(/^\d{0,}(\.\d{0,10})?$/)) {
      if (value === '.') {
        setTempDeadline(value)
      } else if (value && value.slice(-1) === '.') {
        setTempDeadline(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        setTempDeadline(value)
      }
    }
  }

  const handleConfirm = () => {
    setDeadline(tempDeadline)
    setTolerance(tempTolerance)
    onDismiss()
  }

  return (
    <Modal>
      <RowBetween>
        <Label
          weight={800}
          size={16}
          text="
            Transaction Settings"
        />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <Spacer size="md" />
      <Divider />
      <Spacer size="md" />
      <Row>
        <Label weight={800} size={14} text="Slippage Tolerance" />
        <QuestionHelper
          id="tolerance"
          text=" Your transaction will revert if the price changes unfavorably by more than this percentage"
        />
      </Row>
      <InputRow>
        {preDefinedValues.map((item) => {
          return (
            <StyledValueSelector
              key={item}
              active={item === tempTolerance}
              onClick={() => handleTolerance(item)}
            >
              {item}%
            </StyledValueSelector>
          )
        })}
        <RowInputSmall focus={focus === 'tolerance'}>
          <Input
            placeholder={tempTolerance.toString()}
            value={tempTolerance}
            type="number"
            onChange={(e) => handleTolerance(e.target.value)}
            onFocus={() => setFocus('tolerance')}
            onBlur={() => setFocus('')}
            style={{ marginLeft: '15px' }}
          />
          <Label
            text="%"
            weight={800}
            size={12}
            style={{ marginRight: '15px' }}
          />
        </RowInputSmall>
      </InputRow>
      {tempTolerance <= 0 && (
        <Label
          text="Your transaction may fail"
          size={12}
          color="#f3851e"
          style={{ marginTop: 10 }}
        />
      )}
      <Label
        text={warningTolerance}
        size={12}
        color="#f3851e"
        style={{ marginTop: 10 }}
      />
      <Spacer size="md" />
      <Row>
        <Label weight={800} size={14} text="Transaction Deadline" />
        <QuestionHelper
          id="deadline"
          text=" Your transaction will revert if it is pending for more than this long."
        />
      </Row>
      <RowInput focus={focus === 'deadline'}>
        <Input
          placeholder={'20'}
          value={tempDeadline}
          type="number"
          onChange={handleInputChange}
          onFocus={() => setFocus('deadline')}
          onBlur={() => setFocus('')}
          style={{ marginLeft: '30px' }}
        />
        <Label
          text="minutes"
          opacity={0.5}
          weight={800}
          size={14}
          style={{ marginRight: '30px' }}
        />
      </RowInput>
      <Label
        text={warningDeadline}
        size={12}
        color="#f3851e"
        style={{ marginBottom: 10 }}
      />
      <Spacer size="md" />
      <StyledIconButton
        block
        icon="arrow"
        disabled={tempTolerance <= 0}
        variant="primary"
        onClick={handleConfirm}
      >
        {tempTolerance <= 0
          ? 'Slippage tolerance cannot be 0'
          : 'Save Settings'}
      </StyledIconButton>
      <Spacer size="sm" />
    </Modal>
  )
}

export default TransactionSettingModal

const InputRow = styled(RowBetween)`
  margin-top: 18px;
  flex-wrap: wrap;
`
const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 50px;
  align-items: center;
  margin-top: 15px;
  ${(props) => props.focus && props.theme.inputFocusBorder}
  input {
    padding: 0;
  }
`

const RowInputSmall = styled(RowInput)`
  height: 50px;
  height: 40px;
  width: 145px;
  margin-top: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: 15px;
  width: 100%
  `}
`

const StyledValueSelector = styled.div`
  cursor: pointer;
  width: 50px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  :hover {
    color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
  ${(props) =>
    props.active
      ? `
    color:${props.theme.color.primary.main};
    pointer-events:none;
   box-shadow: ${props.theme.shadows.inset}`
      : `box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff, -1px -1px 3px 0 #ffffff;
    background-color: ${props.theme.color.background.main};`}
`
