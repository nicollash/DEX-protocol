import { useCallback, useContext, useEffect } from 'react'
import { Context } from 'contexts/Modals'

const useModal = (modal, isFrom = '', onClose, key = '') => {
  const { onPresent, onDismiss, isOpen } = useContext(Context)

  useEffect(() => {
    if (!isOpen && onClose) {
      onClose()
    }
  }, [isOpen])

  const handlePresent = useCallback(
    (data) => {
      onPresent(modal, isFrom, data, key)
    },
    [key, modal, onPresent]
  )

  return [handlePresent, onDismiss]
}

export default useModal
