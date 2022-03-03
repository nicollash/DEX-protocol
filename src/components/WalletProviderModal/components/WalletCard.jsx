import React from 'react'

import Button from 'components/Button'
import Card from 'components/Card'
import CardContent from 'components/CardContent'
import CardIcon from 'components/CardIcon'
import CardTitle from 'components/CardTitle'
import Spacer from 'components/Spacer'

const WalletCard = ({ icon, onConnect, onDismiss, title }) => (
  <Card>
    <CardContent>
      <CardIcon>{icon}</CardIcon>
      <CardTitle text={title} />
      <Spacer />
      <Button onClick={onConnect} text="Connect" />
      <Spacer />
      <Button text="Cancel" variant="secondary" onClick={onDismiss} />
    </CardContent>
  </Card>
)

export default WalletCard
