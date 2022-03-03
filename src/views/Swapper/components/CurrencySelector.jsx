import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from 'react-svg-spinner'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'
import uniqBy from 'lodash/uniqBy'
import { FixedSizeList as List } from 'react-window'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'

import useWallet from 'hooks/useWallet'
import useSearchToken from 'hooks/useSearchToken'
import useTokenBalance from 'hooks/useTokenBalance'
import usePoolList from 'hooks/usePoolList'
import useContributedPoolList from 'hooks/useContributedPoolList'
import useModal from 'hooks/useModal'
import useWindowSize from 'hooks/useWindowSize'
import { saveToken } from 'state/users/actions'
import { saveTokens, saveFilteredTokens } from 'state/tokens/actions'
import { uriToHttp } from 'monox/getTokenList'
import config from 'monox/config'
import { ubetToEth, weiToEthNum } from 'monox/constants'
import { toEllipsis, getEtherscanLink } from 'monox/util'
import { StyledExternalLink } from 'theme'

import Label from 'components/Label'
import { RowBetween } from 'components/Row'
import { CloseIcon } from 'components/IconButton'
import ImportTokenModal from 'components/ImportTokenModal'
import { StyledResponsiveWrapper, StyledModal } from 'components/Modal'
import Spacer from 'components/Spacer'
import TokenImage from 'components/TokenImage'
import { AccountContext } from 'contexts/AccountProvider'

import search from 'assets/img/search.svg'

const CurrencyItem = ({ index, style, data, disabled }) => {
  const {
    sortedData,
    poolList,
    handleCurrency,
    chainId,
    WRAPPED_MAIN_ADDRESS,
  } = data
  const networkId = useSelector(({ network }) => network.id)
  const vUSDData = config[networkId || chainId].vUSD
  const VUSD_ADDRESS = vUSDData?.address
  const token = sortedData[index]
  const poolData = poolList.find(
    (item) => item?.token?.toLowerCase() === token?.address?.toLowerCase()
  )
  const isActive =
    (poolData && poolData?.status) ||
    poolList?.length === 0 ||
    token?.address === VUSD_ADDRESS ||
    !token?.address
      ? true
      : false
  const { balance } = useTokenBalance(token)

  return (
    <CurrencyConatiner
      onClick={() => handleCurrency(token, isActive)}
      key={token?.address || 'eth'}
      disabled={disabled || !isActive}
      style={style}
      data-testid={`currency-container-${index}`}
    >
      <Flex
        flexDirection="row"
        alignItems="flex-start"
        style={{ padding: '11px 40px', height: '56px' }}
        data-tip="Pool is not created yet."
        data-tip-disable={isActive}
        data-scroll-hide={false}
        data-type="warning"
        data-place="bottom"
      >
        <Box mr={3}>
          <TokenImage
            letter={token?.logoURI ? null : token?.symbol && token?.symbol[0]}
            src={token?.logoURI ? uriToHttp(token?.logoURI) : null}
            height="32"
            width="32"
          />
        </Box>
        <Flex flexDirection="column">
          <Flex flexDirection="row" alignItems="center">
            <Label text={token?.name} weight={'bold'} size={14} />
          </Flex>
          <StyledLabel>
            <Label
              weight={'bold'}
              opacity="0.3"
              size={11}
              text={token?.symbol}
            />
            <Address>
              <Span>
                &nbsp;
                {token?.address && ` - `}
                &nbsp;
              </Span>
              {token?.address ? `${toEllipsis(token?.address, 16)}` : ``}
              <StyledExternalLink
                target="_blank"
                className="etherscan-link"
                href={getEtherscanLink(
                  chainId,
                  token?.address ?? WRAPPED_MAIN_ADDRESS,
                  'token'
                )}
                rel="noopener noreferrer"
                style={{ justifyContent: 'left' }}
              >
                <DiagonalArrowRight />
              </StyledExternalLink>
            </Address>
          </StyledLabel>
        </Flex>
        <div style={{ marginLeft: 'auto' }}>
          <Label
            weight={800}
            size={13}
            text={ubetToEth(balance, token?.decimals) || 0}
          />
        </div>
      </Flex>
      {(disabled || !isActive) && (
        <ReactTooltip html effect="solid" arrowColor="transparent" />
      )}
    </CurrencyConatiner>
  )
}

