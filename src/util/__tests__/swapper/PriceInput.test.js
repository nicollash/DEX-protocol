import { screen, fireEvent } from '@testing-library/dom'
import PriceInput, { BalanceContainer, MaxButton } from 'components/PriceInput'
import React from 'react'
import { render } from 'util/testUtils'

describe('PriceInput testing', () => {
  test('render PriceInput component', () => {
    const text = 'You Receive '
    const amount = 10
    const handleChangeAmount = () => {}
    const currency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    const toggle = () => {}
    const balance = 6.25
    const showMax = false
    render(
      <PriceInput
        text={text}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        currency={currency}
        toggle={toggle}
        balance={balance}
        showMax={showMax}
      />
    )

    const priceInput = screen.getByTestId('price-input')
    fireEvent.change(priceInput, { target: { value: 5 } })
    fireEvent.focus(priceInput)
    fireEvent.blur(priceInput)
  })

  test('text should be price', () => {
    const text = 'Price'
    const amount = 10
    const handleChangeAmount = () => {}
    const currency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    const toggle = () => {}
    const balance = 6.25
    const showMax = false
    render(
      <PriceInput
        text={text}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        currency={currency}
        toggle={toggle}
        balance={balance}
        showMax={showMax}
      />
    )
  })
  test('showMax should be true', () => {
    const text = 'You Receive'
    const amount = 10
    const handleChangeAmount = () => {}
    const currency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    const toggle = () => {}
    const balance = 6.25
    const showMax = true
    render(
      <PriceInput
        text={text}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        currency={currency}
        toggle={toggle}
        balance={balance}
        showMax={showMax}
      />
    )
  })

  test('render PriceInput component with null currency', () => {
    const text = 'You Receive'
    const amount = 10
    const handleChangeAmount = () => {}
    const currency = null
    const toggle = () => {}
    const balance = 6.25
    const showMax = true
    render(
      <PriceInput
        text={text}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        currency={currency}
        toggle={toggle}
        balance={balance}
        showMax={showMax}
      />
    )
  })

  test('Check PriceInput BalanceContainer component with less then 14 balance', () => {
    render(<BalanceContainer balance={5} />)
  })
  test('Check PriceInput BalanceContainer component with greater then 14 balance', () => {
    render(<BalanceContainer balance={15} />)
  })

  test('Check PriceInput MaxButton component', () => {
    render(<MaxButton>Max</MaxButton>)

    expect(screen.getByText('Max')).toHaveTextContent('Max')
  })
})
