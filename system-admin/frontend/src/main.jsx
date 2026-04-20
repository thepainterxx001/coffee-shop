import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Providers from './pages/Providers.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Providers>
        <App />
        <Toaster  />
      </Providers>
    </Router>
  </StrictMode>,
)
