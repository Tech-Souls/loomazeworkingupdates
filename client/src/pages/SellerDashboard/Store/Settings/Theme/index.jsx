import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../../../../components/ButtonLoader';
import { Image, SquarePen } from 'lucide-react'
import axios from 'axios'

const initialState = {
    logo: null, favicon: null,
    theme: {
        primary: "",
        secondary: ""
    }
}

export default function Theme({ user, settings, setSettings }) {
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const logoImageRef = useRef()
    const [logoPreview, setLogoPreview] = useState(null)
    const faviconImageRef = useRef()
    const [faviconPreview, setFaviconPreview] = useState(null)

    useEffect(() => {
        setState({
            logo: settings.logo, favicon: settings.favicon,
            theme: {
                primary: settings.theme.primary,
                secondary: settings.theme.secondary
            }
        })
    }, [settings])

    const handleLogoChange = e => {
        const file = e.target.files[0]
        if (!file) return
        setState(prev => ({ ...prev, logo: file }))
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleFaviconChange = e => {
        const file = e.target.files[0]
        if (!file) return
        setState(prev => ({ ...prev, favicon: file }))
        setFaviconPreview(URL.createObjectURL(file))
    }

    const handleSaveChanges = () => {
        const formdata = new FormData()

        if (state.logo instanceof File) {
            formdata.append("logo", state.logo)
        } else if (state.logo) {
            formdata.append("logoPath", state.logo)
        }

        if (state.favicon instanceof File) {
            formdata.append("favicon", state.favicon)
        } else if (state.favicon) {
            formdata.append("faviconPath", state.favicon)
        }

        formdata.append("primaryColor", state.theme.primary)
        formdata.append("secondaryColor", state.theme.secondary)
        console.log([...formdata]);
        console.log("secondary", state.theme.secondary);
        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/theme/update/${user._id}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setSettings(prev => ({
                        ...prev,
                        logo: data.updatedData.logo,
                        favicon: data.updatedData.favicon,
                        theme: { ...data.updatedData.theme }
                    }))
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-[#333]'>Theme Settings</h1>
                <div className='flex justify-end gap-2'>
                    <button className='px-4 py-1.5 text-xs bg-gray-100 text-gray-800 font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-gray-200' onClick={() => navigate(-1)}>Cancel</button>
                    <button className='flex items-center gap-2 px-4 py-1.5 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                        disabled={loading}
                        onClick={handleSaveChanges}
                    >
                        {!loading ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-4 pb-4'>
                <div>
                    <label className='text-xs font-bold text-gray-900'>Website Logo</label>
                    <div className='flex items-center gap-5 mt-3'>
                        {
                            logoPreview ? (
                                <img src={logoPreview} alt="logo-preview" className='w-48 h-16 object-contain' />
                            ) : state.logo ? (
                                <img src={`${state.logo}`} alt="logo" loading='lazy' className='w-48 h-16 object-contain' />
                            ) : (
                                <div className='flex justify-center items-center bg-gray-100 w-48 h-16 border border-gray-200'>
                                    <Image className='text-gray-400' />
                                </div>
                            )
                        }
                        <div className='relative flex justify-center items-center bg-[#42b6e8] w-10 h-10 rounded-full cursor-pointer transition-all duration-200 ease-linear hover:bg-[#42b6e8]/50'
                            onClick={() => logoImageRef.current.click()}
                        >
                            <input type="file" name="logo" id="logo" accept="image/*" ref={logoImageRef} className='absolute inset-0 invisible rounded-full z-0' onChange={handleLogoChange} />
                            <SquarePen size={16} className='text-white z-1' />
                        </div>
                    </div>
                </div>

                <div>
                    <label className='text-xs font-bold text-gray-900'>Favicon</label>
                    <p className='w-fit bg-yellow-50 text-yellow-600 text-xs mt-1'>Recommended size: 16x16 or 32x32</p>
                    <div className='flex items-center gap-5 mt-3'>
                        {
                            faviconPreview ? (
                                <img src={faviconPreview} alt="favicon-preview" className='w-14 h-14 object-contain' />
                            ) : state.favicon ? (
                                <img src={`${state.favicon}`} alt="favicon" loading='lazy' className='w-14 h-14 object-contain' />
                            ) : (
                                <div className='flex justify-center items-center bg-gray-100 w-14 h-14 border border-gray-200'>
                                    <Image className='text-gray-400' />
                                </div>
                            )
                        }
                        <div className='relative flex justify-center items-center bg-[#42b6e8] w-10 h-10 rounded-full cursor-pointer transition-all duration-200 ease-linear hover:bg-[#42b6e8]/50'
                            onClick={() => faviconImageRef.current.click()}
                        >
                            <input type="file" name="favicon" id="favicon" accept="image/*" ref={faviconImageRef} className='absolute inset-0 invisible rounded-full z-0' onChange={handleFaviconChange} />
                            <SquarePen size={16} className='text-white' />
                        </div>
                    </div>
                </div>

                <div>
                    <label className='text-xs font-bold text-gray-900'>Theme Colors</label>
                    <div className="flex items-center gap-6 mt-3">
                        <div className="flex flex-col items-center">
                            <label className="text-[10px] font-semibold text-gray-600">Primary</label>
                            <input
                                type="color"
                                name="primary"
                                value={state.theme.primary}
                                className="w-10 h-10 mt-2 cursor-pointer border border-gray-300 light-shad"
                                onChange={e => setState({ ...state, theme: { ...state.theme, primary: e.target.value } })}
                            />
                            <span className="text-[10px] mt-1 text-gray-500">{state.theme.primary}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="text-[10px] font-semibold text-gray-600">Secondary</label>
                            <input
                                type="color"
                                name="secondary"
                                value={state.theme.secondary}
                                className="w-10 h-10 mt-2 cursor-pointer border border-gray-300 light-shad"
                                onChange={e => setState({ ...state, theme: { ...state.theme, secondary: e.target.value } })}
                            />
                            <span className="text-[10px] mt-1 text-gray-500">{state.theme.secondary}</span>
                        </div>
                    </div>
                </div>

                <div className='flex gap-4'>
                    <button className='px-12 py-4 text-sm text-white rounded-lg' style={{ backgroundColor: state.theme.primary }}>Primary</button>
                    <button className='px-12 py-4 text-sm text-white rounded-lg' style={{ backgroundColor: state.theme.secondary }}>Secondary</button>
                </div>

                <div className="w-full h-10 rounded-lg mb-4" style={{ background: `linear-gradient(90deg, ${state.theme.primary} 50%, ${state.theme.secondary} 50%)` }}></div>
            </div>
        </div>
    )
}