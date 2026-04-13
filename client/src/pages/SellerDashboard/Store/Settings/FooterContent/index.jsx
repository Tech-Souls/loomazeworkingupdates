import React, { useState, useEffect } from 'react'
import { IoMdCheckmark } from "react-icons/io";
import ButtonLoader from '../../../../../components/ButtonLoader'
import axios from 'axios'

const supportInitialState = { email: null, phoneNumber: null, whatsappNumber: null }
const socialsInitialState = { facebook: {}, instagram: {}, tiktok: {}, x: {}, youtube: {}, snapchat: {} }

export default function FooterContent({ user, settings, setSettings }) {
    const [menus, setMenus] = useState([])
    const [selectedMenu1, setSelectedMenu1] = useState(settings?.content?.footerMenu1Name)
    const [selectedMenu2, setSelectedMenu2] = useState(settings?.content?.footerMenu2Name)
    const [footerMenu1Saving, setfooterMenu1Saving] = useState(false)
    const [footerMenu2Saving, setfooterMenu2Saving] = useState(false)
    const [footerDescriptionState, setFooterDescriptionState] = useState("")
    const [supportState, setSupportState] = useState(supportInitialState)
    const [socialsState, setSocialsState] = useState(socialsInitialState)
    const [footerDescriptionSaving, setFooterDescriptionSaving] = useState(false)
    const [supportSaving, setSupportSaving] = useState(false)
    const [socialsSaving, setSocialsSaving] = useState(false)
    const [loadingMenus, setLoadingMenus] = useState(true)

    useEffect(() => {
        setFooterDescriptionState(settings?.footerDescription)

        const { email, phoneNumber, whatsappNumber } = settings?.support
        setSupportState({ email, phoneNumber, whatsappNumber })

        const { facebook, instagram, tiktok, x, youtube, snapchat } = settings?.socials
        setSocialsState({ facebook, instagram, tiktok, x, youtube, snapchat })
    }, [settings])

    useEffect(() => {
        if (!settings.sellerID) return
        fetchMenuItems()
    }, [settings?.sellerID])

    const fetchMenuItems = () => {
        setLoadingMenus(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/footer-content/fetch-menus?sellerID=${settings?.sellerID}`)
            .then(res => {
                setMenus(res.data.menus)
            })
            .catch(err => console.error(err?.response?.data?.message || "Something went wrong while fetching menus!"))
            .finally(() => setLoadingMenus(false))
    }

    const handleSupportChange = e => setSupportState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSocialsLinksChange = e => setSocialsState(s => ({
        ...s,
        [e.target.name]: {
            ...s[e.target.name],
            link: e.target.value,
        },
    }))

    const handleToggleShow = item => setSocialsState(s => ({
        ...s,
        [item]: {
            ...s[item],
            show: !s[item].show,
        },
    }))

    const handleUpdateFooterMenu1 = () => {
        setfooterMenu1Saving(true)
        axios.patch(`${import.meta.env.VITE_HOST}/seller/footer-content/update-footer-menu-1/${settings?.sellerID}`, { selectedMenu1 })
            .then(res => {
                setSettings(prev => ({
                    ...prev,
                    content: {
                        ...prev.content,
                        footerMenu1Name: selectedMenu1
                    }
                }))
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response.data.message, "error"))
            .finally(() => setfooterMenu1Saving(false))
    }

    const handleUpdateFooterMenu2 = () => {
        setfooterMenu2Saving(true)
        axios.patch(`${import.meta.env.VITE_HOST}/seller/footer-content/update-footer-menu-2/${settings?.sellerID}`, { selectedMenu2 })
            .then(res => {
                setSettings(prev => ({
                    ...prev,
                    content: {
                        ...prev.content,
                        footerMenu2Name: selectedMenu2
                    }
                }))
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response.data.message, "error"))
            .finally(() => setfooterMenu2Saving(false))
    }

    const handleSaveFooterDescriptionChanges = () => {
        setFooterDescriptionSaving(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/footer-content/footer-description/update/${user._id}`, { footerDescriptionState })
            .then(res => {
                const { status } = res
                if (status === 202) {
                    setSettings(prev => ({
                        ...prev, footerDescription: footerDescriptionState.trim()
                    }))
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setFooterDescriptionSaving(false))
    }

    const handleSaveSupportChanges = () => {
        setSupportSaving(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/footer-content/support/update/${user._id}`, supportState)
            .then(res => {
                const { status } = res
                if (status === 202) {
                    setSettings(prev => ({
                        ...prev, support: supportState
                    }))
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setSupportSaving(false))
    }

    const handleSaveSocialsChanges = () => {
        setSocialsSaving(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/footer-content/socials/update/${user._id}`, socialsState)
            .then(res => {
                const { status } = res
                if (status === 202) {
                    setSettings(prev => ({
                        ...prev, socials: socialsState
                    }))
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setSocialsSaving(false))
    }

    return (
        <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
                <div>
                    <h1 className='text-[#333]'>Quick Links Menu</h1>
                    <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>Select a menu to display on your store footer quick links</p>

                    <div className='flex flex-1 flex-col gap-6 bg-white p-6 light-shad'>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Select Menu</label>
                            {loadingMenus ?
                                <p className='mt-3 text-sm'>Loading...</p>
                                :
                                <select name="footerMenu1Name" id="footerMenu1Name" value={selectedMenu1} className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={e => setSelectedMenu1(e.target.value)}>
                                    <option value="" disabled>Select a menu</option>
                                    {menus.map(menu => (
                                        <option key={menu._id} value={menu.name}>{menu.name}</option>
                                    ))}
                                </select>
                            }
                        </div>

                        <div className='flex justify-end gap-2'>
                            <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                                disabled={footerMenu1Saving}
                                onClick={handleUpdateFooterMenu1}
                            >
                                {!footerMenu1Saving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className='text-[#333]'>Customer Support Menu</h1>
                    <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>Select a menu to display on your store footer customer support</p>

                    <div className='flex flex-1 flex-col gap-6 bg-white p-6 light-shad'>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Select Menu</label>
                            {loadingMenus ?
                                <p className='mt-3 text-sm'>Loading...</p>
                                :
                                <select name="footerMenu2Name" id="footerMenu2Name" value={selectedMenu2} className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={e => setSelectedMenu2(e.target.value)}>
                                    <option value="" disabled>Select a menu</option>
                                    {menus.map(menu => (
                                        <option key={menu._id} value={menu.name}>{menu.name}</option>
                                    ))}
                                </select>
                            }
                        </div>

                        <div className='flex justify-end gap-2'>
                            <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                                disabled={footerMenu2Saving}
                                onClick={handleUpdateFooterMenu2}
                            >
                                {!footerMenu2Saving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1 className='text-[#333]'>Footer Description</h1>
                <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>This description will be displayed on your store footer</p>

                <div className='w-full max-w-3xl flex flex-col gap-6 bg-white p-6 light-shad'>
                    <div>
                        <label className='text-xs font-bold text-gray-900'>Description</label>
                        <input type="text" name="footerDescription" id="footerDescription" value={footerDescriptionState} placeholder='Enter description' className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={e => setFooterDescriptionState(e.target.value)} />
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                            disabled={footerDescriptionSaving}
                            onClick={handleSaveFooterDescriptionChanges}
                        >
                            {!footerDescriptionSaving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h1 className='text-[#333]'>Support Settings</h1>
                <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>These support settings will be used to display on your website footer for contact purpose</p>

                <div className='w-full max-w-3xl flex flex-col gap-6 bg-white p-6 light-shad'>
                    <div>
                        <label className='text-xs font-bold text-gray-900'>Support Email</label>
                        <input type="email" name="email" id="email" value={supportState.email || ""} placeholder='Enter email for contact' className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={handleSupportChange} />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Phone Number</label>
                            <input type="text" name="phoneNumber" id="phoneNumber" value={supportState.phoneNumber || ""} placeholder='Enter phone number for contact' className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={handleSupportChange} />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-900'>Whatsaspp Number</label>
                            <input type="text" name="whatsappNumber" id="whatsappNumber" value={supportState.whatsappNumber || ""} placeholder='Enter whatsapp number for contact' className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={handleSupportChange} />
                        </div>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                            disabled={supportSaving}
                            onClick={handleSaveSupportChanges}
                        >
                            {!supportSaving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h1 className='text-[#333]'>Socials</h1>
                <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>These social icons will be display on your store footer</p>

                <div className='w-full max-w-3xl flex flex-col gap-6 bg-white p-6 light-shad'>
                    <p className='text-xs text-blue-600'>Check mark the links you want to display</p>

                    {["facebook", "instagram", "tiktok", "x", "youtube", "snapchat"].map((item, i) => (
                        <div>
                            <label className='text-xs font-bold text-gray-900 capitalize'>{item}</label>
                            <div className='flex w-full gap-1 mt-3'>
                                <div className='w-fit flex justify-center items-center gap-2 border border-gray-300 px-2.5'>
                                    <span className='text-xs text-gray-700'>Show</span>
                                    <button className={`border ${socialsState[item].show ? "border-blue-500" : "border-gray-300"}`}
                                        onClick={() => handleToggleShow(item)}
                                    >
                                        {socialsState[item].show ? <IoMdCheckmark className='bg-blue-500 text-white' /> : <IoMdCheckmark className='bg-white text-white' />}
                                    </button>
                                </div>

                                <div className='w-full'>
                                    <input type="text" name={item} id={item} value={socialsState[item].link || ""} placeholder='Paste your facebook account link here' className='text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={handleSocialsLinksChange} />
                                </div>
                            </div>
                        </div>
                    ))}


                    <div className='flex justify-end gap-2'>
                        <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                            disabled={socialsSaving}
                            onClick={handleSaveSocialsChanges}
                        >
                            {!socialsSaving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}