const CurrencySelector = ({
  setCurrency,
  setIsDropdown,
  selected = [],
  onDismiss,
  isOnLiquidity = false,
}) => {
  const { chainId, account } = useWallet()
  const { getToken: getTokenFromContract } = useContext(AccountContext)
  const networkId = useSelector(({ network }) => network.id)

  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const MAIN_CURRENCY = config[networkId || chainId].MAIN_CURRENCY
  const MONOData = config[networkId || chainId].MONO
  const vUSDData = config[networkId || chainId].vUSD
  const VUSD_ADDRESS = vUSDData?.address
  const tokens = useSelector(({ user }) => user.tokens)

  const { poolList } = usePoolList()
  const {
    poolList: contributedPoolList,
    loading: poolLoading,
  } = useContributedPoolList()

  const [searchText, setSearchText] = useState('')
  const [focus, setFocus] = useState(false)
  const allTokens = useSelector(({ tokens }) => tokens.allTokens[chainId] ?? [])
  const filteredData = useSelector(
    ({ tokens }) => tokens.filteredTokens[chainId] ?? []
  )
  const balances = useSelector(({ user }) => user.balances?.[chainId] ?? {})

  const sortedData = filteredData.sort(function (a, b) {
    const balanceA = new BigNumber(balances[a?.address ?? account] ?? 0)
    const balanceB = new BigNumber(balances[b?.address ?? account] ?? 0)
    if (weiToEthNum(balanceA) < weiToEthNum(balanceB)) {
      return 1
    }
    if (weiToEthNum(balanceA) > weiToEthNum(balanceB)) {
      return -1
    }
    return 0
  })
  const [tokensLoading, setTokensLoding] = useState(false)
  const { onGetToken, filteredTokenList } = useSearchToken(true, allTokens)

  const dispatch = useDispatch()

  const { width: windowWidth } = useWindowSize()
  let width = useMemo(() => {
    if (windowWidth < 960 && windowWidth > 720) {
      return 400
    } else if (windowWidth < 720 && windowWidth > 500) {
      return 350
    } else if (windowWidth < 500) {
      return 300
    }
    return 450
  }, [windowWidth])

  const close = () => {
    setIsDropdown(true)
    onDismiss()
  }

  const [handleImportTokenModal] = useModal(<ImportTokenModal />)

  useEffect(() => {
    const currentChainTokens = tokens[chainId] ?? {}
    const customTokenList = Object.values(currentChainTokens).map((token) => ({
      ...token,
      status: token?.status ?? 1,
    }))

    if (poolList.length || contributedPoolList.length) {
      setTokensLoding(true)
      const tokens = []
      poolList.forEach((pool) => {
        const fromList = filteredTokenList.find(
          (token) => token?.address?.toLowerCase() === pool.token.toLowerCase()
        )
        const isMONO = pool?.token === MONOData?.address
        const isSelected = selected?.some(
          (token) => token?.address === pool?.token
        )
        if (!isSelected && fromList && !isMONO) {
          tokens.push({
            name: fromList?.name,
            symbol: fromList?.symbol,
            status: pool.status,
            logoURI: fromList?.logoURI,
            notInList: fromList ? false : true,
            address: fromList?.address,
            chainId: fromList?.chainId,
            decimals: parseInt(fromList?.decimals),
          })
        }
        if (!isSelected && isMONO) {
          tokens.push({
            name: MONOData.name,
            symbol: MONOData.symbol,
            status: pool.status,
            logoURI: MONOData?.logoURI,
            notInList: false,
            chainId: MONOData?.chainId,
            address: MONOData?.address,
            decimals: MONOData?.decimals,
          })
        }
      })
      contributedPoolList.forEach(async (pool) => {
        const index = tokens.findIndex((token) => token.address === pool.token)
        if (index === -1 && pool?.token !== MONOData?.address)
          if (pool?.name && pool.symbol) {
            tokens.push({
              name: pool.name,
              symbol: pool.symbol,
              status: pool?.status,
              logoURI: pool?.logoURI,
              notInList: true,
              chainId: chainId || networkId,
              address: pool.token,
              decimals: parseInt(pool.length),
            })
          } else {
            const searchedToken = await getTokenFromContract(pool?.token)
            const searchedTokenName = await searchedToken.methods.name().call()
            const searchedTokenSymbol = await searchedToken.methods
              .symbol()
              .call()
            const searchedTokenDecimals = await searchedToken.methods
              .decimals()
              .call()
            tokens.push({
              name: searchedTokenName,
              symbol: searchedTokenSymbol,
              logoURI: undefined,
              address: searchedToken?._address,
              notInList: true,
              chainId: chainId || networkId,
              status: 1,
              decimals: searchedTokenDecimals,
            })
          }
      })
      const mainSelected = selected?.some(
        (token) => token?.symbol === MAIN_CURRENCY.symbol
      )
      const filteredTokens = tokens?.filter(
        (token) => token.chainId === networkId
      )
      const filteredCustomTokenList = customTokenList.filter((token) =>
        poolList.find(
          (item) => item?.token?.toLowerCase() === token?.address?.toLowerCase()
        )
      )
      const temp = [...filteredTokens, ...filteredCustomTokenList]
      const isWrappedPool = temp?.filter(
        (item) => item?.address === WRAPPED_MAIN_ADDRESS
      )
      if (
        !mainSelected &&
        ((isOnLiquidity && isWrappedPool?.length > 0) || !isOnLiquidity)
      ) {
        temp.push(MAIN_CURRENCY)
      }
      const vUSDSelected = selected?.some(
        (token) => token?.address === vUSDData?.address
      )
      if (!vUSDSelected && vUSDData && !isOnLiquidity) {
        temp.push(vUSDData)
      }
      const uniqTokens = uniqBy(temp, 'address')

      dispatch(saveTokens({ chainId, tokens: uniqTokens }))
      dispatch(saveFilteredTokens({ chainId, tokens: uniqTokens }))
      setTokensLoding(false)
    }
  }, [
    poolList,
    dispatch,
    VUSD_ADDRESS,
    contributedPoolList,
    poolLoading,
    chainId,
  ])

  const getToken = useCallback(async () => {
    const tokenData = await onGetToken(searchText)
    dispatch(saveFilteredTokens({ chainId, tokens: tokenData }))
  }, [onGetToken, searchText])

  useEffect(() => {
    if (searchText !== '') {
      getToken()
    }
  }, [searchText, getToken])

  useEffect(() => {
    if (!poolLoading) {
      const value = document.getElementById('searchInput').value
      const finalValue = value?.split(' ').join('')
      setSearchText(finalValue)
      if (!finalValue?.length) {
        dispatch(saveFilteredTokens({ chainId, tokens: allTokens }))
      }
    }
  }, [poolLoading])

  const handleCurrency = (value, isActive = true) => {
    if (!isActive) return
    if (value?.notInList) {
      if (value?.showWarning) {
        handleImportTokenModal({ currrency: value, close, setCurrency })
        return
      }
      dispatch(saveToken({ ...value }))
    }
    setCurrency(value)
    close()
  }
  const handelChangeSearchText = (e) => {
    const value = e?.target?.value
    const finalValue = value?.split(' ').join('')
    if (poolLoading) return
    setSearchText(finalValue)
    if (!finalValue?.length) {
      dispatch(saveFilteredTokens({ chainId, tokens: allTokens }))
    }
  }

  return (
    <StyledResponsiveWrapper>
      <CustomStyledModal style={{ display: 'flex' }}>
        <Div>
          <StyledSearchContainer>
            <RowParent>
              <RowChild>
                <Label
                  text="Select a token"
                  weight={800}
                  size={16}
                  style={{ marginRight: 'auto' }}
                />
                <Spacer size="sm" />
              </RowChild>
              <CloseIcon onClick={onDismiss} />
            </RowParent>
            <StyledSearchBarWrapper focus={focus}>
              <StyledSearchBar
                id="searchInput"
                onChange={(e) => handelChangeSearchText(e)}
                placeholder="Search name or paste address"
                type="text"
                autoFocus
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                data-testid="search-bar"
              />
              <img
                src={search}
                style={{
                  marginRight: '25px',
                }}
              ></img>
            </StyledSearchBarWrapper>
          </StyledSearchContainer>
          <ScrollContainer>
            {tokensLoading && filteredData.length === 0 ? (
              <SpinnerContainer>
                <Spinner size="40px" thickness={2} color="#2dc48f" />
              </SpinnerContainer>
            ) : (
              <List
                className="token-container"
                height={320}
                itemCount={filteredData.length}
                itemSize={63}
                width={width}
                itemData={{
                  sortedData,
                  poolList,
                  handleCurrency,
                  chainId: chainId || networkId,
                  WRAPPED_MAIN_ADDRESS,
                }}
              >
                {CurrencyItem}
              </List>
            )}
          </ScrollContainer>
        </Div>
      </CustomStyledModal>
    </StyledResponsiveWrapper>
  )
}

