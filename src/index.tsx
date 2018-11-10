import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

const AppWithContext = () => (
  <App />
)

// ReactDOM.createRoot(document.getElementById('root')).render(<AppWithContext />)
ReactDOM.render(<AppWithContext />, document.getElementById('root'))
