import { screen } from '@testing-library/dom'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { render } from 'util/testUtils'
import ChartPlaceholder from 'views/Swapper/components/ChartPlaceholder'

describe('Swap Chart Place Holder', () => {
  test('render chart place holder component', () => {
    render(<ChartPlaceholder text={`Select your token for the price chart`} />)
    expect(
      screen.getByText('Select your token for the price chart')
    ).toBeInTheDocument()
    cleanup()
  })
})
