import { tokenSymbol } from 'monox/util'
import config from 'monox/config'

describe('Token Symbol testing', () => {
  const data = config[42]
  test('Check token symbol 1', () => {
    const currency = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      symbol: 'UNI',
    }
    expect(
      tokenSymbol(currency, data.WRAPPED_MAIN_ADDRESS, data.MAIN_CURRENCY)
    ).toMatch('UNI')
  })

  test('Check token symbol 2', () => {
    expect(
      tokenSymbol(
        { address: data.WRAPPED_MAIN_ADDRESS },
        data.WRAPPED_MAIN_ADDRESS,
        data.MAIN_CURRENCY
      )
    ).toMatch('WETH')
  })
})
