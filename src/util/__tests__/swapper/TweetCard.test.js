import React from 'react'
import { ConnetWallet, render } from 'util/testUtils'
import { act } from 'react-dom/test-utils'
import { mockGetCoinById, mockGetTweetList } from 'util/mockApis'
import TweetCard from 'views/Swapper/components/TweetCard'

describe('Swap Tweet card', () => {
  test('render tweet card component', async () => {
    const token = {
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
      mockGetTweetList()
      render(<TweetCard token={token} />)
    })
  })
})
