import React, { createContext, useCallback, useState } from 'react'
import styled from 'styled-components'

export const Context = createContext({
  content: null,
  isOpen: false,
  onPresent: () => {},
  onDismiss: () => {},
})

const Modals = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState()
  const [payload, setPayload] = useState({})
  const [isFrom, setIsFrom] = useState('')

  const handlePresent = useCallback(
    (modalContent, isFrom, data) => {
      setContent(modalContent)
      setIsOpen(true)
      setPayload(data)
      setIsFrom(isFrom)
    },
    [setContent, setIsOpen]
  )

  const handleDismiss = useCallback(() => {
    setContent(undefined)
    setIsOpen(false)
  }, [setContent, setIsOpen])

  return (
    <Context.Provider
      value={{
        content,
        isOpen,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {isOpen && (
        <StyledModalWrapper>
          {isFrom === 'success' ? 
          <StyledModalBackdrop /> : 
          <StyledModalBackdrop onClick={handleDismiss} />}
          {React.isValidElement(content) &&
            React.cloneElement(content, {
              onDismiss: handleDismiss,
              payload,
            })}
        </StyledModalWrapper>
      )}
    </Context.Provider>
  )
}

export const StyledModalWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
`

export const StyledModalBackdrop = styled.div`
  background-color: rgba(9, 12, 26, 0.5);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export default Modals
