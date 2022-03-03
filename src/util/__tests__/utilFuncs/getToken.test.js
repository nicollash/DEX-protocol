import { getToken } from 'monox/util'
import uniswapTokens from 'monox/uniswap_all_tokens_list'
import { uniqBy } from 'lodash'

const chainId = 42
const tokenList = uniqBy(
  uniswapTokens.tokens.filter((t) => t.chainId === chainId),
  'address'
)
describe('Token testing', () => {
  test('get token by symbol', () => {
    expect(getToken('DAI', tokenList).symbol).toMatch('DAI')
  })

  test('get token by address', () => {
    expect(
      getToken('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', tokenList).address
    ).toMatch('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa')
  })
})
