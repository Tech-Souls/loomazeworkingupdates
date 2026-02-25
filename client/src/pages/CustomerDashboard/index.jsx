import  { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import bgImg from '../../assets/images/user-banner.svg'
import { FaAddressBook, FaHome, FaHistory, FaWallet, FaStar, FaSignOutAlt, FaHeart, FaCoins } from "react-icons/fa";
import Dashboard from './Dashboard'
import Profile from './Profile'
import Orders from './Orders'
import Address from './Address'
import Reviews from './Reviews'
import Favourites from './Favourites'
import AddReview from './Reviews/AddReview';

export default function Customer({ isCustomDomain }) {
    const { user, handleLogout } = useAuthContext()
    const { brandSlug } = useParams()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    const activeSlug = brandSlug || user?.brandSlug || localStorage.getItem('last_visited_brand');
    const basePath = isCustomDomain ? "" : `/brand/${activeSlug}`;

    const goTo = (path) => {
        navigate(`${basePath}${path}`);
    }

    return (
        <div className='w-full p-2 md:p-2.5'>
            {/* Banner */}
            <div className="relative rounded-2xl mb-2 md:mb-4 text-gray-800 bg-[#f3faff] w-full p-12 sm:p-16 md:p-18 overflow-hidden">
                <div className='absolute -left-26 -bottom-16 w-[500px] h-[200px] object-cover rotate-14'>
                    <img src={bgImg} alt="user-banner" className='w-full h-full object-cover' />
                </div>
                <div className='absolute -right-26 -top-16 w-[500px] h-[200px] object-cover rotate-195'>
                    <img src={bgImg} alt="user-banner" className='w-full h-full object-cover' />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-10 z-10">
                    <h1 className="head text-xl sm:text-2xl md:text-3xl font-bold">My Account</h1>
                    <ul className="flex flex-row justify-center items-center gap-2 mt-3 text-sm md:text-base">
                        <li className="flex items-center gap-1">
                            <FaHome className="text-gray-800 text-lg" />
                        </li>
                        <li className="text-gray-800 text-sm">&gt;</li>
                        <li className="font-medium capitalize">{pathname.split("/").pop()}</li>
                    </ul>
                </div>
            </div>

            <div className='flex w-full min-h-[80vh]'>
                {/* Left Sider */}
                <div className="w-16 md:w-[300px] bg-gradient-to-bl from-[#f3faff] to-[#ebecf8] rounded-2xl flex flex-col items-center md:items-stretch p-2 md:p-6">
                    <div className="profile flex flex-col justify-center items-center mb-2 gap-2 border-b border-gray-300 py-3">
                        <div className="flex h-12 w-12 md:h-18 md:w-18 border-0 rounded-full bg-gray-200 items-center justify-center text-[#333] font-bold">
                            {user?.username.slice(0, 2)}
                        </div>
                        <p className="hidden md:block">Hello</p>
                        <h2 className="hidden md:block">{user?.username}</h2>
                    </div>

                    <div className="flex flex-col categories mt-4 gap-6 p-1 md:p-2">
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300 "
                            onClick={() => goTo("/customer/dashboard")}
                        >
                            <FaHome />
                            <span className="hidden md:inline">Dashboard</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300"
                            onClick={() => goTo("/customer/orders")}
                        >
                            <FaHistory />
                            <span className="hidden md:inline">Order History</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300"
                            onClick={() => goTo("/customer/profile")}
                        >
                            <FaWallet />
                            <span className="hidden md:inline">Account Detail</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300"
                            onClick={() => goTo("/customer/address")}
                        >
                            <FaAddressBook />
                            <span className="hidden md:inline">Address</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300"
                            onClick={() => goTo("/customer/reviews")}>
                            <FaStar />
                            <span className="hidden md:inline">Reviews</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300"
                            onClick={() => goTo("/customer/favourites")}>
                            <FaHeart />
                            <span className="hidden md:inline">Favourites</span>
                        </button>
                        <button className="inline-flex gap-0 md:gap-3 items-center justify-center md:justify-start hover:text-[var(--secondary)] transition-all duration-300">
                            <FaSignOutAlt />
                            <span className="hidden md:inline" onClick={() => handleLogout()}>Logout</span>
                        </button>
                    </div>
                </div>

                <div className='flex-1'>
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='orders' element={<Orders isCustomDomain={isCustomDomain} />} />
                        <Route path='profile' element={<Profile isCustomDomain={isCustomDomain} basePath={basePath} />} />
                        <Route path='address' element={<Address isCustomDomain={isCustomDomain} basePath={basePath} />} />
                        {/* <Route path='refer&earn' element={<ReferAndEarn />} /> */}
                        <Route path='reviews' element={<Reviews isCustomDomain={isCustomDomain} />} />
                        <Route path='reviews/add-review/:orderID' element={<AddReview isCustomDomain={isCustomDomain} />} />
                        <Route path='favourites' element={<Favourites isCustomDomain={isCustomDomain} />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}