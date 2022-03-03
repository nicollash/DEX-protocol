import React, { memo, useCallback, useMemo, useState, useContext } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'

import { TokenContext } from 'contexts/TokenProvider'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { parseENSAddress, DEFAULT_LIST_OF_LISTS } from 'monox/constants'
import { uriToHttp } from 'monox/getTokenList'

import Button from 'components/Button'
import Spacer from 'components/Spacer'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const AutoColumn = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === 'sm' && '8px') ||
    (gap === 'md' && '12px') ||
    (gap === 'lg' && '24px') ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const Row = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

const RowBetween = styled(Row)`
  justify-content: space-between;
`

const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  box-sizing: border-box;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.color.black};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.color.grey[300]};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.color.red[500]};
    outline: none;
  }
`

const StyledListUrlText = styled.div`
  max-width: 160px;
  opacity: 0.6;
  margin-right: 0.5rem;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledImage = styled.img`
  width: 24px;
`

function ListOrigin({ listUrl }) {
  const ensName = useMemo(
    () => (parseENSAddress(listUrl) ? parseENSAddress(listUrl).ensName : ''),
    [listUrl]
  )
  const host = useMemo(() => {
    if (ensName) return undefined
    const lowerListUrl = listUrl.toLowerCase()
    if (
      lowerListUrl.startsWith('ipfs://') ||
      lowerListUrl.startsWith('ipns://')
    ) {
      return listUrl
    }
    try {
      const url = new URL(listUrl)
      return url.host
    } catch (error) {
      return undefined
    }
  }, [listUrl, ensName])
  return <>{ensName || host}</>
}

const listUrlRowHTMLId = (listUrl) => `list-row-${listUrl.replace(/\./g, '-')}`

const ListRow = memo(function ListRow({ listUrl, onBack }) {
  const { allTokens, selectedTokenURL, onSelectTokenList } = useContext(
    TokenContext
  )

  const isSelected = listUrl === selectedTokenURL
  const currentList = allTokens[listUrl]

  const selectThisList = useCallback(() => {
    if (isSelected) return

    onSelectTokenList(listUrl)
    onBack()
  }, [isSelected, listUrl, onBack])

  if (!allTokens || !currentList) return null

  return (
    <Row
      key={listUrl}
      align="center"
      padding="16px"
      id={listUrlRowHTMLId(listUrl)}
    >
      {currentList.logoURI ? (
        <StyledImage
          style={{ marginRight: '1rem' }}
          src={currentList.logoURI}
          alt={`${currentList.name} list logo`}
        />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text
            fontWeight={isSelected ? 500 : 400}
            fontSize={16}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {currentList.name}
          </Text>
        </Row>
        <Row
          style={{
            marginTop: '4px',
          }}
        >
          <StyledListUrlText title={listUrl}>
            <ListOrigin listUrl={listUrl} />
          </StyledListUrlText>
        </Row>
      </Column>
      {isSelected ? (
        <Button
          disabled={true}
          variant={'secondary'}
          size={'sm'}
          text={'Selected'}
        />
      ) : (
        <Button
          variant={'default'}
          onClick={selectThisList}
          size={'sm'}
          text={'Select'}
        />
      )}
    </Row>
  )
})

const AddListButton = styled.button`
  max-width: 4rem;
  margin-left: 1rem;
  border-radius: 12px;
  padding: 10px 18px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.color.red[300]};
  font-size: 16px;
`

const ListContainer = styled.div`
  flex: 1;
  overflow: auto;
`

const TokenListSelector = ({ onBack }) => {
  const [listUrlInput, setListUrlInput] = useState('')

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
  }, [])
  const fetchList = useFetchListCallback()

  const handleAddList = useCallback(() => {
    fetchList(listUrlInput)
      .then(() => {
        setListUrlInput('')
      })
      .catch((error) => {
        console.log(error.message)
      })
  }, [fetchList, listUrlInput])

  const validUrl = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    )
  }, [listUrlInput])

  const handleEnterKey = useCallback(
    (e) => {
      if (validUrl && e.key === 'Enter') {
        handleAddList()
      }
    },
    [handleAddList, validUrl]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn>
        <RowBetween>
          <Text
            fontWeight={500}
            fontSize={20}
            textAlign={'center'}
            width="100%"
          >
            Manage Lists
          </Text>
        </RowBetween>
      </PaddedColumn>
      <PaddedColumn gap="14px">
        <Text fontWeight={600}>Add a list </Text>
        <Row>
          <SearchInput
            type="text"
            id="list-add-input"
            placeholder="https:// or ipfs:// or ENS name"
            value={listUrlInput}
            onChange={handleInput}
            onKeyDown={handleEnterKey}
            style={{ height: '2.75rem', borderRadius: 12, padding: '12px' }}
          />
          <AddListButton onClick={handleAddList} disabled={!validUrl}>
            Add
          </AddListButton>
        </Row>
      </PaddedColumn>

      <Spacer />

      <ListContainer>
        {DEFAULT_LIST_OF_LISTS.map((listUrl) => (
          <ListRow key={listUrl} listUrl={listUrl} onBack={onBack} />
        ))}
      </ListContainer>
    </Column>
  )
}

export default TokenListSelector
