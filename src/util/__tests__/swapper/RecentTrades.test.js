import React from 'react'
import { render } from 'util/testUtils'
import RecentTrades from 'views/Swapper/components/RecentTrades'
import { cleanup } from '@testing-library/react'

import { ConnetWallet } from 'util/testUtils'

describe('Swap recent trades', () => {
  afterEach(cleanup)

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
  test('render swap recent trades component', async () => {
    jest.setTimeout(30000)
    await ConnetWallet()
    render(<RecentTrades fromCurrency={fromCurrency} toCurrency={toCurrency} />)
  })
})
