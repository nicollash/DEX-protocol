import { screen, fireEvent, cleanup } from '@testing-library/dom'
import Input from 'components/Input'
import React from 'react'
import { render } from 'util/testUtils'

describe('Input testing', () => {
  test('render input with change event', async () => {
    render(
      <Input
        size="sm"
        placeholder="0.0"
        value={50}
        onChange={() => {}}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    )
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'DAI' } })
  })
  test('Input type is number', async () => {
    render(
      <Input
        size="sm"
        placeholder="0.0"
        value={50}
        type="number"
        onChange={() => {}}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    )
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '50,00' } })
  })

  test('Input focus is true', async () => {
    render(
      <Input
        size="sm"
        placeholder="0.0"
        value={50}
        onChange={() => {}}
        onFocus={() => {}}
        onBlur={() => {}}
        focus={true}
      />
    )
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '50,00' } })
  })
})
