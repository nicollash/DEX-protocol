import { fireEvent, screen } from '@testing-library/dom'
import React from 'react'
import { ConnetWallet, customRenderHook, render } from 'util/testUtils'
import CurrencySelector from 'views/Swapper/components/CurrencySelector'
import { act } from 'react-dom/test-utils'
import { cleanup } from '@testing-library/react'
import { useDispatch } from 'react-redux'
import { saveFilteredTokens } from 'state/tokens/actions'
import { mockGetPoolList, mockGetContributedPoolList } from 'util/mockApis'

describe('Currency selector', () => {
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
  const currencies = [
    {
      address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'Dai Stablecoin',
      notInList: false,
      status: 1,
      symbol: 'DAI',
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chainId: 42,
      decimals: 18,
      logoURI:
        'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
      name: 'Uniswap',
      notInList: false,
      status: 1,
      symbol: 'UNI',
    },
  ]
  test('render currency selector component', async () => {
    await act(async () => {
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetContributedPoolList()
      mockGetPoolList()
      const dispatch = customRenderHook(useDispatch)
      dispatch.current(saveFilteredTokens({ chainId: 42, tokens: currencies }))
      render(
        <CurrencySelector
          setCurrency={() => {}}
          setIsDropdown={() => {}}
          swapSelector={true}
          selected={[fromCurrency, toCurrency]}
          onDismiss={() => {}}
        />
      )
    })
  })

  test('check currency selector search bar', async () => {
    await act(async () => {
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetContributedPoolList()
      mockGetPoolList()
      const dispatch = customRenderHook(useDispatch)
      dispatch.current(saveFilteredTokens({ chainId: 42, tokens: currencies }))
      render(
        <CurrencySelector
          setCurrency={() => {}}
          setIsDropdown={() => {}}
          swapSelector={true}
          selected={[fromCurrency, toCurrency]}
          onDismiss={() => {}}
        />
      )
    })

    const input = screen.getByTestId('search-bar')
    fireEvent.change(input, { target: { value: '' } })

    fireEvent.change(input, { target: { value: 'D' } })

    fireEvent.blur(input)
    fireEvent.focus(input)
  })

  test('render currency selector component without currencies', async () => {
    await act(async () => {
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetContributedPoolList()
      const dispatch = customRenderHook(useDispatch)
      dispatch.current(saveFilteredTokens({ chainId: 42, tokens: currencies }))
      render(
        <CurrencySelector
          setCurrency={() => {}}
          setIsDropdown={() => {}}
          swapSelector={true}
          selected={[]}
          onDismiss={() => {}}
        />
      )
    })
  })

  test('select currency from currency selector', async () => {
    await act(async () => {
      jest.setTimeout(10000)
      await ConnetWallet()
      mockGetContributedPoolList()
      mockGetPoolList()
      const dispatch = customRenderHook(useDispatch)
      dispatch.current(saveFilteredTokens({ chainId: 42, tokens: currencies }))
      render(
        <CurrencySelector
          setCurrency={() => {}}
          setIsDropdown={() => {}}
          swapSelector={true}
          selected={[fromCurrency, toCurrency]}
          onDismiss={() => {}}
        />
      )
    })
    const currencyContainer = screen.getByTestId('currency-container-0')
    fireEvent.click(currencyContainer)
  })
})
