import { toEllipsis } from 'monox/util'

describe('ellipsis testing', () => {
  test('Check string ellipsis 1', () => {
    expect(
      toEllipsis('0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD', 15)
    ).toMatch('0x9881...Abf3BD')
  })

  test('Check string ellipsis 2', () => {
    expect(
      toEllipsis('0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD', 10)
    ).toMatch('0x9881Bf582...55169Abf3BD')
  })

  test('Check string ellipsis 3', () => {
    expect(toEllipsis('0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD', 0)).toMatch(
      '0x9881Bf5824C0230293FB3067Abb8E55169Abf3BD'
    )
  })
})
