import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiChevronLeft, FiSend } from 'react-icons/fi'
import { IoCheckmark } from "react-icons/io5";
import { RiSecurePaymentFill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import axios from 'axios'

const initialState = { fullname: "", username: "", email: "", password: "", address: "", phoneNumber: "", whatsappNumber: "", brandName: "" }

export default function SellerSignup() {
    const [state, setState] = useState(initialState)
    const [confirmPwd, setConfirmPwd] = useState("")
    const [activeTab, setActiveTab] = useState(1)
    const [enteredCode, setEnteredCode] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [searchParams] = useSearchParams();
    const referralCodeFromUrl = searchParams.get("ref");

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleNext = () => {
        if (activeTab === 1) {
            if (!state.fullname || !state.username || !state.email || !state.password || !confirmPwd) return window.toastify("Please fill all fields in Step 1", "warning")
            if (state.password.length < 6) return window.toastify("Password must be at least 6 characters long!", "warning")
            if (state.password !== confirmPwd) return window.toastify("Passwords do not match!", "warning")
        }
        if (activeTab === 2) {
            if (!state.phoneNumber || !state.whatsappNumber || !state.address) return window.toastify("Please fill all fields in Step 2", "warning")
        }
        setActiveTab(prev => prev + 1);
    };

    const handleSendVerificationEmail = async (e) => {
        e.preventDefault();
        if (!state.email) return window.toastify("Email address is missing", "warning");
        if (!state.brandName) return window.toastify("Please enter a brand name", "warning")

        setLoading(true);
        await axios.post(`${import.meta.env.VITE_HOST}/auth/seller/send-email-verification`, { email: state.email })
            .then((res) => {
                const { status, data } = res;
                if (status === 201) {
                    setActiveTab(4);
                    window.toastify(data.message, "success");
                }
            })
            .catch((err) => {
                console.error("Frontend POST error", err.message);
                window.toastify(err?.response?.data?.message || "Something went wrong while sending verification email", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleSubmit = async () => {
        setLoading(true)

        const payload = {
            ...state,
            verificationCode: enteredCode,
            ...(referralCodeFromUrl ? { referralCode: referralCodeFromUrl } : {})
        };

        try {
            const res = await axios.post(`${import.meta.env.VITE_HOST}/auth/seller/signup`,
                payload,
                {
                    headers: { "Content-Type": "application/json" }
                })

            if (res.status === 201) {
                setState(initialState)
                setConfirmPwd("")
                setActiveTab(5)
            }
        } catch (err) {
            window.toastify(err.response?.data?.message || "Something went wrong", "error")
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className='w-full min-h-screen flex justify-center items-center bg-gray-100 p-2.5 sm:p-6'>
            <div className='w-full max-w-[800px] bg-white p-4 sm:p-6 rounded-xl shad'>
                <span onClick={() => navigate("/")} className='w-fit flex items-center gap-1 text-primary cursor-pointer mb-6 hover:opacity-50'><FiChevronLeft /> Back to Home</span>
                {
                    activeTab < 4 &&
                    <>
                        <div className='flex justify-between items-center mb-6'>
                            <p className='w-10 h-10 text-[var(--primary)] flex justify-center items-center rounded-full border border-[var(--primary)]'>1</p>
                            <div className={`flex-1 h-[1px] ${activeTab >= 2 ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}></div>
                            <p className={`w-10 h-10 flex justify-center items-center rounded-full border ${activeTab >= 2 ? 'text-[var(--primary)] border-[var(--primary)]' : 'border-gray-300'}`}>2</p>
                            <div className={`flex-1 h-[1px] ${activeTab === 3 ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}></div>
                            <p className={`w-10 h-10 flex justify-center items-center rounded-full border ${activeTab === 3 ? 'text-[var(--primary)] border-[var(--primary)]' : 'border-gray-300'}`}>3</p>
                        </div>

                        <h2 className='text-xl text-[var(--primary)]'>Create your seller account</h2>
                        <p className='text-gray-700'>* Please fill all fields</p>
                    </>
                }

                {
                    activeTab === 1 ?
                        <div className='flex flex-col gap-4 mt-6'>
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='flex flex-1 flex-col gap-2'>
                                    <label className='text-sm font-semibold text-gray-700'>Fullname</label>
                                    <input
                                        type="text"
                                        name='fullname'
                                        value={state.fullname}
                                        placeholder="Enter fullname"
                                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-1 flex-col gap-2'>
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
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='flex flex-1 flex-col gap-2'>
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
                                <div className='flex flex-1 flex-col gap-2'>
                                    <label className='text-sm font-semibold text-gray-700'>Confirm Password</label>
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        value={confirmPwd}
                                        placeholder="Enter password again"
                                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                        onChange={e => setConfirmPwd(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        activeTab === 2 ?
                            <div className='flex flex-col gap-4 mt-6'>
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex flex-1 flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-700'>Phone Number</label>
                                        <input
                                            type="text"
                                            name='phoneNumber'
                                            value={state.phoneNumber}
                                            placeholder="Enter phone number"
                                            className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-1 flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-700'>Whatsapp Number</label>
                                        <input
                                            type="text"
                                            name='whatsappNumber'
                                            value={state.whatsappNumber}
                                            placeholder="Enter whatsapp number"
                                            className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-semibold text-gray-700'>Address</label>
                                    <input
                                        type="text"
                                        name='address'
                                        value={state.address}
                                        placeholder="Enter address"
                                        className="w-full border border-gray-300 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            :
                            activeTab === 3 ?
                                <div className='flex flex-col gap-4 mt-6'>
                                    <div className='flex flex-1 flex-col gap-4'>
                                        <label className='text-sm font-semibold text-gray-700'>Brand Name</label>
                                        <input
                                            type="text"
                                            name='brandName'
                                            value={state.brandName}
                                            placeholder="Enter brand name (e.g., gucci, versace, etc.)"
                                            className="w-full border border-gray-300 text-sm focus:outline-none focus:border-secondary"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                :
                                activeTab === 4 ?
                                    <div className='flex flex-col gap-4 mt-6'>
                                        <div className='flex flex-1 flex-col gap-4'>
                                            <label className='text-sm font-semibold text-gray-700'>Verification Code</label>
                                            <input
                                                type="text"
                                                name='enteredCode'
                                                value={enteredCode}
                                                placeholder="Enter verification code"
                                                className="w-full border border-gray-300 text-sm focus:outline-none focus:border-secondary"
                                                onChange={e => setEnteredCode(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex flex-col justify-center items-center'>
                                        <h2 className='text-2xl text-[var(--primary)]'>Congratulations!</h2>
                                        <p className='text-gray-900'>Your application has been submitted</p>
                                        <div className='flex justify-center items-center w-30 h-30 border-4 border-[#32ee32] rounded-full mt-6'>
                                            <IoCheckmark size={60} className='text-[#32ee32]' />
                                        </div>
                                        <p className='text-sm text-gray-900 mt-6'>You will receive a text msg from our team on your email or phone number</p>
                                    </div>
                }

                {
                    activeTab < 3 &&
                    <p className='flex items-center gap-2 w-fit text-sm text-[#01750f] bg-[#cff9d4] mt-8 px-4 py-1.5 rounded-[8px]'><RiSecurePaymentFill /> Your data is 100% secured</p>
                }

                <div className='flex justify-end mt-8'>
                    {
                        activeTab > 1 && activeTab < 3 ?
                            <div className='flex gap-3'>
                                <button className='flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-gray-300' onClick={() => setActiveTab(prev => prev - 1)}>Go Back</button>
                                <button className='flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/50' onClick={handleNext}>Next <FiArrowRight /></button>
                            </div>
                            :
                            activeTab === 1 ?
                                <button className='flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/50' onClick={handleNext}>Next <FiArrowRight /></button>
                                :
                                activeTab === 3 ?
                                    <div className='flex gap-3'>
                                        <button className='flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-gray-300' onClick={() => setActiveTab(prev => prev - 1)}>Go Back</button>
                                        <button className='flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/50'
                                            disabled={loading}
                                            onClick={handleSendVerificationEmail}
                                        >
                                            {
                                                !loading ?
                                                    <>Submit <FiSend /></>
                                                    :
                                                    <>Please wait...</>
                                            }
                                        </button>
                                    </div>
                                    :
                                    activeTab === 4 ?
                                        <div className='flex gap-3'>
                                            <button className='flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-gray-300' onClick={() => setActiveTab(prev => prev - 1)}>Go Back</button>
                                            <button className='flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/50'
                                                disabled={loading}
                                                onClick={handleSubmit}
                                            >
                                                {
                                                    !loading ?
                                                        <>Verify</>
                                                        :
                                                        <>Please wait...</>
                                                }
                                            </button>
                                        </div>
                                        :
                                        <button className='flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-2 rounded-[4px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/50' onClick={() => navigate("/")}>Finish</button>
                    }
                </div>
            </div>
        </div >
    )
}