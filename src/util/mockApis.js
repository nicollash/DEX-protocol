import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

mock.axiosInstance.defaults.baseURL = 'https://api.monox.finance/'

export const mockGetContributedPoolList = () =>
  mock
    .onGet('kovan/pools/active/0xA30094bb40d60A87E14D1F9c6c6A304644810eC2')
    .reply(200, {
      result: true,
      response: [
        {
          length: '18',
          name: 'Wrapped Ether',
          pid: 3,
          symbol: 'WETH',
          token: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
        },
      ],
    })

export const mockGetPoolList = () =>
  mock.onGet('kovan/pools').reply(200, {
    result: true,
    response: [
      {
        lastPoolValue: '93900000000000000000000000',
        pid: 3,
        price: '100000001284630159539',
        status: 1,
        token: '0x1874FB7dc8eba176bD190b530de752BDeDd1E49F',
        tokenBalance: '938999988037325941614629',
        vusdCredit: '1198097561261008696',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '27975000000000000000000000',
        pid: 4,
        price: '100000000000000000000',
        status: 1,
        token: '0xcb333c217dCA8Cdc54a0130c6ebc5bcb73379d4c',
        tokenBalance: '279750000000000000000000',
        vusdCredit: '0',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '27655000000000000000000000',
        pid: 4,
        price: '110000000000000000000',
        status: 1,
        token: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        tokenBalance: '276550000000000000000000',
        vusdCredit: '0',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '27975000000000000000000000',
        pid: 4,
        price: '100000000000000000000',
        status: 1,
        token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        tokenBalance: '279750000000000000000000',
        vusdCredit: '0',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '98562000000000000000000000',
        pid: 4,
        price: '100000000000000000000',
        status: 1,
        token: '0x2Eb78c861a5a44036ddA06DE54D38E8F14FC95eA',
        tokenBalance: '985620000000000000000000',
        vusdCredit: '0',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '200000000000000000000000000',
        pid: 199,
        price: '20000000000000000000',
        status: 1,
        token: '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD',
        tokenBalance: '10000000000000000000000000',
        vusdCredit: '0',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '82500000000000000000000000',
        pid: 314,
        price: '1000000004842163255722',
        status: 1,
        token: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
        tokenBalance: '82499999600551532930770',
        vusdCredit: '400079489335833840',
        vusdDebt: '0',
      },
      {
        lastPoolValue: '137482991170923913172776993',
        pid: 165,
        price: '1000073644866761921',
        status: 1,
        token: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
        tokenBalance: '137472866999950322544969043',
        vusdCredit: '10141095485864492436997',
        vusdDebt: '0',
      },
    ],
  })

