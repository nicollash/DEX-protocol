import { getTokenMetaFromAddress } from 'monox/util'

describe('getTokenMetaFromAddress testing', () => {
  test('Get token meta from address', () => {
    expect(
      getTokenMetaFromAddress('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa')
        .address
    ).toMatch('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa')
  })

  test('Get token meta from address', () => {
    expect(
      getTokenMetaFromAddress('0x4F96Fe3b7A7af9725f59d353F723c1bDb64CA6Aa')
        ?.address
    ).toBeUndefined()
  })
})
