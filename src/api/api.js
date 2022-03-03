import axios from 'axios'

axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}`

export async function get(path, params = {}) {
  const response = await axios({
    method: 'get',
    url: `${path}`,
    params,
    responseType: 'json',
  })
    .then((res) => res.data)
    .catch((e) => {
      return {
        hasError: true,
        ...e,
      }
    })
  return response
}
