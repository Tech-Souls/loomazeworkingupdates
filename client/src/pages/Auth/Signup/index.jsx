import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiLogIn } from "react-icons/fi";
import axios from "axios";

const initialState = { username: "", email: "", password: "", role: "customer", brandName: "", brandSlug: "" }

export default function Signup({ isCustomDomain }) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString)

    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBrandContext = async () => {
            if (isCustomDomain) {
                try {
                    const currentHostname = window.location.hostname;
                    const res = await axios.get(`${import.meta.env.VITE_HOST}/auth/brand/get?domain=${currentHostname}`);
                    if (res.data.brand) {
                        setState(prev => ({
                            ...prev,
                            brandName: res.data.brand.brandName,
                            brandSlug: res.data.brand.brandSlug,
                        }));
                    }
                } catch (err) {
                    setMessage("Could not load store configuration.");
                }
            } else {
                setState(prev => ({
                    ...prev,
                    brandName: params.get("brandName"),
                    brandSlug: params.get("brandSlug"),
                }));
            }
        };

        fetchBrandContext();
    }, [isCustomDomain, queryString]);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSignup = async e => {
        e.preventDefault()
        setMessage("")

        if (!state.brandSlug) return setMessage("Store context missing. Cannot signup.");
        if (state.password.length < 6) return alert("Password must be at least 6 characters long!")

        setLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_HOST}/auth/signup`, state)
            setMessage(res.data.message)
            setState(initialState)
            const loginUrl = isCustomDomain ? "/auth/login" : `/auth/login?brandName=${state.brandName}&brandSlug=${state.brandSlug}`;

            navigate(loginUrl);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-screen bg-gray-100 flex justify-center items-center p-2.5 sm:p-5'>
            <form className='w-full max-w-[500px] bg-white flex flex-col gap-4 p-6 rounded-xl shad' onSubmit={handleSignup}>
                <span onClick={() => navigate("/")} className='w-fit flex items-center gap-1 text-primary cursor-pointer hover:opacity-50'><FiChevronLeft /> Back to Home</span>
                <div>
                    <h1 className='text-[#333] text-2xl'>Signup</h1>
                    <p className='text-gray-700'>Create an account now</p>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Username</label>
                    <input
                        type="text"
                        name='username'
                        value={state.username}
                        placeholder="Enter username"
                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                        onChange={handleChange}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Email</label>
                    <input
                        type="email"
                        name='email'
                        value={state.email}
                        placeholder="Enter email"
                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                        onChange={handleChange}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Password</label>
                    <input
                        type="password"
                        name='password'
                        value={state.password}
                        placeholder="Enter password"
                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-2 bg-[var(--secondary)] text-white p-4 mt-3 text-sm font-bold rounded-[8px] transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/75"
                >
                    {loading ? "Please wait..." : "Signup"} <FiLogIn />
                </button>

                {message && <p className="text-sm text-red-500">{message}</p>}

                <p className='text-[#333] mt-2'>Already have an account? <Link to={`/auth/login?brandName=${state.brandName}&brandSlug=${state.brandSlug}`} className='text-[var(--secondary)]'>Login now</Link></p>
            </form>
        </div>
    )
}