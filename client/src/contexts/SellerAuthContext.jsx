import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const SellerAuthContext = createContext()

const initialState = { sellerIsAuthenticated: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGGED_IN":
            return { sellerIsAuthenticated: true, user: payload.user }
        case "SET_PROFILE":
            return { sellerIsAuthenticated: true, user: payload.user }
        case "SET_LOGGED_OUT":
            return { ...initialState }
        default:
            return state
    }
}

export default function SellerAuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getSellerProfile = useCallback(async (token) => {
        if (!token) return
        const config = { headers: { Authorization: `Bearer ${token}` } }

        await axios.get(`${import.meta.env.VITE_HOST}/auth/seller/user`, config)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    dispatch({ type: "SET_PROFILE", payload: { user: data.user } })
                }
            })
            .catch((err) => {
                dispatch({ type: "SET_LOGGED_OUT" })
                localStorage.removeItem("ecomplatsellerjwt")
                console.error("Error fetching seller profile:", err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem("ecomplatsellerjwt")
        if (!token) {
            dispatch({ type: "SET_LOGGED_OUT" })
            setLoading(false)
            return
        }
        getSellerProfile(token)
    }, [getSellerProfile])

    const handleLogout = () => {
        dispatch({ type: "SET_LOGGED_OUT" })
        localStorage.removeItem("ecomplatsellerjwt")
        navigate('/')
    }

    return (
        <SellerAuthContext.Provider value={{ ...state, dispatch, loading, setLoading, handleLogout }}>
            {children}
        </SellerAuthContext.Provider>
    )
}

export const useSellerAuthContext = () => useContext(SellerAuthContext)