import { precise } from 'monox/util'

describe('Utils testing', () => {
  test('Check precise 1', () => {
    expect(precise('25461.21252', 4)).toBe(25461.2125)
  })

  test('Check precise 2', () => {
    expect(precise('652.014', 0)).toBe(652)
  })

  test('Check precise 3', () => {
    expect(precise('0', 2)).toBe(0)
  })
})
