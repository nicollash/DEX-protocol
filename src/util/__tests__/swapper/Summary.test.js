import React from 'react'
import { ConnetWallet, render } from 'util/testUtils'
import Summary from 'views/Swapper/components/Summary'
import { act } from 'react-dom/test-utils'
import { mockGetCoinById, mockGetAllTokenLiquidity } from 'util/mockApis'

describe('Swap Summary', () => {
  jest.mock('axios')
  afterEach(() => {
    jest.clearAllMocks()
  })

  const ENV = {
    REACT_APP_PRISMIC_TOKEN:
      'MC5ZSUVuVGhBQUFDZ0FIRzRW.77-977-977-977-977-9N--_ve-_ve-_vXDvv71OJ--_vTfvv73vv73vv71K77-977-9Dnrvv71Z77-9N0U677-9Ye-_vQ',
    REACT_APP_PRISMIC_API_ENDPOINT: 'https://monox.cdn.prismic.io/api/v2',
  }
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
  })

  afterAll(() => {
    process.env = ENV
  })

  test('render Swap summary component', async () => {
    const toPool = {
      0: '2',
      1: '138147485958683189052924',
      2: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      3: '1',
      4: '0',
      5: '101700182988731749883468',
      6: '4246589808794285237',
      7: '31311138200349656464347',
      lastPoolValue: '138147485958683189052924',
      pid: '2',
      price: '31311138200349656464347',
      status: '1',
      token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      tokenBalance: '4246589808794285237',
      vusdCredit: '101700182988731749883468',
      vusdDebt: '0',
    }
    const currency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    await act(async () => {
      await ConnetWallet()
      mockGetCoinById()
      mockGetAllTokenLiquidity()
      render(<Summary currency={currency} toPool={toPool} />)
    })
  })

  test('render Swap summary component without currency', async () => {
    const toPool = {
      0: '2',
      1: '138147485958683189052924',
      2: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      3: '1',
      4: '0',
      5: '101700182988731749883468',
      6: '4246589808794285237',
      7: '31311138200349656464347',
      lastPoolValue: '138147485958683189052924',
      pid: '2',
      price: '31311138200349656464347',
      status: '1',
      token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      tokenBalance: '4246589808794285237',
      vusdCredit: '101700182988731749883468',
      vusdDebt: '0',
    }
    const currency = {}
    await act(async () => {
      await ConnetWallet()
      mockGetCoinById()
      mockGetAllTokenLiquidity()
      render(<Summary currency={currency} toPool={toPool} />)
    })
  })

  test('render Swap summary component with vUSD currency', async () => {
    const toPool = {
      0: '2',
      1: '138147485958683189052924',
      2: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      3: '1',
      4: '0',
      5: '101700182988731749883468',
      6: '4246589808794285237',
      7: '31311138200349656464347',
      lastPoolValue: '138147485958683189052924',
      pid: '2',
      price: '31311138200349656464347',
      status: '1',
      token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      tokenBalance: '4246589808794285237',
      vusdCredit: '101700182988731749883468',
      vusdDebt: '0',
    }
    const currency = {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
      decimals: 18,
      chainId: 42,
      logoURI: '',
    }
    await act(async () => {
      await ConnetWallet()
      mockGetCoinById()
      mockGetAllTokenLiquidity()
      render(<Summary currency={currency} toPool={toPool} />)
    })
  })
})
