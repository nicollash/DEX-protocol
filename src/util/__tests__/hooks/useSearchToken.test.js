import useSearchToken from 'hooks/useSearchToken'
const { customRenderHook } = require('util/testUtils')

describe('useSearchToken testing', () => {
  test('Address should be in TokenList', async () => {
    const result = customRenderHook(useSearchToken)
    const tokens = await result.current.onGetToken(
      '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD'
    )

    expect(tokens?.[0]?.address).toMatch(
      '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD'
    )
  })

  test('Address should be in TokenList', async () => {
    const result = customRenderHook(useSearchToken)
    const tokens = await result.current.onGetToken(
      '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    )
    expect(tokens?.[0]?.address).toMatch(
      '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    )
  })

  test('Address should not be in TokenList', async () => {
    const result = customRenderHook(useSearchToken)
    const tokens = await result.current.onGetToken(
      '0xb305686e24a3326A09BD7dA18FDF215D4313864e'
    )
    expect(tokens?.[0]?.address).toBeUndefined()
  })
})
