import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { useSellerAuthContext } from '../../contexts/SellerAuthContext'
import Login from './Login'
import Signup from './Signup'
import SellerLogin from './SellerLogin'
import SellerSignup from './SellerSignup'
import UserLogin from './UserLogin'
import UserSignup from './UserSignup'

export default function Auth({ isCustomDomain }) {
    const { isAuthenticated } = useAuthContext()
    const { sellerIsAuthenticated, user } = useSellerAuthContext()
    const location = useLocation()

    const getRedirectPath = () => {
        return (
            location.state?.from?.pathname ||
            sessionStorage.getItem('redirectPath') ||
            "/"
        )
    }

    return (
        <Routes>
            <Route index element={!isAuthenticated ? <Login isCustomDomain={isCustomDomain} /> : <Navigate to={getRedirectPath()} replace />} />
            <Route path='login' element={!isAuthenticated ? <Login isCustomDomain={isCustomDomain} /> : <Navigate to={getRedirectPath()} replace />} />
            <Route path='signup' element={!isAuthenticated ? <Signup isCustomDomain={isCustomDomain} /> : <Navigate to="/" />} />
            <Route path='user/login' element={<UserLogin />} />
            <Route path='user/signup' element={<UserSignup />} />
            <Route path='seller/login' element={sellerIsAuthenticated && user?.role === 'seller' ? <Navigate to="/seller/dashboard" state={{ from: location }} replace /> : <SellerLogin />} />
            <Route path='seller/signup' element={sellerIsAuthenticated && user?.role === 'seller' ? <Navigate to="/seller/dashboard" /> : <SellerSignup />} />
        </Routes >
    )
}