// import React, { useEffect, useState } from 'react'
// import './admin.css'
// import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
// import { useUserAuthContext } from '../../contexts/UserAuthContext'
// import Dashboard from './Dashboard'
// import { BsArrowRight } from 'react-icons/bs'
// import { GrAnalytics } from 'react-icons/gr'
// import { CiGlobe, CiUser } from 'react-icons/ci'
// import { LuUsersRound } from "react-icons/lu";
// import { TbUserShield } from "react-icons/tb";
// import { FiLogOut } from 'react-icons/fi'
// import Users from './Users'
// import Sellers from './Sellers'
// import SidebarDropdown from '../../components/SidebarDropdown'
// import SellerRequests from './Sellers/Requests'
// import Domains from './Domains'
// import Referrals from './Referrals'
// import { Coins } from 'lucide-react'
// import { FaCloudRain } from 'react-icons/fa6'
// import { BiCoin, BiCoinStack, BiMoney } from 'react-icons/bi'
// import Payments from './Payments'
// import SellerWithdraws from "./Withdraws/SellerWithdraws";
// import UserWithdraws from "./Withdraws/UserWithdraws";

// export default function Admin() {
//     const { user, handleLogout } = useUserAuthContext()
//     const [open, setOpen] = useState(false)
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (window.innerWidth <= 991) {
//             setOpen(true)
//         }
//     }, [])

//     return (
//         <>
//             <div className='flex'>
//                 <div className={`sider ${open ? 'sider-open' : 'sider-closed'}`}>
//                     <h6 className={`text-xl text-white px-5 py-4 cursor-pointer italic ${open && '!hidden'}`} onClick={() => navigate('/')}>loomaze</h6>

//                     <div className={`sider-links flex flex-col flex-1 overflow-y-auto justify-between ${open && 'items-center'}`}>
//                         <div className={`flex flex-col gap-1 overflow-y-auto mt-5 ${open && 'mt-15'}`}>
//                             <NavLink to="/admin/dashboard" className={({ isActive }) => `sider-link hover:bg-[#fff]/20 ${open && '!p-[12px] w-fit'} ${isActive && 'sider-link-active'}`}><GrAnalytics /> <span className={`sider-text ${open && '!hidden'}`}>Dashboard</span></NavLink>
//                             <NavLink to="/admin/users" className={({ isActive }) => `sider-link hover:bg-[#fff]/20 ${open && '!p-[12px] w-fit'} ${isActive && 'sider-link-active'}`}><LuUsersRound /> <span className={`sider-text ${open && '!hidden'}`}>Users</span></NavLink>
//                             <SidebarDropdown
//                                 icon={TbUserShield}
//                                 title="Sellers"
//                                 open={open}
//                                 items={[
//                                     { label: "Seller List", path: "/admin/sellers/list" },
//                                     { label: "Seller Requests", path: "/admin/sellers/requests" },
//                                 ]}
//                             />
//                             <NavLink to="/admin/domains" className={({ isActive }) => `sider-link hover:bg-[#fff]/20 ${open && '!p-[12px] w-fit'} ${isActive && 'sider-link-active'}`}><CiGlobe /> <span className={`sider-text ${open && '!hidden'}`}>Domains</span></NavLink>
//                             <NavLink to="/admin/all-referrals" className={({ isActive }) => `sider-link hover:bg-[#fff]/20 ${open && '!p-[12px] w-fit'} ${isActive && 'sider-link-active'}`}><BiCoinStack /> <span className={`sider-text ${open && '!hidden'}`}>Referrals</span></NavLink>
//                             <SidebarDropdown
//                                 icon={TbUserShield}
//                                 title="Payments"
//                                 open={open}
//                                 items={[
//                                     { label: "Invoices List", path: "/admin/payments/all-invoices" },
//                                     // { label: "Seller Requests", path: "/admin/sellers/requests" },
//                                 ]} />
//                                 <SidebarDropdown
//                                     icon={BiMoney} // ya Coins icon
//                                     title="Withdraws"
//                                     open={open}
//                                     items={[
//                                         { label: "Seller Withdraws", path: "/admin/withdraws/seller" },
//                                         { label: "User Withdraws", path: "/admin/withdraws/user" },
//                                     ]}
//                                 />

//                         </div>

//                         <div className='pt-5'>
//                             <div className='flex gap-2 items-center p-2'>
//                                 <CiUser className='bg-[#e8e8e8] p-2 w-8 h-8 rounded-full' />
//                                 <div className={`${open && '!hidden'}`}>
//                                     <div className='text-white'>{user?.username}</div>
//                                     <div className='text-white text-[12px]'>{user?.email}</div>
//                                 </div>
//                             </div>

//                             <div className='flex justify-center py-3.5'>
//                                 <button className='text-sm flex gap-2 items-center text-white'><FiLogOut /> <span className={`sider-text ${open && '!hidden'}`} onClick={() => handleLogout()}>Logout</span></button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className={`sider-arrow bg-[var(--secondary)]/75 !text-white cursor-pointer p-3 rounded-full transition-all duration-200 ease-out ${open ? 'rotate-0' : 'rotate-180'}`} onClick={() => setOpen(prev => !prev)}>
//                         <BsArrowRight />
//                     </div>
//                 </div>

//                 <div className={`content overflow-x-hidden ${open ? '!ml-[50px] md:!ml-[65px]' : '!ml-[220px]'}`}>
//                     <Routes>
//                         <Route index element={<Dashboard />} />
//                         <Route path='/dashboard' element={<Dashboard />} />
//                         <Route path='/users' element={<Users />} />
//                         <Route path='/sellers/list' element={<Sellers />} />
//                         <Route path='/sellers/requests' element={<SellerRequests />} />
//                         <Route path='/domains' element={<Domains />} />
//                         <Route path='/all-referrals' element={<Referrals />} />
//                         <Route path='/payments/*' element={<Payments />} />
//                         <Route path='withdraws/seller' element={<SellerWithdraws />} />
//                         <Route path='withdraws/user' element={<UserWithdraws />} />
//                     </Routes>
//                 </div>
//             </div>
//         </>
//     )
// }
import React, { useEffect, useState } from "react";
import "./admin.css";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../contexts/UserAuthContext";
import Dashboard from "./Dashboard";
import { BsArrowRight } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { BiCreditCard } from "react-icons/bi";
import { CiGlobe, CiUser } from "react-icons/ci";
import { LuUsersRound } from "react-icons/lu";
import { TbUserShield } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import Users from "./Users";
import Sellers from "./Sellers";
import SidebarDropdown from "../../components/SidebarDropdown";
import SellerRequests from "./Sellers/Requests";
import Domains from "./Domains";
import Referrals from "./Referrals";
import { BiCoinStack, BiMoney } from "react-icons/bi";
import Payments from "./Payments";
import SellerWithdraws from "./Withdraws/SellerWithdraws";
import UserWithdraws from "./Withdraws/UserWithdraws";
import AdminPlans from "./Plans";
export default function Admin() {
  const { user, handleLogout } = useUserAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth <= 991) setOpen(true);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`sider ${open ? "sider-open" : "sider-closed"}`}>
        <h6
          className={`text-xl text-white px-5 py-4 cursor-pointer italic ${open && "!hidden"}`}
          onClick={() => navigate("/")}
        >
          loomaze
        </h6>

        <div
          className={`sider-links flex flex-col flex-1 overflow-y-auto justify-between ${open && "items-center"}`}
        >
          <div
            className={`flex flex-col gap-1 overflow-y-auto mt-5 ${open && "mt-15"}`}
          >
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `sider-link hover:bg-[#fff]/20 ${open && "!p-[12px] w-fit"} ${isActive && "sider-link-active"}`
              }
            >
              <GrAnalytics />{" "}
              <span className={`sider-text ${open && "!hidden"}`}>
                Dashboard
              </span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `sider-link hover:bg-[#fff]/20 ${open && "!p-[12px] w-fit"} ${isActive && "sider-link-active"}`
              }
            >
              <LuUsersRound />{" "}
              <span className={`sider-text ${open && "!hidden"}`}>Users</span>
            </NavLink>

            <SidebarDropdown
              icon={TbUserShield}
              title="Sellers"
              open={open}
              
              items={[
                { label: "Seller List", path: "/admin/sellers/list" },
                { label: "Seller Requests", path: "/admin/sellers/requests" },
              ]}
            />

            <NavLink
              to="/admin/domains"
              className={({ isActive }) =>
                `sider-link hover:bg-[#fff]/20 ${open && "!p-[12px] w-fit"} ${isActive && "sider-link-active"}`
              }
            >
              <CiGlobe />{" "}
              <span className={`sider-text ${open && "!hidden"}`}>Domains</span>
            </NavLink>

            <NavLink
              to="/admin/all-referrals"
              className={({ isActive }) =>
                `sider-link hover:bg-[#fff]/20 ${open && "!p-[12px] w-fit"} ${isActive && "sider-link-active"}`
              }
            >
              <BiCoinStack />{" "}
              <span className={`sider-text ${open && "!hidden"}`}>
                Referrals
              </span>
            </NavLink>
            <NavLink
              to="/admin/plans"
              className={({ isActive }) =>
                `sider-link hover:bg-[#fff]/20 ${open && "!p-[12px] w-fit"} ${isActive && "sider-link-active"}`
              }
            >
              <BiCreditCard />{" "}
              <span className={`sider-text ${open && "!hidden"}`}>Plans</span>
            </NavLink>

            <SidebarDropdown
              icon={TbUserShield}
              title="Payments"
              open={open}
              items={[
                {
                  label: "Invoices List",
                  path: "/admin/payments/all-invoices",
                },
              ]}
            />

            <SidebarDropdown
              icon={BiMoney}
              title="Withdraws"
              open={open}
              items={[
                { label: "Seller Withdraws", path: "/admin/withdraws/seller" },
                { label: "User Withdraws", path: "/admin/withdraws/user" },
              ]}
            />
          </div>

          {/* User info & logout */}
          <div className="pt-5">
            <div className="flex gap-2 items-center p-2">
              <CiUser className="bg-[#e8e8e8] p-2 w-8 h-8 rounded-full" />
              <div className={`${open && "!hidden"}`}>
                <div className="text-white">{user?.username}</div>
                <div className="text-white text-[12px]">{user?.email}</div>
              </div>
            </div>

            <div className="flex justify-center py-3.5">
              <button
                className="text-sm flex gap-2 items-center text-white"
                onClick={handleLogout}
              >
                <FiLogOut />{" "}
                <span className={`sider-text ${open && "!hidden"}`}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Toggle sidebar */}
        <div
          className={`sider-arrow bg-[var(--secondary)]/75 !text-white cursor-pointer p-3 rounded-full transition-all duration-200 ease-out ${open ? "rotate-0" : "rotate-180"}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <BsArrowRight />
        </div>
      </div>

      {/* Content */}
      <div
        className={`content overflow-x-hidden ${open ? "!ml-[50px] md:!ml-[65px]" : "!ml-[220px]"}`}
      >
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="sellers/list" element={<Sellers />} />
          <Route path="sellers/requests" element={<SellerRequests />} />
          <Route path="domains" element={<Domains />} />
          <Route path="all-referrals" element={<Referrals />} />
          <Route path="payments/*" element={<Payments />} />
          <Route path="withdraws/seller" element={<SellerWithdraws />} />
          <Route path="withdraws/user" element={<UserWithdraws />} />
          <Route path="plans" element={<AdminPlans />} />
        </Routes>
      </div>
    </div>
  );
}
