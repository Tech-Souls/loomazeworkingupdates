import React, { useEffect, useState } from "react";
import { useUserAuthContext } from "../../../contexts/UserAuthContext";
import ButtonLoader from "../../../components/ButtonLoader";
import axios from "axios";

const initialInformation = { firstName: "", lastName: "", email: "", phoneNumber: null, dob: null, gender: null }
const initialPasswordState = { oldPassword: "", newPassword: "", confirmPassword: "" }

export default function Profile() {
    const { user, dispatch } = useUserAuthContext()
    const [information, setInformation] = useState(initialInformation)
    const [passwordFields, setPasswordFields] = useState(initialPasswordState)
    const [savingInformation, setSavingInformation] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    useEffect(() => {
        if (user._id) {
            setInformation(prev => ({
                ...prev,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user?.phoneNumber,
                dob: user?.dob,
                gender: user?.gender
            }))
        }
    }, [user])

    const handleInformationChange = e => setInformation(s => ({ ...s, [e.target.name]: e.target.value }))
    const handlePasswordFieldsChange = e => setPasswordFields(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSaveInformation = () => {
        setSavingInformation(true)
        axios.put(`${window.api}/loomaze/profile/update-information/${user._id}`, information)
            .then(res => {
                const { data } = res
                if (data.user) {
                    dispatch({ type: "SET_PROFILE", payload: { user: data.user } });
                }
                window.toastify(data.message, "success")
            })
            .catch(err => {
                window.toastify(err.response.data.message, "error")
            })
            .finally(() => setSavingInformation(false))
    }

    const handleChangePassword = () => {
        setChangingPassword(true)
        axios.put(`${window.api}/loomaze/profile/change-password/${user._id}`, passwordFields)
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
            <div>
                <h2 className="text-lg font-semibold mb-4">Profile</h2>
                <div className="w-full  grid sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">First Name *</label>
                        <input type="text" name="username" value={information.firstName} placeholder="Jhon" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handleInformationChange} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Last Name</label>
                        <input type="text" name="username" value={information.lastName} placeholder="Doe" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handleInformationChange} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Email Address *</label>
                        <input type="email" name="email" value={information.email} placeholder="will@gmail.com" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handleInformationChange} />
                    </div>

                    <div>
                        <label className=" block text-xs text-gray-900 font-bold mb-2">Phone Number</label>
                        <input type="text" name="phoneNumber" value={information.phoneNumber || ""} placeholder="+12 455 939894"  className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handleInformationChange} onBeforeInput={(e) => { if (!/^[0-9]$/.test(e.data)) e.preventDefault() }} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Date of Birth</label>
                        <input type="date" name="dob" value={information.dob ? information.dob.split("T")[0] : ""} className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handleInformationChange} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Select Gender</label>
                        <select name="gender" value={information.gender || ""} className="text-sm border border-gray-300 rounded-[12px] p-3 sm:p-4 w-full cursor-pointer outline-none" onChange={handleInformationChange}>
                            <option value="" disabled>Select a gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <button className="text-sm bg-[#5788fc] text-white px-6 py-2 rounded-[8px] mt-6 transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50" disabled={savingInformation} onClick={handleSaveInformation}>
                    {!savingInformation ? 'Save Changes' : <ButtonLoader />}
                </button>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">Password</h2>
                <div className="grid md:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Old Password</label>
                        <input type="password" name="oldPassword" value={passwordFields.oldPassword} placeholder="Enter old password" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handlePasswordFieldsChange} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">New Password</label>
                        <input type="password" name="newPassword" value={passwordFields.newPassword} placeholder="Enter new password" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handlePasswordFieldsChange} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-900 font-bold mb-2">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={passwordFields.confirmPassword} placeholder="Confirm new password" className="text-sm border border-gray-300 rounded-[12px] px-4 py-2 w-full" onChange={handlePasswordFieldsChange} />
                    </div>
                </div>
            </div>

            <button className="text-sm bg-[#5788fc] text-white px-6 py-2 rounded-[8px] transition-all duration-200 ease-out hover:opacity-70 disabled:opacity-50" disabled={changingPassword} onClick={handleChangePassword}>
                {!changingPassword ? 'Change Password' : <ButtonLoader />}
            </button>
        </div>
    );
}