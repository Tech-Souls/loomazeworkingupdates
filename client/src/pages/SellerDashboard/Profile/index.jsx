import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSellerAuthContext } from '../../../contexts/SellerAuthContext'
import ButtonLoader from '../../../components/ButtonLoader'
import axios from 'axios'

const initialState = { brandName: "", username: "", fullname: "", email: "", address: "", phoneNumber: "", whatsappNumber: "", cnic: "" }
const passwordInititalState = { currentPassword: "", newPassword: "", confirmNewPassword: "" }

export default function Profile() {
    const { user, dispatch } = useSellerAuthContext()
    const [state, setState] = useState(initialState)
    const [password, setPassword] = useState(passwordInititalState)
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            setState({
                brandName: user.brandName || "",
                username: user.username || "",
                fullname: user.fullname || "",
                email: user.email || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                whatsappNumber: user.whatsappNumber || "",
                cnic: user.cnic || ""
            })
        }
    }, [user])

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
    const handlePasswordChange = e => setPassword(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSaveChanges = () => {
        setLoading(true)
        axios.patch(`${import.meta.env.VITE_HOST}/seller/profile/update/${user.userID}`, state)
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    dispatch({ type: "SET_PROFILE", payload: { user: data.updatedUser } })
                    window.toastify(data.message, "success")
                } else {
                    window.toastify(data.message, "info")
                }
            })
            .catch(err => {
                window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error")
            })
            .finally(() => setLoading(false))
    }
    console.log('user in profile:', user);
    
    const storeUrl = window.location.origin.replace("seller.", "");
    let brandUrl= `${user?.brandSlug}`;
    const handleChangePassword = () => {
        if (!password.currentPassword || !password.newPassword || !password.confirmNewPassword) {
            return window.toastify("Please fill all password fields.", "warning");
        }

        setPasswordLoading(true)
        axios.patch(`${import.meta.env.VITE_HOST}/seller/profile/change-password/${user.userID}`, password)
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setPassword(passwordInititalState)
                    window.toastify(data.message, "success")
                } else {
                    window.toastify(data.message, "warning")
                }
            })
            .catch(err => {
                window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error")
            })
            .finally(() => setPasswordLoading(false))
    }


    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Profile</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Change your account profile settings.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Dashboard / Profile</p>

                <p className='w-fit bg-yellow-50 text-yellow-600 text-xs px-2 py-1 my-4'>All fields with * are mandatory</p>

                <div className='flex flex-col gap-4 w-full max-w-3xl bg-white p-6 mb-6 light-shad'>
                    <h1 className='text-sm text-[var(--primary)]'>Brand Details</h1>

                    <div>
                        <label className='text-xs font-bold text-gray-900'>Brand Name *</label>
                        <input type="text" name="brandName" id="brandName" value={state.brandName} placeholder='Enter your brand name' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                    </div>
                    {/* //add link to brand page */}
                    <div>
                        <label className="text-xs font-bold text-gray-900">Brand Website Link</label>
<p className="block w-full text-sm !p-3 bg-gray-100 border border-gray-300 !rounded-none mt-3  break-all">
  <a
    href={`${storeUrl}/brand/${user?.brandSlug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    {`${storeUrl}/brand/${user?.brandSlug}`}
  </a>
</p>

                    </div>
                    <button className='text-xs font-bold text-gray-800'>To manage your Brand Settings and Store Theme, {" "}
                        <span className='text-[var(--primary)] hover:underline' onClick={() => navigate("/seller/store/settings/theme")}>click here</span>
                    </button>
                </div>

                <div className='flex flex-col gap-4 w-full max-w-3xl bg-white p-6 light-shad'>
                    <h1 className='text-sm text-[var(--primary)] mt-2'>Account Details</h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Username *</label>
                            <input type="text" name="username" id="username" value={state.username} placeholder='Enter your username' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Fullname *</label>
                            <input type="text" name="fullname" id="fullname" value={state.fullname} placeholder='Enter your fullname' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-900'>Email Address *</label>
                        <input type="email" name="email" id="email" value={state.email} placeholder='Enter your email address' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                    </div>

                    <h1 className='text-sm text-[var(--primary)] mt-2'>Personal Details</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Address</label>
                            <input type="text" name="address" id="address" value={state.address} placeholder='Enter your address' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Phone Number</label>
                            <input type="text" name="phoneNumber" id="phoneNumber" value={state.phoneNumber} placeholder='Enter your phone number' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Whatsapp Number</label>
                            <input type="text" name="whatsappNumber" id="whatsappNumber" value={state.whatsappNumber} placeholder='Enter your phone number' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>CNIC *</label>
                            <input type="text" name="cnic" id="cnic" value={state.cnic} placeholder='Enter your cnic number' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-3xl flex justify-end mt-6 border-b border-gray-300 pb-8'>
                    <button className='flex gap-2 items-center px-6 py-2.5 text-xs text-white bg-[var(--primary)] font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                        disabled={loading}
                        onClick={handleSaveChanges}
                    >
                        {!loading ?
                            'Save Changes' :
                            <>Saving <ButtonLoader /></>
                        }
                    </button>
                </div>

                <div className='flex flex-col gap-4 w-full max-w-3xl bg-white p-6 mt-8 light-shad'>
                    <h1 className='text-sm text-[var(--primary)]'>Change Password</h1>

                    <div>
                        <label className='text-xs font-bold text-gray-900'>Current Password *</label>
                        <input type="text" name="currentPassword" id="currentPassword" value={password.currentPassword} placeholder='Enter your old password' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handlePasswordChange} />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-900'>New Password *</label>
                        <input type="text" name="newPassword" id="newPassword" value={password.newPassword} placeholder='Enter your new password' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handlePasswordChange} />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-900'>Confirm New Password *</label>
                        <input type="text" name="confirmNewPassword" id="confirmNewPassword" value={password.confirmNewPassword} placeholder='Confirm your new password' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className='w-full max-w-3xl flex justify-end mt-6 pb-8'>
                    <button className='flex gap-2 items-center px-6 py-2.5 text-xs text-white bg-[var(--primary)] font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                        disabled={passwordLoading}
                        onClick={handleChangePassword}
                    >
                        {!passwordLoading ?
                            'Update Password' :
                            <>Updating <ButtonLoader /></>
                        }
                    </button>
                </div>
            </div>
        </>
    )
}