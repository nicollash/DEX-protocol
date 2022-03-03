import React from 'react'
import { precise } from 'monox/util'

import Label from 'components/Label'

const OneDayVolumeData = ({ handleAnalytics, volumes, token }) => {
  return (
    <div onClick={() => handleAnalytics(token)}>
      <Label
        text={`$${
          parseFloat(volumes).toPrecision(1) < 1
            ? parseFloat(volumes).toFixed(5)
            : new Intl.NumberFormat().format(precise(volumes, 2 ?? 0))
        }`}
        size="13"
        weight="800"
      />
    </div>
  )
}

export default OneDayVolumeData
