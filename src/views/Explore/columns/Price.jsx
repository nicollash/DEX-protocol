import React from 'react'
import { precise } from 'monox/util'

import Label from 'components/Label'

const Price = ({ price, handleAnalytics, token }) => {
  return (
    <div onClick={() => handleAnalytics(token)}>
      <Label
        text={`$${
          parseFloat(price).toPrecision(1) < 1
            ? parseFloat(price).toFixed(5)
            : new Intl.NumberFormat().format(precise(price, 2 ?? 0))
        }`}
        size="13"
        weight="800"
      />
    </div>
  )
}

export default Price
