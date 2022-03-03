import { getEtherscanLink } from 'monox/util'

describe('EtherscanLink testing', () => {
  test('Get kovan token etherscan link', () => {
    expect(
      getEtherscanLink(
        42,
        '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        'token'
      )
    ).toMatch(
      'https://kovan.etherscan.io/token/0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    )
  })

  test('Get mumbai token etherscan link', () => {
    expect(
      getEtherscanLink(
        80001,
        '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        'token'
      )
    ).toMatch(
      'https://mumbai.polygonscan.com/token/0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    )
  })

  test('Get mainnet token etherscan link', () => {
    expect(
      getEtherscanLink(
        137,
        '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        'token'
      )
    ).toMatch(
      'https://polygonscan.com/token/0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    )
  })

  test('Get kovan transaction etherscan link', () => {
    expect(
      getEtherscanLink(
        42,
        '0x19e3b1ab0ba409f2ea511a47674981bfcee50aac5bf062222187eafcb32684c7',
        'transaction'
      )
    ).toMatch(
      'https://kovan.etherscan.io/tx/0x19e3b1ab0ba409f2ea511a47674981bfcee50aac5bf062222187eafcb32684c7'
    )
  })

  test('Get mainnet transaction etherscan link', () => {
    expect(
      getEtherscanLink(
        137,
        '0xe5a94dad0828950fc8cce4dfe0fa80f65519ff6079e5cc7219692d83e7eac0d7',
        'transaction'
      )
    ).toMatch(
      'https://polygonscan.com/tx/0xe5a94dad0828950fc8cce4dfe0fa80f65519ff6079e5cc7219692d83e7eac0d7'
    )
  })
  test('Get mumbai address etherscan link', () => {
    expect(
      getEtherscanLink(
        80001,
        '0x88a4d34b31908029f63a3e89d2757bef500f634a',
        'address'
      )
    ).toMatch(
      'https://mumbai.polygonscan.com/address/0x88a4d34b31908029f63a3e89d2757bef500f634a'
    )
  })
})
