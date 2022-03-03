import { fireEvent, screen } from '@testing-library/dom'
import React from 'react'
import { ConnetWallet, render } from 'util/testUtils'
import ExchangeWith from 'views/Swapper/components/ExchangeWith'
import { mockGetPoolList } from 'util/mockApis'
import { act } from 'react-dom/test-utils'

describe('Swap ExchangeWith', () => {
  test('render ExchangeWith with null from currency', async () => {
    await act(async () => {
      const fromCurrency = null
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetPoolList()
      render(
        <ExchangeWith
          fromCurrency={fromCurrency}
          setToCurrency={() => {}}
          setFromCurrency={() => {}}
          setIsDropdown={() => {}}
        />
      )
    })
    const container = screen.getByTestId('container-0')
    fireEvent.click(container)
  })

  test('render ExchangeWith component', async () => {
    await act(async () => {
      const fromCurrency = {
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        chainId: 42,
        decimals: 18,
        logoURI:
          'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
        name: 'Uniswap',
        symbol: 'UNI',
      }
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetPoolList()
      render(
        <ExchangeWith
          fromCurrency={fromCurrency}
          setToCurrency={() => {}}
          setFromCurrency={() => {}}
          setIsDropdown={() => {}}
        />
      )
    })
    const container = screen.getByTestId('container-0')
    fireEvent.click(container)

    const chevronContainer = screen.getByTestId('chevron-container')
    fireEvent.click(chevronContainer)
  })
})
