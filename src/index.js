import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Nunito:100,200,400,500,600,700,800', 'sans-serif'],
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