export default CurrencySelector

const CustomStyledModal = styled(StyledModal)`
  padding: 0;
`
const Div = styled.div`
  margin: auto;
  background: ${({ theme }) => theme.color.background.main};
  padding: 20px 0;
  border-radius: 39px;
  height: 483px;
  transform-origin: 0 100%;
  overflow: hidden;
  width: 450px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 400px
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 350px
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 300px
  `}
`

const StyledLabel = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const Span = styled.span`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`

const StyledSearchContainer = styled.div`
  margin-top: 1rem;
  position: sticky;
  top: 0;
  padding: 0 40px;
`
const SpinnerContainer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  margin-top: 4.5rem;
`
const ScrollContainer = styled.div`
  margin-top: 10px;
  height: 320px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(33, 45, 99, 0.12);
    border-radius: 10px;
  }
`
const StyledSearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 29px 0 26px 0;
  height: 45px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 39px;
  ${(props) => props.focus && props.theme.inputFocusBorder}
`
const StyledSearchBar = styled.input`
  width: 100%;
  margin-left: 25px;
  border: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 800;
  background: unset;
  height: inherit;
  outline: none;
  color: rgba(33, 45, 99, 0.5);
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #212d63;
    opacity: 0.3;
    font-size: 14px;
  }
`

const Address = styled.div`
  color: #212d63;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  opacity: 0.3;
  :hover {
    color: ${({ theme }) => theme.color.font.primary};
    opacity: 1;
    .etherscan-link {
      display: inline-block;
    }
  }
  .etherscan-link {
    display: none;
  }
`
const DiagonalArrowRight = styled(DiagonalArrowRightUpOutline)`
  width: 15px;
  height: 15px;
  margin-left: 0px !important;
  display: none;
`
const CurrencyConatiner = styled.div`
  background: ${({ theme }) => theme.color.background.main};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
  :hover {
    background-color: rgba(45, 196, 143, 0.05);
    border-left: 4px solid ${(props) => props.theme.color.border.green};
  }
  :hover ${Address} {
    color: ${({ theme }) => theme.color.font.primary};
    opacity: 1;
  }
  :hover ${DiagonalArrowRight} {
    display: block;
  }
`

const RowParent = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
align-items: flex-start;
    
  `}
`

const RowChild = styled(RowBetween)`
  align-items: baseline;
  flex-wrap: wrap;
  div {
    margin-bottom: 10px;
  }
`
