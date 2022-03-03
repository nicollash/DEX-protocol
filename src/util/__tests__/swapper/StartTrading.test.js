import { screen } from '@testing-library/dom'
import React from 'react'
import { render } from 'util/testUtils'
import StartTrading from 'views/Swapper/components/StartTrading'

describe('Swap StartTrading', () => {
  test('render StartTrading component', () => {
    const fromCurrency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    const toCurrency = {
      address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
    }
    const toAmount = 5
    const fromAmount = 7
    render(
      <StartTrading
        toCurrency={toCurrency}
        fromCurrency={fromCurrency}
        toAmount={toAmount}
        fromAmount={fromAmount}
      />
    )
  })
  test('render StartTrading component with null data', () => {
    const toCurrency = {}
    const fromCurrency = {}
    const fromAmount = 0
    const toAmount = 0
    render(
      <StartTrading
        toCurrency={toCurrency}
        fromCurrency={fromCurrency}
        toAmount={toAmount}
        fromAmount={fromAmount}
      />
    )
  })
})