export const mockGetCoinById = () =>
  mock
    .onGet(
      '/kovan/tweet_coingecko/coin/ethereum/contract/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    )
    .reply(200, {
      id: 'uniswap',
      symbol: 'uni',
      name: 'Uniswap',
      asset_platform_id: 'ethereum',
      links: {
        twitter_screen_name: 'TestTweets',
      },
      platforms: {
        ethereum: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        'binance-smart-chain': '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
        'huobi-token': '0x22c54ce8321a4015740ee1109d9cbc25815c46e6',
        'polygon-pos': '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
        'harmony-shard-0': '0x90d81749da8867962c760414c1c25ec926e889b6',
        xdai: '0x4537e328bf7e4efa29d05caea260d7fe26af9d74',
      },
      block_time_in_minutes: 0,
      hashing_algorithm: null,
      categories: [
        'Decentralized Exchange Token (DEX)',
        'Automated Market Maker (AMM)',
        'Yield Farming',
        'Decentralized Finance (DeFi)',
        'Governance',
        'Exchange-based Tokens',
      ],
      country_origin: '',
      genesis_date: null,
      contract_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      sentiment_votes_up_percentage: 59.8,
      sentiment_votes_down_percentage: 40.2,
      market_cap_rank: 11,
      coingecko_rank: 150,
      coingecko_score: 40.617,
      developer_score: 0.0,
      community_score: 45.753,
      liquidity_score: 68.292,
      public_interest_score: 1.178,
      market_data: {
        current_price: {
          usd: 14.77,
        },
        total_value_locked: { btc: 117940, usd: 3507024754 },
        mcap_to_tvl_ratio: 2.19,
        fdv_to_tvl_ratio: 4.21,
        roi: null,
        ath: {
          usd: 44.92,
        },
        ath_change_percentage: {
          usd: -67.29197,
        },
        ath_date: {
          usd: '2021-05-03T05:25:04.822Z',
        },
        atl: {
          usd: 1.03,
        },
        atl_change_percentage: {
          usd: 1326.153,
        },
        market_cap: {
          usd: 7678540201,
        },
        market_cap_rank: 11,
        total_volume: {
          usd: 313242664,
        },
        high_24h: {
          usd: 16.39,
        },
        low_24h: {
          usd: 14.57,
        },
        price_change_24h: -1.615113012969,
        price_change_percentage_24h: -9.85718,
        price_change_percentage_7d: -24.83612,
        price_change_percentage_14d: -26.98061,
        price_change_percentage_30d: -25.74431,
        price_change_percentage_60d: -43.85945,
        price_change_percentage_200d: 185.62777,
        price_change_percentage_1y: 0.0,
        market_cap_change_24h: -776105035.08416,
        market_cap_change_percentage_24h: -9.17963,
        price_change_24h_in_currency: {
          usd: -1.615113012969,
        },
        price_change_percentage_1h_in_currency: {
          usd: 0.8389,
        },
        price_change_percentage_24h_in_currency: {
          usd: -9.85718,
        },
        price_change_percentage_1y_in_currency: {},
        market_cap_change_24h_in_currency: {
          usd: -776105035.0841646,
        },
        market_cap_change_percentage_24h_in_currency: {
          usd: -9.17963,
        },
        total_supply: 1000000000.0,
        max_supply: 1000000000.0,
        circulating_supply: 519857388.1320768,
        last_updated: '2021-07-20T11:17:53.911Z',
      },
    })

export const mockGetAllTokenLiquidity = () =>
  mock.onGet('/kovan/metrics').reply(200, {
    result: true,
    response: [
      {
        liquidity_amount_volume: '0',
        mid: 4201,
        price_change: '0',
        token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        token_name: 'Uniswap',
        token_symbol: 'UNI',
        token_volume: '0',
      },
      {
        liquidity_amount_volume: '0',
        mid: 4202,
        price_change: '0',
        token: '0x8653506f398C2c3376Ef0B7764611f31edA955Ad',
        token_name: 'DZCOIN',
        token_symbol: 'DZ',
        token_volume: '0',
      },
      {
        liquidity_amount_volume: '0',
        mid: 4257,
        price_change: '0',
        token: '0xF18ADf345230eCA5989BF1F76469d9Aa572Dd1bA',
        token_name: 'BLAHBLAHTOKEN',
        token_symbol: 'TOKENBLAH',
        token_volume: '0',
      },
    ],
  })

export const mockGetTweetList = () =>
  mock.onGet('/twitter/tweets/tweet/channel/TestTweets/size/20').reply(200, {
    result: true,
    number_of_elements: 20,
    response: [
      {
        id: 1415792986877747200,
        id_str: '1415792986877747203',
        conversation_id: '1415790209720066054',
        datetime: '2021-07-15 21:58:46 UTC',
        datestamp: '2021-07-15',
        timestamp: '21:58:46',
        user_id: 984188226826010600,
        user_id_str: '984188226826010624',
        username: 'uniswap',
        name: 'Uniswap Labs 🦄',
        place: '',
        timezone: '+0000',
        mentions: [],
        reply_to: [
          {
            screen_name: 'KaseemBristow',
            name: 'kaseem.eth',
            id: '18431630',
          },
        ],
        urls: [],
        photos: [],
        video: 0,
        thumbnail: '',
        tweet: '@KaseemBristow Better late than never?',
        lang: 'en',
        hashtags: [],
        cashtags: [],
        replies_count: 2,
        retweets_count: 0,
        likes_count: 20,
        link: 'https://twitter.com/Uniswap/status/1415792986877747203',
        retweet: false,
        retweet_id: '',
        retweet_date: '',
        user_rt: '',
        user_rt_id: '',
        quote_url: '',
        near: '',
        geo: '',
        source: '',
        translate: '',
        trans_src: '',
        trans_dest: '',
      },
      {
        id: 1415779080084000800,
        id_str: '1415779080084000781',
        conversation_id: '1415778115423555591',
        datetime: '2021-07-15 21:03:31 UTC',
        datestamp: '2021-07-15',
        timestamp: '21:03:31',
        user_id: 984188226826010600,
        user_id_str: '984188226826010624',
        username: 'uniswap',
        name: 'Uniswap Labs 🦄',
        place: '',
        timezone: '+0000',
        mentions: [],
        reply_to: [
          {
            screen_name: 'mikedemarais',
            name: 'lilnasx.eth',
            id: '14253911',
          },
          {
            screen_name: 'haydenzadams',
            name: 'Hayden Adams 🦄',
            id: '702654540387127296',
          },
        ],
        urls: [],
        photos: [],
        video: 0,
        thumbnail: '',
        tweet: '@mikedemarais @haydenzadams 🦄💜🌈',
        lang: 'und',
        hashtags: [],
        cashtags: [],
        replies_count: 2,
        retweets_count: 0,
        likes_count: 6,
        link: 'https://twitter.com/Uniswap/status/1415779080084000781',
        retweet: false,
        retweet_id: '',
        retweet_date: '',
        user_rt: '',
        user_rt_id: '',
        quote_url: '',
        near: '',
        geo: '',
        source: '',
        translate: '',
        trans_src: '',
        trans_dest: '',
      },
    ],
  })
