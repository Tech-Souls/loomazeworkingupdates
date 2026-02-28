import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { BiX } from "react-icons/bi"
import axios from 'axios'
import { Heart, ShoppingBag, Search } from 'lucide-react'

export default function PlatformHeader({ settings, isCustomDomain, themeType }) {
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    const [mainMenuItems, setMainMenuItems] = useState([])
    const [cartLength, setCartLength] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [loadingMainMenuItems, setLoadingMainMenuItems] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hovered, setHovered] = useState(false)

    const isLuxury = themeType === 'luxury'

    // ✅ ALL themes get transparent header over their hero slider
    // Goes white when scrolled past hero or hovered
    const isTransparent = !scrolled && !hovered

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (!settings?.sellerID) return
        fetchMainMenuItems()
    }, [settings?.sellerID])

    const fetchMainMenuItems = async () => {
        try {
            setLoadingMainMenuItems(true)
            const res = await axios.get(
                `${import.meta.env.VITE_HOST}/platform/home/fetch-main-menu`,
                {
                    params: {
                        sellerID: settings?.sellerID,
                        headerMenuName: settings?.content?.headerMenuName || ""
                    }
                }
            )
            setMainMenuItems(res?.data?.mainMenuItems?.links || [])
        } catch (error) {
            console.error("Menu fetch error:", error?.response?.data?.message || error.message)
        } finally {
            setLoadingMainMenuItems(false)
        }
    }

    useEffect(() => {
        setCartLength(user?.cart?.length || 0)
    }, [user?.cart])

    const handleSearch = () => {
        if (!searchText.trim()) return
        navigate(
            isCustomDomain
                ? `/products?s=${searchText.trim()}`
                : `/brand/${settings?.brandSlug}/pages/products?s=${searchText.trim()}`
        )
    }

    const handleAuthNavigation = (path) => {
        if (location.pathname !== '/auth/login' && location.pathname !== '/auth/signup') {
            sessionStorage.setItem('redirectPath', location.pathname)
        }
        navigate(path)
    }

    // ─── Header style helpers ────────────────────────────────────────────────
    // ALL themes: fixed + transparent over hero, turns white on scroll/hover
    const headerBg  = isTransparent ? 'bg-transparent shadow-none' : 'bg-white shadow-sm'
    const textColour = isTransparent ? 'text-white' : 'text-black'
    const menuHover  = isTransparent ? 'hover:text-gray-200' : 'hover:text-gray-500'
    const inputBorder = isTransparent
        ? 'border-white text-white placeholder:text-white/70'
        : 'border-gray-300 text-black placeholder:text-gray-400'
    const searchBtnBg = isTransparent ? 'bg-white/20 hover:bg-white/40' : 'bg-black hover:bg-gray-800'

    return (
        <>
            {/* ================= HEADER ================= */}
            <header
                className={`fixed flex justify-between items-center gap-8 px-4 sm:px-8 py-4 w-full z-50 transition-all duration-300 ${headerBg}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Left: Logo + Desktop Nav */}
                <div className="flex items-center gap-10">
                    <h1
                        role="button"
                        className={`uppercase text-2xl md:text-4xl cursor-pointer font-bold tracking-widest transition-colors duration-300 ${textColour}`}
                        onClick={() => navigate(isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`)}
                    >
                        {settings?.brandName || "Brand"}
                    </h1>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {loadingMainMenuItems ? (
                            <span className="text-sm text-gray-400">Loading...</span>
                        ) : (
                            mainMenuItems.map(item => (
                                <button
                                    key={item._id}
                                    onClick={() =>
                                        navigate(
                                            isCustomDomain
                                                ? `/${item.url}`
                                                : `/brand/${settings?.brandSlug}${item.url}`
                                        )
                                    }
                                    className={`text-sm font-semibold transition-colors duration-300 ${textColour} ${menuHover}`}
                                >
                                    {item.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Search + Icons */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="relative w-60">
                        <input
                            type="text"
                            value={searchText}
                            placeholder="Search products..."
                            className={`w-full border px-4 py-2 text-sm bg-transparent outline-none transition-colors duration-300 ${inputBorder}`}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <div
                            onClick={handleSearch}
                            className={`absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer transition-colors duration-300 ${searchBtnBg}`}
                        >
                            <Search size={18} color="white" />
                        </div>
                    </div>

                    <button onClick={() => navigate(isCustomDomain ? "/customer/favourites" : `/brand/${settings?.brandSlug}/customer/favourites`)}>
                        <Heart size={20} className={`transition-colors duration-300 ${textColour}`} />
                    </button>

                    <button
                        className="relative"
                        onClick={() => handleAuthNavigation(isCustomDomain ? "/cart" : `/brand/${settings?.brandSlug}/cart`)}
                    >
                        <ShoppingBag size={20} className={`transition-colors duration-300 ${textColour}`} />
                        {cartLength > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {cartLength}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <div className="lg:hidden">
                    <HiOutlineMenuAlt3
                        size={24}
                        className={`cursor-pointer transition-colors duration-300 ${textColour}`}
                        onClick={() => setMobileMenuOpen(true)}
                    />
                </div>
            </header>

            {/* ================= MOBILE SIDEBAR ================= */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60]">
                    <div className="w-72 bg-white h-full p-6">
                        <BiX size={28} className="cursor-pointer mb-6" onClick={() => setMobileMenuOpen(false)} />
                        <ul className="flex flex-col gap-4">
                            {mainMenuItems.map(item => (
                                <li key={item._id}>
                                    <button
                                        onClick={() => {
                                            navigate(isCustomDomain ? `/${item.url}` : `/brand/${settings?.brandSlug}${item.url}`)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="text-left w-full text-sm font-semibold text-black hover:text-gray-500"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* ================= LUXURY HERO (video) ================= */}
            {/* Non-luxury hero sliders are rendered in Home.jsx — NOT here */}
            {isLuxury && (
                <div className="relative h-screen w-full overflow-hidden">
                    <video
                        autoPlay loop muted playsInline
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    >
                        <source src="/video/video.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-24 left-6 md:left-20 text-white max-w-xl z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase">
                            Timeless Style For <br /> Modern Trends
                        </h2>
                        <button
                            onClick={() => navigate(isCustomDomain ? "/products" : `/brand/${settings?.brandSlug}/pages/products`)}
                            className="bg-white text-black px-8 py-4 text-xs font-bold uppercase hover:bg-black hover:text-white transition"
                        >
                            Shop All Products
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}