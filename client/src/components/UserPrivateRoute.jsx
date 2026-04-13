import React from "react"
import { Navigate } from "react-router-dom"
import { useUserAuthContext } from "@/contexts/UserAuthContext"
import Loader from "./Loader"

const UserPrivateRoute = ({ Component }) => {
    const { isAuth, loading } = useUserAuthContext()

    if (loading) return <Loader />

    if (!isAuth) return <Navigate to="/auth/user/login" replace />

    return <Component />
}

export default UserPrivateRoute