import { formatAmount } from 'monox/util'

describe('formatAmount testing', () => {
  test('Check amount formate 1', () => {
    expect(formatAmount('1000000000000', 15)).toMatch('1,000,000,000,000')
  })

  test('Check amount formate 2', () => {
    expect(formatAmount('987112564956451', 10)).toMatch('987,112,564,956,451')
  })
})
