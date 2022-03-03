import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Prismic from '@prismicio/client'

import {
  saveCollections,
  saveFeatured,
  savePartnerCompanies,
  saveTeamMembers,
} from 'state/prismic/actions'
import orderBy from 'lodash/orderBy'

export function usePrismic(fetchTokens = false) {
  const apiEndpoint = process.env.REACT_APP_PRISMIC_API_ENDPOINT
  const accessToken = process.env.REACT_APP_PRISMIC_TOKEN

  const Client = Prismic.client(apiEndpoint, {
    accessToken,
  })
  const _isMounted = useRef(true)
  const [data, setData] = useState([])
  const collections = useSelector(({ prismic }) => prismic.collections)
  const featured = useSelector(({ prismic }) => prismic.featured)
  const partnerCompanies = useSelector(({ prismic }) => prismic.partner_company)
  const teamMembers = useSelector(({ prismic }) => prismic.team_member)
  const [tokens, setTokens] = useState({})
  const [tokensById, setTokensById] = useState({})
  const [tokensLoading, setTokensLoading] = useState(false)
  const [genericDescription, setGenericDescription] = useState(null)
  const [partnerTokens, setPartnerTokens] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', 'collection')
      )
      if (response && Array.isArray(response.results) && _isMounted.current) {
        setData(response.results)
        if (response.results.length) {
          const col = {}
          response.results.forEach((data) => {
            if (data?.slugs?.[0] === 'featured_tokens') {
              dispatch(saveFeatured(data))
            } else if (data?.slugs?.[0] === 'partner_tokens') {
              setPartnerTokens(data.data?.tokens)
            } else {
              col[data?.tags?.[0]] = data.data
            }
          })
          dispatch(saveCollections(col))
        }
      }
    }
    fetchData()

    return () => {
      _isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', 'token'),
        { pageSize: 100 }
      )
      if (response && Array.isArray(response.results) && _isMounted.current) {
        setData(response.results)
        const tokenList = {}
        const tokenListById = {}
        if (response.results.length) {
          response.results.forEach((item) => {
            tokenList[item.data.contract_id] = item.data
            tokenListById[item?.id] = item.data
          })
          setTokens(tokenList)
          setTokensById(tokenListById)
          setTokensLoading(false)
        }
      }
    }
    if (fetchTokens) {
      setTokensLoading(true)
      fetchData()
    }
  }, [fetchTokens])

  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', 'partner_company')
      )
      if (response && Array.isArray(response.results) && _isMounted.current) {
        setData(response.results)
        if (response.results.length) {
          let col = []
          response.results.forEach((data) => {
            col = [...col, data.data]
          })
          dispatch(
            savePartnerCompanies(
              orderBy(col, (company) => company?.name[0]?.text, ['asc'])
            )
          )
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', 'team_member')
      )
      if (response && Array.isArray(response.results) && _isMounted.current) {
        setData(response.results)
        if (response.results.length) {
          let col = []
          response.results.forEach((data) => {
            col = [...col, data.data]
          })
          dispatch(saveTeamMembers(col))
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', 'generic_token_description')
      )
      if (response && Array.isArray(response.results) && _isMounted.current) {
        setGenericDescription(response?.results?.[0]?.data)
      }
    }
    fetchData()
  }, [])

  return {
    data,
    collections,
    featured,
    partnerCompanies,
    teamMembers,
    tokens,
    tokensById,
    tokensLoading,
    genericDescription,
    partnerTokens,
  }
}
