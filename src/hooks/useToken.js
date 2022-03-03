import { useMemo } from 'react'
import { parseBytes32String } from '@ethersproject/strings'
import { Token } from '@uniswap/sdk'
import { getAddress } from '@ethersproject/address'

import { allTokens } from 'monox/constants'
import { useBytes32TokenContract, useTokenContract } from 'monox/constants'
import { useSelector } from 'react-redux'

const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
const INVALID_CALL_STATE = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false,
}

const isMethodArg = (x) => {
  return ['string', 'number'].indexOf(typeof x) !== -1
}

const isValidMethodArgs = (x) => {
  return (
    x === undefined ||
    (Array.isArray(x) &&
      x.every(
        (xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))
      ))
  )
}

const parseStringOrBytes32 = (str, bytes32, defaultValue) => {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

const toCallState = (
  callResult,
  contractInterface,
  fragment,
  latestBlockNumber
) => {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE

  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result = undefined
  if (data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data)
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data)
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      }
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result: result,
    error: true,
  }
}

export function isAddress(value) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function useSingleCallResult(contract, methodName, inputs, options) {
  const fragment = () => contract?.interface?.getFunction(methodName)

  const calls = useMemo(() => {
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          },
        ]
      : []
  }, [contract, fragment, inputs])

  const result = { valid: true, data: null, blockNumber: null }

  return toCallState(result, contract?.interface, fragment, 0)
}

const NEVER_RELOAD = {
  blocksPerFetch: Infinity,
}

export function useToken(provider, tokenAddress) {
  const chainId = useSelector(({network}) => network.id)
  const { tokens } = allTokens

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(
    provider,
    address ? address : undefined,
    false
  )
  const tokenContractBytes32 = useBytes32TokenContract(
    provider,
    address ? address : undefined,
    false
  )
  const token = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    'decimals',
    undefined,
    NEVER_RELOAD
  )

  if (token) return token
  if (!chainId || !address) return undefined
  if (decimals.loading || symbol.loading || tokenName.loading) return null
  if (decimals.result) {
    return new Token(
      chainId,
      address,
      decimals.result[0],
      parseStringOrBytes32(
        symbol.result?.[0],
        symbolBytes32.result?.[0],
        'UNKNOWN'
      ),
      parseStringOrBytes32(
        tokenName.result?.[0],
        tokenNameBytes32.result?.[0],
        'Unknown Token'
      )
    )
  }
  return undefined
}
