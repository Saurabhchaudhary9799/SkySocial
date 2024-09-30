import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { UserProvider } from './context/userContext'
import { PostProvider } from './context/PostContext'

createRoot(document.getElementById('root')!).render(
 
  <BrowserRouter>
 
    <App />
    <Toaster />
   
    
  </BrowserRouter>
 

)
