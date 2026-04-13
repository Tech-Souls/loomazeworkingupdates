import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSellerAuthContext } from '../../../contexts/SellerAuthContext';
import { FiChevronLeft, FiLogIn } from "react-icons/fi";
import axios from "axios";

const initialState = { username: "", password: "" }

export default function SellerLogin() {

    const { dispatch } = useSellerAuthContext();
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleLogin = async e => {
        e.preventDefault()
        const { username, password } = state;

        if (!username || !password) {
            return setMessage("Please fill in all fields!");
        }

        setLoading(true)
        setMessage("")
        try {
            const res = await axios.post(`${import.meta.env.VITE_HOST}/auth/seller/login`, { username, password })
            const { token, user } = res.data;
            setState(initialState);

            if (user.role === 'seller' && user.status === 'approved') {
                localStorage.setItem("ecomplatsellerjwt", token);
                dispatch({ type: "SET_LOGGED_IN", payload: { user } });
                navigate("/seller");
            } else {
                if (user.status === 'rejected') {
                    return setMessage("Your application has been rejected!");
                } else if (user.status === 'pending') {
                    return setMessage("Your application is in pending state. Please wait for the approval!")
                } else if (user.status === 'banned') {
                    return setMessage("Your account has been banned due to rules violation!")
                }
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-screen bg-gray-100 flex justify-center items-center p-2.5 sm:p-5'>
            <form className='w-full max-w-[500px] bg-white flex flex-col gap-4 p-6 rounded-xl shad' onSubmit={handleLogin}>
                <span onClick={() => navigate("/")} className='w-fit flex items-center gap-1 text-primary cursor-pointer mb-6 hover:opacity-50'><FiChevronLeft /> Back to Home</span>
                <div>
                    <h1 className='text-[#333] text-2xl'>Welcome Back</h1>
                    <p className='text-gray-700'>Login to your seller dashboard</p>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Username</label>
                    <input type="text" name='username' value={state.username} placeholder="Enter username" className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]" onChange={handleChange} />
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
                    className="flex justify-center items-center gap-2 bg-[var(--primary)] text-white p-4 mt-3 text-sm font-semibold rounded-[8px] transition-all duration-150 ease-linear hover:bg-[var(--primary)]/75"
                >
                    {loading ? "Please wait..." : <>Login <FiLogIn /></>}
                </button>

                {message && <p className="text-sm text-red-500">{message}</p>}

                <p className='text-[#333] mt-2'>Don't have an account? <Link to="/auth/seller/signup" className='text-[var(--secondary)] hover:underline'>Create account now</Link></p>
            </form>
        </div>
    )
}