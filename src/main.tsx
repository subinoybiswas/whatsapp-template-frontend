import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VariablesProvider } from './contexts/VariablesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VariablesProvider>
      <App />
    </VariablesProvider>
  </React.StrictMode>,
)
