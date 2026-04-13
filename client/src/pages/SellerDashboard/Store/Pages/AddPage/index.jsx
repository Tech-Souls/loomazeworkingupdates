import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useSellerAuthContext } from '../../../../../contexts/SellerAuthContext';
import ButtonLoader from '../../../../../components/ButtonLoader';
import Loader from '../../../../../components/Loader';
import axios from 'axios';

const initialState = { title: "", content: "", visibility: true, slug: "" }

export default function AddPage() {
    const { user } = useSellerAuthContext()
    const [state, setState] = useState(initialState)
    const [settings, setSettings] = useState({})
    const [settingsLoading, setSettingsLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!user?._id) return
        fetchSettings()
    }, [user?._id])

    const fetchSettings = () => {
        setSettingsLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/pages/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings || {})
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setSettingsLoading(false))
    }

    const handleTitleChange = e => {
        setState(prev => ({
            ...prev,
            title: e.target.value,
            slug: e.target.value.trim().toLowerCase().replaceAll(" ", "-")
        }))
    }

    const handleSlugChange = e => {
        setState(prev => ({
            ...prev,
            slug: e.target.value.trim().toLowerCase().replaceAll(" ", "-")
        }))
    }

    const handleSave = () => {
        setSaving(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/pages/create-page?sellerID=${user._id}`, state)
            .then(res => {
                window.toastify(res.data.message, "success")
                setState(initialState)
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong. Please try again!", "error")
                console.error(err.response?.data?.message)
            })
            .finally(() => setSaving(false))
    }

    if (settingsLoading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Add Page</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create a new page here to show on your store.</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Add Page</p>

                    <button className='flex items-center gap-2 text-xs bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg transition-all duration-150 ease-linear hover:opacity-80 disabled:opacity-60'
                        disabled={saving || !state.title}
                        onClick={handleSave}
                    >
                        {saving ? <ButtonLoader /> : "Save"}
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 mt-6'>
                    <div className='w-full max-w-3xl p-4 sm:p-6 bg-white light-shad'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <label className='text-sm text-gray-900 font-bold'>Title</label>
                                <input type="text" name="title" id="title" value={state.title} placeholder='e.g., about us, contact us, etc.' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleTitleChange} />
                            </div>
                            <div>
                                <label className='text-sm text-gray-900 font-bold'>Content</label>
                                <ReactQuill theme="snow" value={state.content} className='block w-full text-sm bg-white border border-none !rounded-none mt-3 mb-12 h-[200px]' onChange={(val) => setState((prev) => ({ ...prev, content: val }))} />
                            </div>
                        </div>
                    </div>

                    <div className='w-full max-w-[450px] h-fit p-4 sm:p-6 bg-white light-shad'>
                        <p className='text-sm text-gray-900 font-bold'>Visibility</p>

                        <div className='flex flex-col gap-2.5 mt-4'>
                            <button className='flex items-center gap-2'
                                onClick={() => setState(prev => ({
                                    ...prev, visibility: false
                                }))}
                            >
                                <span className={`inline-block w-2 h-2 bg-white p-1 border-4 rounded-full transition-all duration-100 ease-linear
                                    ${!state.visibility ? "border-[var(--secondary)]" : "border-gray-600"}`}
                                ></span>
                                <span className='text-sm text-gray-800'>Hidden</span>
                            </button>
                            <button className='flex items-center gap-2'
                                onClick={() => setState(prev => ({
                                    ...prev, visibility: true
                                }))}
                            >
                                <span className={`inline-block w-2 h-2 bg-white p-1 border-4 rounded-full transition-all duration-100 ease-linear
                                    ${state.visibility ? "border-[var(--secondary)]" : "border-gray-600"}`}
                                ></span>
                                <span className='text-sm text-gray-800'>Visible</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-3xl p-4 sm:p-6 bg-white light-shad mt-4 sm:mt-6'>
                    <div>
                        <label className='text-sm text-gray-900 font-bold'>URL Slug</label>
                        <input type="text" name="slug" id="slug" value={state.slug} placeholder='You can edit your URL of page' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleSlugChange} />
                        <p className='text-xs text-gray-600 mt-1'>
                            {settings?.domain
                                ? `${settings.domain}/pages/${state.slug}`
                                : `${import.meta.env.VITE_MAIN_DOMAIN}/brand/${settings?.brandSlug}/pages/${state.slug}`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}