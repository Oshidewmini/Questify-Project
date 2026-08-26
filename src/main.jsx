import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GenerateProvider } from './context/GenerateContext.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GenerateProvider>
        <App />
      </GenerateProvider>
    </AuthProvider>
  </React.StrictMode>,
)
