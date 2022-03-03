import React from 'react'
import { ConnetWallet, render } from 'util/testUtils'
import SwapperCard from 'views/Swapper/components/SwapperCard'
import { Route, MemoryRouter } from 'react-router'
import { fireEvent, screen } from '@testing-library/dom'
import { act } from 'react-dom/test-utils'
import { cleanup } from '@testing-library/react'
import { mockGetContributedPoolList } from 'util/mockApis'

describe('Swapper card', () => {
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
  const toPoolData = {
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
  const fromPoolData = {
    0: '7',
    1: '953497819393725153117907',
    2: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    3: '1',
    4: '0',
    5: '9184254640495124069211',
    6: '796718168170252414284',
    7: '1196788261097232217675',
    lastPoolValue: '953497819393725153117907',
    pid: '7',
    price: '1196788261097232217675',
    status: '1',
    token: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    tokenBalance: '796718168170252414284',
    vusdCredit: '9184254640495124069211',
    vusdDebt: '0',
  }

  const toPoolData2 = {
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
    status: '0',
    token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    tokenBalance: '4246589808794285237',
    vusdCredit: '101700182988731749883468',
    vusdDebt: '0',
  }
  const fromPoolData2 = {
    0: '7',
    1: '953497819393725153117907',
    2: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    3: '1',
    4: '0',
    5: '9184254640495124069211',
    6: '796718168170252414284',
    7: '1196788261097232217675',
    lastPoolValue: '953497819393725153117907',
    pid: '7',
    price: '1196788261097232217675',
    status: '0',
    token: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    tokenBalance: '796718168170252414284',
    vusdCredit: '9184254640495124069211',
    vusdDebt: '0',
  }

  test('render swapper card component and check swap ', async () => {
    await ConnetWallet()
    jest.setTimeout(50000)
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/UNI/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={true}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={false}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const Swap = screen.getByTestId('swap-icon')
      fireEvent.click(Swap)
    })
    cleanup()
  })

  test('render swapper card component with eth fromCurrrency', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/MATIC']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={false}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      cleanup()
    })
  })

  test('check weth and matic currency', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/WETH/WMATIC']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={false}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
    })
    cleanup()
  })

  test('check matic and eth currency ', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/MATIC/ETH']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={false}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
    })
    cleanup()
  })

  test('check dummy addresses', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/test2/test']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={{}}
              setToCurrency={() => {}}
              fromCurrency={{}}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
    })
    cleanup()
  })

  test('Check fromPrice input', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const fromPriceInput = screen.getByTestId('from-price-input')
      fireEvent.change(fromPriceInput, { target: { value: 8 } })

      fireEvent.change(fromPriceInput, { target: { value: '.' } })

      fireEvent.change(fromPriceInput, { target: { value: '20.' } })
    })
    cleanup()
  })

  test('Check fromPrice input after toggle', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={null}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const fromToggle = screen.getByTestId('from-toggle')
      fireEvent.click(fromToggle)

      const fromPriceInput = screen.getByTestId('from-price-input')
      fireEvent.change(fromPriceInput, { target: { value: 8 } })
    })
    cleanup()
  })

  test('Check fromPrice input without fromCurrency', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={null}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const fromPriceInput = screen.getByTestId('from-price-input')
      fireEvent.change(fromPriceInput, { target: { value: 8 } })
    })
    cleanup()
  })

  test('Check toPrice input', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const toPriceInput = screen.getByTestId('to-price-input')
      fireEvent.change(toPriceInput, { target: { value: 5 } })

      fireEvent.change(toPriceInput, { target: { value: '.' } })

      fireEvent.change(toPriceInput, { target: { value: '25.' } })

      const toToggle = screen.getByTestId('to-toggle')
      fireEvent.click(toToggle)
    })
    cleanup()
  })

  test('Check fromPrice input with pool status 0', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData2}
              toPoolData={toPoolData2}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const fromPriceInput = screen.getByTestId('from-price-input')
      fireEvent.change(fromPriceInput, { target: { value: '8' } })
    })
    cleanup()
  })

  test('Check toPool status is 0', async () => {
    await ConnetWallet()
    mockGetContributedPoolList()
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/swap/ETH/DAI']}>
          <Route path="/swap/:address1/:address2">
            <SwapperCard
              toCurrency={toCurrency}
              setToCurrency={() => {}}
              fromCurrency={fromCurrency}
              setFromCurrency={() => {}}
              isSwapped={false}
              setIsSwapped={() => {}}
              isDropdown={false}
              setIsDropdown={() => {}}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData2}
              price={50}
              loading={true}
              initialFetch={true}
            />
          </Route>
        </MemoryRouter>
      )
      const fromPriceInput = screen.getByTestId('from-price-input')
      fireEvent.change(fromPriceInput, { target: { value: 8 } })
    })
    cleanup()
  })
})
