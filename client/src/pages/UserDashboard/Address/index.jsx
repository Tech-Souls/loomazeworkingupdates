import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { FaHome, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { useUserAuthContext } from "../../../contexts/UserAuthContext";
import axios from "axios";
import ButtonLoader from "../../../components/ButtonLoader";

const initialFormData = { province: "", city: "", address: "", place: "Home" }

export default function Address() {
    const { user, dispatch } = useUserAuthContext()
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setFormData(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        if (user._id) {
            setFormData(prev => ({
                ...prev,
                province: user.province, city: user.city, address: user.address, place: user.place || 'home'
            }))
        }
    }, [user])

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.province || !formData.city || !formData.address || !formData.place) {
            return window.toastify("Please fill all fields!", "warning")
        }

        setLoading(true)
        axios.put(`${window.api}/loomaze/address/update/${user._id}`, formData)
            .then(res => {
                window.toastify(res.data.message, "success")
                dispatch({ type: "SET_PROFILE", payload: { user: { ...user, ...formData } } });
            })
            .catch(err => window.toastify(err.response.data.message, "warning"))
            .finally(() => setLoading(false))
    };

    return (
        <div className="flex flex-col justify-center p-3 sm:p-6 md:p-10">
            <div className="bg-white w-full">
                <h2 className="head text-xl text-[var(--text)] font-bold mb-6">Add Shipping Address</h2>
                <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">State/Province *</label>
                        <input type="text" name="province" value={formData.province || ""} onChange={handleChange} className="w-full text-sm border border-gray-300 rounded-md" placeholder="Enter your Province" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">City *</label>
                        <input type="text" name="city" value={formData.city || ""} onChange={handleChange} className="w-full text-sm border border-gray-300 rounded-md" placeholder="Enter your City" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Address *</label>
                        <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full text-sm border border-gray-300 rounded-md" placeholder="Enter your address" required />
                    </div>

                    <button type="submit" className="w-full sm:w-auto bg-[#f58814] text-white font-semibold px-6 py-2 rounded-md hover:opacity-70 disabled:opacity-50" disabled={loading} onClick={handleSave}>
                        {!loading ? 'Save' : <ButtonLoader />}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mt-6 space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <FaMapMarkerAlt className="text-gray-600 text-lg" />
                        <span className="font-semibold text-gray-800 capitalize">{user?.place}</span>
                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded">
                            Default
                        </span>
                    </div>
                    <h2 className="head font-bold text-gray-800 text-sm sm:text-base">
                        {user?.fullName}
                    </h2>
                    {
                        user?.phoneNumber
                            ? <p className="text-gray-700 text-sm sm:text-base">{user?.phoneNumber}</p>
                            : <button className="text-sm text-blue-600 underline" onClick={() => navigate("/user/profile")}>Add phone number</button>
                    }
                </div>

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {user?.address} - {user?.province}, {user?.city}.
                    </p>
                </div>
            </div>
        </div>
    );
}