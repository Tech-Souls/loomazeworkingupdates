import React from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext';
import { FaArrowLeftLong } from "react-icons/fa6";

export default function PrivateRoute({ Component, allowedRoles, isCustomDomain }) {
    const { user, isAuthenticated, loading } = useAuthContext()
    const { brandSlug: urlSlug } = useParams();
    const location = useLocation()

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Please wait...</div>
    }

    if (!isAuthenticated) {
        let loginPath = "/auth/login";

        if (!isCustomDomain) {
            const slug = urlSlug || localStorage.getItem('last_visited_brand');
            if (slug) {
                loginPath = `/auth/login?brandSlug=${slug}`;
            }
        }

        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (allowedRoles.includes(user?.role)) return <Component isCustomDomain={isCustomDomain} />

    return (
        <div className='h-screen flex flex-col justify-center items-center gap-4'>
            <h1 className='text-2xl text-[#333] text-center mt-5 w-[50%]'>You don't have permission to access this page.</h1>
            <div className='text-center mt-5'>
                <Link
                    to={brandSlug ? `/brand/${brandSlug}` : "/  "}
                    className='px-5 py-2 flex gap-3 items-center rounded-[8px] text-[#fff] bg-[var(--secondary)] decoration-0'
                >
                    <FaArrowLeftLong /> Go To Home
                </Link>
            </div>
        </div>
    )
}