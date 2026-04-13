import { Link, Navigate, useLocation } from 'react-router-dom'
import { useUserAuthContext } from '@/contexts/UserAuthContext';
import { FaArrowLeftLong } from "react-icons/fa6";

export default function AdminPrivateRoute({ Component, allowedRoles }) {
    const { user, isAuth, loading } = useUserAuthContext()
    const location = useLocation()

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Please wait...</div>
    }

    if (!isAuth) {
        return <Navigate to="/auth/user/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.includes(user?.role)) return <Component />

    return (
        <div className='h-screen flex flex-col justify-center items-center gap-4'>
            <h1 className='text-2xl text-[#333] text-center mt-5 w-[50%]'>You don't have permission to access this page.</h1>
            <div className='text-center mt-5'>
                <Link to="/" className='px-5 py-2 flex gap-3 items-center rounded-[8px] text-[#fff] bg-[var(--secondary)] decoration-0'>
                    <FaArrowLeftLong /> Go To Home
                </Link>
            </div>
        </div>
    )
}