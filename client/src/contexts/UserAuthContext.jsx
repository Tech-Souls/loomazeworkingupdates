import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

const initialState = { isAuth: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGGED_IN":
            return { isAuth: true, user: payload.user }
        case "SET_PROFILE":
            return { isAuth: true, user: payload.user }
        case "SET_LOGGED_OUT":
            return { ...initialState }
        default:
            return state
    }
}

export default function UserAuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const readUserProfile = useCallback(data => {

        const { token } = data
        const config = { headers: { authorization: `Bearer ${token}` } }
        axios.get(`${window.api}/loomaze/user`, config)
            .then(res => {
                let { data, status } = res
                if (status === 200) {
                    let user = { ...data.user }
                    dispatch({ type: "SET_LOGGED_IN", payload: { user } })
                }
            })
            .catch((err) => {
                console.log('err', err)
                localStorage.removeItem("jwt")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
    useEffect(() => {
        let token = localStorage.getItem("jwt")
        if (token) { readUserProfile({ token }) }
        else { setTimeout(() => setLoading(false), 500); }
    }, [readUserProfile])

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        dispatch({ type: "SET_LOGGED_OUT" })
        window.toastify("Logout successful", "success")
        navigate('/')
    }


    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, setLoading, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserAuthContext = () => useContext(AuthContext)