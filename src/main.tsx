import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './atelier.css'
import App from './App.tsx'
import { ShopProvider } from './shop/ShopContext'

createRoot(document.getElementById('root')!).render(<StrictMode><ShopProvider><App /></ShopProvider></StrictMode>)
