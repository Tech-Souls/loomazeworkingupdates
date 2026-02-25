import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiX } from "react-icons/bi"
import axios from 'axios'

export default function PlatformHeader({ settings, isCustomDomain }) {
    const { user } = useAuthContext()
    const [mainMenuItems, setMainMenuItems] = useState([])
    const [open, setOpen] = useState(false)
    const [cartLength, setCartLength] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [loadingMainMenuItems, setLoadingMainMenuItems] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    
    console.log("mainMenuItems: ", mainMenuItems)

    const handleAuthNavigation = (path) => {
        if (location.pathname !== '/auth/login' && location.pathname !== '/auth/signup') {
            sessionStorage.setItem('redirectPath', location.pathname);
        }

        navigate(path, {
            state: {
                from: {
                    pathname: location.pathname,
                    search: location.search,
                    hash: location.hash
                }
            }
        });
    }

    useEffect(() => {
        if (!settings.sellerID) return
        fetchMainMenuItems()
    }, [settings])

    const fetchMainMenuItems = () => {
        const headerMenuName = settings?.content?.headerMenuName

        setLoadingMainMenuItems(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-main-menu?sellerID=${settings?.sellerID}&headerMenuName=${headerMenuName}`)
            .then(res => {
                setMainMenuItems(res.data.mainMenuItems.links)
            })
            .catch(err => console.error(err?.response?.data?.message || "Something went wrong while fetching main menu items!"))
            .finally(() => setLoadingMainMenuItems(false))
    }

    useEffect(() => {
        setCartLength(user?.cart?.length || 0)
    }, [user?.cart])

    const handleSearch = () => {
        if (!searchText.trim()) return
        navigate(isCustomDomain ? `/products?s=${searchText.trim()}` : `/brand/${settings.brandSlug}/pages/products?s=${searchText.trim()}`)
    }

    return (
        <>
            <header className='flex justify-between items-center gap-8 px-3 sm:px-8 py-2 sm:py-3 lg:py-3.5 shad'>
                <div className='flex items-center gap-8'>
                    <h1 role='button' className='uppercase text-xl md:text-2xl cursor-pointer'
                        onClick={() => navigate(isCustomDomain ? `/` : `/brand/${settings?.brandSlug}`)}
                    >
                        {settings?.brandName}
                    </h1>

                    <div className='hidden lg:flex items-center gap-5'>
                        {loadingMainMenuItems ?
                            <>
                                <span className="w-16 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                <span className="w-20 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                <span className="w-14 h-3 bg-neutral-200 animate-pulse rounded"></span>
                            </>
                            :
                            mainMenuItems.map(item => (
                            
                                // <a key={item._id} href={item.url} target="_blank" className="text-neutral-800 text-sm font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]">
                                //     {item.label}
                                // </a>
                                <a key={item._id} href={isCustomDomain ? `/${item.url}` : `/brand/${settings?.brandSlug}${item.url}`} target="_blank" className="text-neutral-800 text-sm font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]">
                                    {item.label}
                                </a>
                            ))
                        }
                    </div>
                </div>

                <div className='hidden lg:flex lg:flex-1 justify-end items-center gap-4'>
                    <div className='relative w-full max-w-[250px]'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search products...' className='w-full text-sm border-1 border-gray-900 !rounded-none !px-4 !py-2'
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                        />
                        <div className="absolute flex justify-center items-center w-10 h-full top-1/2 -translate-y-1/2 right-0 bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                                <path d="M17 17L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Favourites  */}
                    <button className='font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                        onClick={() => navigate(isCustomDomain ? "/customer/favourites" : `/brand/${settings?.brandSlug}/customer/favourites`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>

                    {/* Cart */}
                    <button className='relative flex items-center gap-2 text-sm font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                        onClick={() => handleAuthNavigation(isCustomDomain ? `/cart` : `/brand/${settings?.brandSlug}/cart`)}
                    >
                        {cartLength > 0 &&
                            <div className="absolute -bottom-1 -left-1.5 flex justify-center items-center text-[10px] bg-red-600 text-white w-3.5 h-3.5 rounded-full">{cartLength}</div>
                        }
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M8 7H16C17.8856 7 18.8284 7 19.4142 7.58579C20 8.17157 20 9.11438 20 11V15C20 18.2998 20 19.9497 18.9749 20.9749C17.9497 22 16.2998 22 13 22H11C7.70017 22 6.05025 22 5.02513 20.9749C4 19.9497 4 18.2998 4 15V11C4 9.11438 4 8.17157 4.58579 7.58579C5.17157 7 6.11438 7 8 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 9.5C16 5.63401 14.2091 2 12 2C9.79086 2 8 5.63401 8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {!user.userID ?
                        <div className='flex gap-2'>
                            <div className='flex items-center gap-2 transition-all duration-200 ease-linear hover:text-[var(--pr)]'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                                    <path d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <button className='text-sm font-bold' onClick={() => handleAuthNavigation(`/auth/login?brandName=${settings?.brandName}&brandSlug=${settings?.brandSlug}`)}>Login</button>
                            </div>/
                            <button className='text-sm font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]' onClick={() => handleAuthNavigation(`/auth/signup?brandName=${settings?.brandName}&brandSlug=${settings?.brandSlug}`)}>Signup</button>
                        </div>
                        :
                        <button role='button' className='transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                            onClick={() => navigate(isCustomDomain ? "/customer/dashboard" : `/brand/${settings?.brandSlug}/customer/dashboard`)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                                <path d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    }
                </div>

                <div className='flex lg:hidden gap-4 items-center'>
                    <div role='button' onClick={() => navigate(isCustomDomain ? "/customer/favourites" : `/brand/${settings?.brandSlug}/customer/favourites`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <div role='button' onClick={() => handleAuthNavigation(isCustomDomain ? `/cart` : `/brand/${settings?.brandSlug}/cart`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M8 7H16C17.8856 7 18.8284 7 19.4142 7.58579C20 8.17157 20 9.11438 20 11V15C20 18.2998 20 19.9497 18.9749 20.9749C17.9497 22 16.2998 22 13 22H11C7.70017 22 6.05025 22 5.02513 20.9749C4 19.9497 4 18.2998 4 15V11C4 9.11438 4 8.17157 4.58579 7.58579C5.17157 7 6.11438 7 8 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 9.5C16 5.63401 14.2091 2 12 2C9.79086 2 8 5.63401 8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div role='button' onClick={() => navigate(isCustomDomain ? "/customer/dashboard" : `/brand/${settings?.brandSlug}/customer/dashboard`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <HiOutlineMenuAlt3 className='cursor-pointer' onClick={() => setOpen(true)} />
                </div>

                {/* Sub Menu */}
                <div className={`fixed top-0 right-0 w-full h-screen bg-white p-4 overscroll-y-auto z-10 transition-all duration-300 ease-linear ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                    <div className='flex justify-end'>
                        <BiX className='text-2xl text-gray-800' onClick={() => setOpen(false)} />
                    </div>

                    <div className='flex flex-col gap-6 mt-10'>
                        {!loadingMainMenuItems &&
                            <div className='flex flex-col items-center gap-6'>
                                {(!loadingMainMenuItems && mainMenuItems.length > 0) &&
                                    mainMenuItems.map(item => (
                                        <a key={item._id} href={`${item.url || "/"}`} target='_blank' className='text-neutral-800 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'>
                                            {item.label}
                                        </a>
                                    ))
                                }
                            </div>
                        }

                        {!user.userID ?
                            <>
                                <button className='text-neutral-800 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                                    onClick={() => {
                                        handleAuthNavigation(`/auth/login?brandName=${settings?.brandName}&brandSlug=${settings?.brandSlug}`)
                                        setOpen(false)
                                    }}
                                >
                                    Login
                                </button>
                                <button className='text-neutral-800 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                                    onClick={() => {
                                        handleAuthNavigation(`/auth/signup?brandName=${settings?.brandName}&brandSlug=${settings?.brandSlug}`)
                                        setOpen(false)
                                    }}
                                >
                                    Signup
                                </button>
                            </>
                            :
                            <button className='text-neutral-800 font-bold transition-all duration-200 ease-linear hover:text-[var(--pr)]'
                                onClick={() => {
                                    navigate(isCustomDomain ? "/customer/dashboard" : `/brand/${settings?.brandSlug}/customer/dashboard`)
                                    setOpen(false)
                                }}
                            >Dashboard</button>
                        }
                    </div>
                </div>
            </header >

            <div className='block lg:hidden relative w-full mb-4 sm:mb-6 px-3 sm:px-8'>
                <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search products...' className='w-full text-sm border-1 border-gray-900 !rounded-none !px-4 !py-2'
                    onChange={e => setSearchText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute flex justify-center items-center w-10 h-full top-1/2 -translate-y-1/2 right-3 sm:right-8 bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                        <path d="M17 17L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </div>
            </div>
        </>
    )
}