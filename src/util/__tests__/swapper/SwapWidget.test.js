import SwapWidget from 'views/Swapper/components/SwapWidget.jsx'
import { render } from 'util/testUtils'
import React from 'react'

describe('Swap Widget', () => {
  test('render Swap Widget component', () => {
    const toPoolData = {
      0: '0',
      1: '0',
      2: '0x0000000000000000000000000000000000000000',
      3: '0',
      4: '0',
      5: '0',
      6: '0',
      7: '0',
      lastPoolValue: '0',
      pid: '0',
      price: '0',
      status: '0',
      token: '0x0000000000000000000000000000000000000000',
      tokenBalance: '0',
      vusdCredit: '0',
      vusdDebt: '0',
    }
    const fromPoolData = {
      0: '0',
      0: '7',
      1: '953497819393725153117907',
      2: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      3: '1',
      4: '0',
      5: '11560191816207460737113',
      6: '794731601597926824786',
      7: '1199770791092077415294',
      lastPoolValue: '953497819393725153117907',
      pid: '7',
      price: '1199770791092077415294',
      status: '1',
      token: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      tokenBalance: '794731601597926824786',
      vusdCredit: '11560191816207460737113',
      vusdDebt: '0',
    }
    const toAmount = 1194.972494
    const fromAmount = 1
    const fromToken = {
      address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
    }
    const toToken = {
      address: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
      name: 'vUSD',
      symbol: 'vUSD',
    }
    render(
      <SwapWidget
        fromToken={fromToken}
        fromPoolData={fromPoolData}
        toPoolData={toPoolData}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
    )
  })

  test('Swap Widget should be allow blank data', () => {
    const toPoolData = {}
    const fromPoolData = {}
    const toAmount = 1194.972494
    const fromAmount = 1
    const fromToken = { address: '' }
    const toToken = { address: '' }
    render(
      <SwapWidget
        fromToken={fromToken}
        fromPoolData={fromPoolData}
        toPoolData={toPoolData}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
    )
  })

  test('Price impact greater than or equal 100', () => {
    const toPoolData = {
      0: '0',
      1: '0',
      2: '0x0000000000000000000000000000000000000000',
      3: '0',
      4: '0',
      5: '0',
      6: '0',
      7: '0',
      lastPoolValue: '0',
      pid: '0',
      price: '1199770791092077415294',
      status: '0',
      token: '0x0000000000000000000000000000000000000000',
      tokenBalance: '0',
      vusdCredit: '0',
      vusdDebt: '0',
    }
    const fromPoolData = {
      0: '0',
      0: '7',
      1: '953497819393725153117907',
      2: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      3: '1',
      4: '0',
      5: '11560191816207460737113',
      6: '794731601597926824786',
      7: '1199770791092077415294',
      lastPoolValue: '953497819393725153117907',
      pid: '7',
      price: '1199770791092077415294',
      status: '1',
      token: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      tokenBalance: '794731601597926824786',
      vusdCredit: '11560191816207460737113',
      vusdDebt: '0',
    }
    const toAmount = -20
    const fromAmount = 500
    const toToken = {
      address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
    }
    const fromToken = {
      address: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
      name: 'vUSD',
      symbol: 'vUSD',
    }
    render(
      <SwapWidget
        fromToken={fromToken}
        fromPoolData={fromPoolData}
        toPoolData={toPoolData}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
    )
  })
})
