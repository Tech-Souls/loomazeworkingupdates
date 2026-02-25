import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import Theme from './Theme'
import Layout from './Layout'
import Content from './Content'
import ProductPageLayout from './ProductPageLayout'
import HeaderContent from './HeaderContent'
import FooterContent from './FooterContent'
import Loader from '../../../../components/Loader'
import axios from 'axios'

export default function Settings() {
    const { user } = useSellerAuthContext()
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const location = useLocation()
    const page = location.pathname.split('/').pop()

    useEffect(() => {
        if (user?.brandSlug) {
            fetchSellerSettings()
        }
    }, [user?.brandSlug])

    const fetchSellerSettings = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/seller-settings/get?brandSlug=${user?.brandSlug}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setSettings(data?.settings)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    if (loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Settings</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Change settings of your store with various customization options.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold mb-8'><span className='text-gray-400'>Seller</span> / Store / Settings</p>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1'>
                    <button className={`${page === 'theme' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/theme')}
                    >
                        Store Theme
                    </button>
                    <button className={`${page === 'layout' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/layout')}
                    >
                        Home Layout
                    </button>
                    <button className={`${page === 'product-page-layout' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/product-page-layout')}
                    >
                        Product Page Layout
                    </button>
                    <button className={`${page === 'content' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/content')}
                    >
                        Home Content
                    </button>
                    <button className={`${page === 'header-content' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/header-content')}
                    >
                        Header Content
                    </button>
                    <button className={`${page === 'footer-content' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-b-1' : 'text-[#333] bg-gray-100'} flex-1 p-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 ease-linear`}
                        onClick={() => navigate('/seller/store/settings/footer-content')}
                    >
                        Footer Content
                    </button>
                </div>

                <div className='mt-6'>
                    <Routes>
                        <Route path='theme' element={<Theme user={user} settings={settings} setSettings={setSettings} />} />
                        <Route path='layout' element={<Layout user={user} settings={settings} setSettings={setSettings} />} />
                        <Route path='product-page-layout' element={<ProductPageLayout user={user} settings={settings} setSettings={setSettings} />} />
                        <Route path='content' element={<Content user={user} settings={settings} setSettings={setSettings} />} />
                        <Route path='header-content' element={<HeaderContent user={user} settings={settings} setSettings={setSettings} />} />
                        <Route path='footer-content' element={<FooterContent user={user} settings={settings} setSettings={setSettings} />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}