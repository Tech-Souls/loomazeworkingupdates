import React, { useState } from "react"
import { Typography, Form, Input, Button } from "antd"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FiChevronLeft } from "react-icons/fi"

const { Title, Paragraph } = Typography

const initialState = { email: "", password: "" }

const UserLogin = () => {
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState((s) => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = () => {
        let { email, password } = state

        if (!email || !password) return window.toastify("All fields are required", "error")
        if (window.isEmail(!email)) return window.toastify("Invalid email address", "error")
        if (password.length < 6) return window.toastify("Password must be at least 6 characters", "error")

        setLoading(true)
        axios.post(`${window.api}/loomaze/login`, { email, password })
            .then((res) => {
                const { token } = res.data

                localStorage.setItem("jwt", token)

                window.toastify("Login successfully", "success")
                setState(initialState)
                navigate("/")
                window.location.reload()
            }).catch((err) => {
                window.toastify(err?.response?.data?.message || "Login failed", "error")
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <span onClick={() => navigate("/")} className='w-fit flex items-center gap-1 text-primary cursor-pointer mb-6 hover:opacity-50'><FiChevronLeft /> Back to Home</span>
                <Title level={3} className="m-0! text-center! text-primary! font-semibold!">Login</Title>
                <Paragraph className="text-sm! text-gray-500! text-center! mt-1! mb-6!">Welcome back — Loomazein</Paragraph>
                <Form layout="vertical" onFinish={handleSubmit} noValidate>
                    <Form.Item>
                        <Input size="large" placeholder="Email address" name="email" value={state.email} onChange={handleChange} className="rounded-lg!" />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password size="large" placeholder="Password" name="password" value={state.password} onChange={handleChange} className="rounded-lg!" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" loading={loading} block className=" rounded-lg! font-semibold! tracking-wide!">Login</Button>
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account? <Link to="/auth/user/signup" className="text-secondary! font-medium! hover:underline!">Signup</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default UserLogin