import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import ButtonLoader from "../../../components/ButtonLoader";
import axios from "axios";

const initialInformation = { username: "", email: "", phoneNumber: null, dob: null, gender: null }
const initialPasswordState = { oldPassword: "", newPassword: "", confirmPassword: "" }

export default function Profile() {
    const { user, dispatch } = useAuthContext()
    const [information, setInformation] = useState(initialInformation)
    const [savingInformation, setSavingInformation] = useState(false)
    const [passwordFields, setPasswordFields] = useState(initialPasswordState)
    const [changingPassword, setChangingPassword] = useState(false)

    useEffect(() => {
        if (user._id) {
            setInformation(prev => ({
                ...prev,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dob: user.dob,
                gender: user.gender
            }))
        }
    }, [user])

    const handleInformationChange = e => setInformation(s => ({ ...s, [e.target.name]: e.target.value }))
    const handlePasswordFieldsChange = e => setPasswordFields(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSaveInformation = () => {
        if (!information.username || !information.email) return window.toastify("Username and email is required!", "error")
        if (!information.phoneNumber) return window.toastify("Phone number is required!", "error")

        const updateData = {
            ...information,
            brandSlug: user.brandSlug
        };

        setSavingInformation(true)
        axios.put(`${import.meta.env.VITE_HOST}/user/profile/update-information/${user._id}`, updateData)
            .then(res => {
                if (res.data.user) {
                    dispatch({ type: "SET_PROFILE", payload: { user: res.data.user } });
                }
                window.toastify(res.data.message, "success")
            })
            .catch(err => {
                window.toastify(err.response.data.message, "error")
            })
            .finally(() => setSavingInformation(false))
    }

    const handleChangePassword = () => {
        setChangingPassword(true)
        axios.put(`${import.meta.env.VITE_HOST}/user/profile/change-password/${user._id}`, passwordFields)
            .then(res => {
                setPasswordFields(initialPasswordState);
                window.toastify(res.data.message, "success")
            })
            .catch(err => {
                window.toastify(err.response.data.message, "error")
            })
            .finally(() => setChangingPassword(false))
    }

    return (
        <div className="w-full p-6 space-y-8 rounded-[12px] ">
            {/* Profile Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Profile</h2>
                <div className="flex items-center gap-8">
                    <div className="flex justify-center items-center w-20 h-20 bg-gray-200 rounded-full">
                        <p className="text-sm text-gray-600 font-bold">AB</p>
                    </div>
                    <label className="bg-[#5788fc] text-white px-3 py-1.5 text-xs sm:px-4 sm:py-2 rounded-[8px] cursor-pointer inline-block  ">
                        Update Picture
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="w-full  grid sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Username *</label>
                        <input
                            type="text"
                            name="username"
                            value={information.username}
                            placeholder="Will Smith"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handleInformationChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={information.email}
                            placeholder="will@gmail.com"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handleInformationChange}
                        />
                    </div>

                    <div>
                        <label className=" block text-xs text-gray-900 font-bold mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={information.phoneNumber || ""}
                            placeholder="+12 455 939894"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handleInformationChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={information.dob ? information.dob.split("T")[0] : ""}
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handleInformationChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Select Gender</label>
                        <select
                            name="gender"
                            value={information.gender || ""}
                            className="text-sm border border-gray-300 rounded-[12px] p-3 sm:p-4 w-full cursor-pointer outline-none"
                            onChange={handleInformationChange}
                        >
                            <option value="" disabled>Select a gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Save Button */}
                <button className="text-sm bg-[#5788fc] text-white px-6 py-2 rounded-[8px] mt-6 transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50"
                    disabled={savingInformation}
                    onClick={handleSaveInformation}
                >
                    {!savingInformation ? 'Save Changes' : <ButtonLoader />}
                </button>
            </div>

            {/* Password Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Password</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordFields.oldPassword}
                            placeholder="Enter old password"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handlePasswordFieldsChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordFields.newPassword}
                            placeholder="Enter new password"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handlePasswordFieldsChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordFields.confirmPassword}
                            placeholder="Confirm new password"
                            className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full"
                            onChange={handlePasswordFieldsChange}
                        />
                    </div>
                </div>
            </div>

            {/* Change Password Button */}
            <button className="text-sm bg-[#5788fc] text-white px-6 py-2 rounded-[8px] transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50"
                disabled={changingPassword}
                onClick={handleChangePassword}
            >
                {!changingPassword ? 'Change Password' : <ButtonLoader />}
            </button>
        </div>
    );
}