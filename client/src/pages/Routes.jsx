import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Admin from './AdminDashboard'
import Seller from './SellerDashboard'
import Customer from './CustomerDashboard'
import Platform from './Platform'
import PrivateRoute from '../components/PrivateRoute'
import UserDashboard from './UserDashboard'
import { useSellerAuthContext } from '../contexts/SellerAuthContext'
import UserPrivateRoute from '../components/UserPrivateRoute'
import AdminPrivateRoute from '../components/AdminPrivateRoute'

export default function Index() {
    const { sellerIsAuthenticated, user } = useSellerAuthContext()
    const location = useLocation()

    const currentDomain = window.location.hostname;
    const isCustomDomain =
        !currentDomain.includes('localhost') &&
        !currentDomain.includes('vercel.app') &&
        !currentDomain.includes(import.meta.env.VITE_MAIN_DOMAIN);

    useEffect(() => {
        const isOnStorePage = location.pathname.startsWith('/brand/') || isCustomDomain

        if (!isOnStorePage) {
            const storeTags = document.querySelectorAll('[data-store-tag]')

            if (storeTags.length > 0) {
                storeTags.forEach(tag => {
                    try {
                        tag.remove()
                    } catch (error) {
                        console.error('Error removing store tag:', error)
                    }
                })
            }
        }
    }, [location.pathname, isCustomDomain])

    if (isCustomDomain) {
        return (
            <Routes>
                <Route path="/*" element={<Platform isCustomDomain={isCustomDomain} />} />
                <Route path="/auth/*" element={<Auth isCustomDomain={isCustomDomain} />} />
                <Route path="/customer/*" element={<PrivateRoute Component={Customer} allowedRoles={["customer", "admin"]} isCustomDomain={true} />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path='/*' element={<Frontend />} />
            <Route path='/auth/*' element={<Auth isCustomDomain={false} />} />
            <Route path='/brand/:brandSlug/*' element={<Platform isCustomDomain={false} />} />
            <Route path='/brand/:brandSlug/customer/*' element={<PrivateRoute Component={Customer} allowedRoles={["customer", "admin"]} isCustomDomain={false} />} />
            <Route path="/user/*" element={<UserPrivateRoute Component={UserDashboard} />} />
            <Route path='/admin/*' element={<AdminPrivateRoute Component={Admin} allowedRoles={["admin"]} />} />
            <Route path='/seller/*' element={sellerIsAuthenticated && user?.role === "seller" && user?.status === 'approved' ? <Seller /> : <Navigate to="/auth/seller/login" replace />} />
        </Routes>
    )
}