const configStaging = {
  42: {
    NAME: 'Kovan',
    POOL_ADDRESS: '0x349E65D81E089835b1b7384D42FB67E14f367e83',
    SWAP_ADDRESS: '0x7182239cFBbED5bc082556Bf04F19e5c528AFF24',
    STAKING_ADDRESS: '0xe950d390680855f83955D78E82E03777A90b2ac6',
    WSS_URL:
      'wss://eth-kovan.ws.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    NETWORK_URL:
      'https://eth-kovan.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    WRAPPED_MAIN_ADDRESS: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    MAIN_CURRENCY: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0x48185db4870d97815D88Ce536208f817281db8f2',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0xaF6220E0B4A64Ee4b026d51d4D3026fBbeBd288d',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  },
  /*   1: {
    NAME: 'Ethereum',
    POOL_ADDRESS: '0x03Aa8B289482b32C82B0A4BbC66bF5aB99AF6E61',
    SWAP_ADDRESS: '0x2b3d4b96f8d50A1F4a34338BC19FcA3a7c45074d',
    STAKING_ADDRESS: '0x2da59156025432cd79fd7DA846f2de6996D68235',
    WSS_URL:
      'wss://eth-kovan.ws.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    NETWORK_URL:
      'https://eth-kovan.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    WRAPPED_MAIN_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    MAIN_CURRENCY: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0x2862366Bd212b4274a63fcF9ae8B77c5379419e3',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0x23301465bC80c04B3c240Ca37146BDa535Fca94F',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  }, */
  80001: {
    NAME: 'Mumbai',
    POOL_ADDRESS: '0x20C9560d42566D6eAd1DA3dC84137E84838Fa696',
    SWAP_ADDRESS: '0x3Ee97f2587414fF08DaE3977478a7CeAdaeee626',
    STAKING_ADDRESS: '0x1e54cDC2D0Fe75249aEa06e5dA71921864746D61',
    WSS_URL:
      'wss://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@ws-nd-311-035-380.p2pify.com',
    NETWORK_URL:
      'https://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@nd-311-035-380.p2pify.com',
    WRAPPED_MAIN_ADDRESS: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    MAIN_CURRENCY: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      chainId: 80001,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0x503CD7BDf992b587DdFBCF14826E68F4f1f73299',
      decimals: 18,
      chainId: 80001,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0xF7f180034148B8b2C92d19f25Fb6aA68D75b0a1c',
      decimals: 18,
      chainId: 80001,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  },
}

const configDevelopment = {
  42: {
    NAME: 'Kovan',
    POOL_ADDRESS: '0x45b8115235387b361E0E0783f5df0b5C432dCAB9',
    SWAP_ADDRESS: '0x16A2830D0BdD2775cB76a710668C5E36f5489633',
    STAKING_ADDRESS: '0x49dA259A710d2604692e47E4d248eeeE69e075d7',
    WSS_URL:
      'wss://eth-kovan.ws.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    NETWORK_URL:
      'https://eth-kovan.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    WRAPPED_MAIN_ADDRESS: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    MAIN_CURRENCY: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  },
  /*   1: {
    NAME: 'Ethereum',
    POOL_ADDRESS: '0x45b8115235387b361E0E0783f5df0b5C432dCAB9',
    SWAP_ADDRESS: '0x16A2830D0BdD2775cB76a710668C5E36f5489633',
    STAKING_ADDRESS: '0x49dA259A710d2604692e47E4d248eeeE69e075d7',
    WSS_URL:
      'wss://eth-kovan.ws.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    NETWORK_URL:
      'https://eth-kovan.alchemyapi.io/v2/_deZk8UGlnCSBl40BG8CPIzoOv48ZUto',
    WRAPPED_MAIN_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    MAIN_CURRENCY: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 1,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0xB33b311ED68A0e33B431ABd9daEdB218e78cFDe8',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  }, */
  80001: {
    NAME: 'Mumbai',
    POOL_ADDRESS: '0xcaF8C42d0494A6d46ea42DB94825ABabf159E84b',
    SWAP_ADDRESS: '0x08d78Af4fc3a59Da43C61c65f39D1a612816385c',
    STAKING_ADDRESS: '0xfc1095544CAAcC8E80247C66e41837A0dE82B93C',
    WSS_URL:
      'wss://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@ws-nd-311-035-380.p2pify.com',
    NETWORK_URL:
      'https://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@nd-311-035-380.p2pify.com',
    WRAPPED_MAIN_ADDRESS: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    MAIN_CURRENCY: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      chainId: 80001,
      status: 2,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    },
    vUSD: {
      name: 'vUSD',
      symbol: 'vUSD',
      address: '0x5920cEC0c3B5EF699979368cae7A2031BDD908D1',
      decimals: 18,
      chainId: 80001,
      logoURI:
        'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png',
    },
    MONO: {
      name: 'Mono',
      symbol: 'MONO',
      address: '0xaCc2c2306bC52f3D493221020791441858f94596',
      decimals: 18,
      chainId: 80001,
      logoURI:
        'https://user-images.githubusercontent.com/59371077/119623627-91482a00-be32-11eb-8160-954010ddbaac.png',
    },
  },
}

let config = configDevelopment
if (process.env.REACT_APP_DEV_ENV === 'staging') {
  config = configStaging
}
export default config
