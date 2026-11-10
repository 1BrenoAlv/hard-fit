import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import AdminPanel from './admin/AdminPanel'
import './styles.css'

const Page = /^\/admin\/?$/.test(window.location.pathname) ? AdminPanel : App

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
