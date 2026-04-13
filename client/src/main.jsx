import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './contexts/AuthContext.jsx'
import SellerAuthContextProvider from './contexts/SellerAuthContext.jsx'
import './configs/global.jsx'
import '@ant-design/v5-patch-for-react-19'
import UserAuthContextProvider from './contexts/UserAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SellerAuthContextProvider>
          <UserAuthContextProvider>
            <App />
          </UserAuthContextProvider>
        </SellerAuthContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)