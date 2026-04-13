import React, { useState } from "react"
import { Typography, Form, Input, Button, Row, Col } from "antd"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FiChevronLeft } from "react-icons/fi"

const { Title, Paragraph } = Typography

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }

const UserSignup = () => {
    const [state, setState] = useState(initialState);
    const [activeTab, setActiveTab] = useState(1);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handleRequestCode = async () => {
        const { firstName, lastName, email, password, confirmPassword } = state;

        if (!firstName || !lastName || !email || !password || !confirmPassword)
            return window.toastify("All fields are required", "error");
        if (password !== confirmPassword)
            return window.toastify("Passwords do not match", "error");

        setLoading(true);
        try {
            const res = await axios.post(`${window.api}/loomaze/send-email-verification`, { email });
            if (res.status === 201) {
                window.toastify(res.data.message, "success");
                setActiveTab(2);
            }
        } catch (err) {
            window.toastify(err?.response?.data?.message || "Failed to send code", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!verificationCode) return window.toastify("Please enter the verification code", "error");

        setLoading(true);
        const fullName = `${state.firstName} ${state.lastName}`.trim();

        try {
            const res = await axios.post(`${window.api}/loomaze/signup`, {
                ...state,
                fullName,
                verificationCode
            });
            if (res.status === 201) {
                window.toastify("User created successfully", "success");
                navigate("/auth/user/login");
            }
        } catch (err) {
            window.toastify(err?.response?.data?.message || "Signup failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <span onClick={() => activeTab === 2 ? setActiveTab(1) : navigate("/")} className='w-fit flex items-center gap-1 text-primary cursor-pointer mb-6 hover:opacity-50'>
                    <FiChevronLeft /> {activeTab === 2 ? "Back to Edit" : "Back to Home"}
                </span>

                <Title level={3} className="text-center! text-primary! font-semibold!">
                    {activeTab === 1 ? "Create account" : "Verify Email"}
                </Title>

                <Form layout="vertical" onFinish={activeTab === 1 ? handleRequestCode : handleSubmit}>
                    {activeTab === 1 ? (
                        <>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item><Input size="large" placeholder="First name" name="firstName" value={state.firstName} onChange={handleChange} /></Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item><Input size="large" placeholder="Last name" name="lastName" value={state.lastName} onChange={handleChange} /></Form.Item>
                                </Col>
                            </Row>
                            <Form.Item><Input size="large" placeholder="Email address" name="email" value={state.email} onChange={handleChange} /></Form.Item>
                            <Form.Item><Input.Password size="large" placeholder="Password" name="password" value={state.password} onChange={handleChange} /></Form.Item>
                            <Form.Item><Input.Password size="large" placeholder="Confirm password" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} /></Form.Item>
                            <Button type="primary" htmlType="submit" size="large" loading={loading} block>Next</Button>
                        </>
                    ) : (
                        <>
                            <Paragraph className="text-center">A 6-digit code was sent to <b>{state.email}</b></Paragraph>
                            <Form.Item>
                                <Input size="large" placeholder="Enter 6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="large" loading={loading} block>Verify & Create Account</Button>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default UserSignup