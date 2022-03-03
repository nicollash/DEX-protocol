import React from 'react'
import { precise } from 'monox/util'

import Label from 'components/Label'

const Liquidity = ({ liquidity }) => {
  return !liquidity ? (
    <Label
      style={{ marginRight: '20px', display: 'flex', justifyContent: 'center' }}
      text={
        liquidity
          ? `$${
              parseFloat(liquidity).toPrecision(1) < 1
                ? parseFloat(liquidity).toFixed(5)
                : new Intl.NumberFormat().format(precise(liquidity, 2 ?? 0))
            }`
          : '-'
      }
      size="13"
      weight="800"
    />
  ) : (
    <Label
      text={
        liquidity
          ? `$${
              parseFloat(liquidity).toPrecision(1) < 1
                ? parseFloat(liquidity).toFixed(5)
                : new Intl.NumberFormat().format(precise(liquidity, 2 ?? 0))
            }`
          : '-'
      }
      size="13"
      weight="800"
    />
  )
}

export default Liquidity
