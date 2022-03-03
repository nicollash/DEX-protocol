import { useCallback, useState } from 'react'
import useWallet from 'hooks/useWallet'

export default function useAddTokenToMetamask(token) {
  const { ethereum } = useWallet()
  const [success, setSuccess] = useState(false)

  const addToken = useCallback(() => {
    if (ethereum && ethereum?.isMetaMask && ethereum?.request && token) {
      ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token?.address,
              symbol: token?.symbol,
              decimals: token?.decimals,
              image: token?.logoURI,
            },
          },
        })
        .then((success) => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [ethereum, token])

  return { addToken, success }
}
