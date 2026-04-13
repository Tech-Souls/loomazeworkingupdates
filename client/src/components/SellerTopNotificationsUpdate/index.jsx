import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import axios from 'axios'
import ButtonLoader from '../ButtonLoader'

export default function SellerTopNotificationsUpdate({ user, settings, setSettings }) {
    const [topNotifications, setTopNotifications] = useState(settings.content.topNotifications)
    const [notificationText, setNoticationText] = useState("")
    const [loading, setLoading] = useState(false)
    const [deletionLoading, setDeletionLoading] = useState(false)

    const handleAddNotificationText = () => {
        if (!notificationText.trim()) return window.toastify("Please enter a notification text", "info")

        const updatedNotifications = [...topNotifications, notificationText.trim()]

        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/top-notifications/update/${user._id}`, updatedNotifications)
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setTopNotifications(updatedNotifications)
                    setSettings(prev => ({
                        ...prev,
                        content: { ...prev.content, topNotifications: updatedNotifications }
                    }))
                    setNoticationText("")
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    const handleDeleteNotificationText = (selected) => {
        const updatedNotifications = topNotifications.filter(noti => noti !== selected)

        setDeletionLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/top-notifications/update/${user._id}`, updatedNotifications)
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setTopNotifications(updatedNotifications)
                    setSettings(prev => ({
                        ...prev,
                        content: { ...prev.content, topNotifications: updatedNotifications }
                    }))
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setDeletionLoading(false))
    }

    return (
        <div className='p-4 border border-gray-200 mt-6'>
            <p className='head text-base text-gray-900 font-bold mb-4'>Top Notifications Bar</p>

            <div className='relative flex justify-center items-end p-3 w-full bg-gray-100 border border-gray-200'>
                <p className='text-sm text-gray-800'>{settings.content.topNotifications[0] || "Notification title"}</p>
                <ArrowLeft size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-700' />
                <ArrowRight size={16} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-700' />
            </div>

            <div className='mt-6'>
                <label className='block mb-3 text-sm font-bold text-gray-900'>Add Notification</label>
                <div className='flex'>
                    <input type="text" name="notificationText" id="notificationText" value={notificationText} placeholder='Type notifcation text to show' className='text-sm w-full max-w-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={e => setNoticationText(e.target.value)} />
                    <button className='text-xs bg-[var(--primary)] text-white px-4 transition-all duration-200 hover:bg-[var(--primary)]/70'
                        onClick={handleAddNotificationText}
                    >
                        {
                            !loading ?
                                'Add'
                                :
                                <span className='flex items-center gap-2'>Adding < ButtonLoader /></span>
                        }
                    </button>
                </div>
            </div>

            <p className='text-sm text-gray-900 font-bold mt-4 mb-2'>Notifications</p>
            <div className='flex flex-col gap-2'>
                {
                    topNotifications.map((noti, i) => (
                        <div key={i} className='max-w-md flex justify-between gap-4'>
                            <p className='text-sm text-gray-800'>{i + 1}. {noti}</p>
                            {
                                !deletionLoading ?
                                    <Trash2 size={16} className='text-red-500 cursor-pointer hover:opacity-70' onClick={() => handleDeleteNotificationText(noti)} />
                                    :
                                    <span className='w-6 h-6 border-t border-red-500 rounded-full animate-spin'></span>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}