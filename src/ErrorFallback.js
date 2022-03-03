import React, { useEffect } from 'react'
import { getWithExpiry, setWithExpiry } from './storage'

export default function ErrorFallback({ error }) {
  // Handles failed lazy loading of a JS/CSS chunk.
  useEffect(() => {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/
    if (error?.message && chunkFailedMessage.test(error.message)) {
      if (!getWithExpiry('chunk_failed')) {
        setWithExpiry('chunk_failed', 'true', 10000)
        window.location.reload()
      } else {
        window.location.reload()
      }
    }
  }, [error])

  return (
    <div>
      <p>Something went wrong.</p>
      <pre>{error?.message}</pre>
    </div>
  )
}
