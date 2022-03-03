export const uriToHttp = (uri) => {
  if (!uri) {
    return []
  }
  const protocol = uri.split(':')[0].toLowerCase()
  switch (protocol) {
    case 'https':
      return [uri]
    case 'http':
      return ['https' + uri.substr(4), uri]
    case 'ipfs':
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)[2]
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ]
    case 'ipns':
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)[2]
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ]
    default:
      return []
  }
}

const getTokenList = async (listUrl) => {
  const urls = uriToHttp(listUrl)
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url)
    } catch (error) {
      console.debug('Failed to fetch list', listUrl, error)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    const json = await response.json()
    return json
  }
  throw new Error('Unrecognized list URL protocol.')
}

export default getTokenList
