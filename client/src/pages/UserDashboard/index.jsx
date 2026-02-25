import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useUserAuthContext } from "../../contexts/UserAuthContext"
import bgImg from "../../assets/images/user-banner.svg"
import {
  FaAddressBook,
  FaHome,
  FaWallet,
  FaSignOutAlt,
  FaCoins,
} from "react-icons/fa"
import { ContactsFilled, UserOutlined } from "@ant-design/icons"
import Profile from "./Profile"
import Address from "./Address"
import ReferAndEarn from "./ReferAndEarn"
import { Avatar } from "antd"
import { useState } from "react"
import ContactInfoModel from "@/components/ContactInfoModel"
import SidebarDropdown from "../../components/SidebarDropdown"

export default function UserDashboard() {
  const [openModal, setOpenModal] = useState(false)
  const [open, setOpen] = useState(false)

  const { user, handleLogout } = useUserAuthContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <div className="w-full p-2 md:p-2.5">
        {/* Header */}
        <div className="relative rounded-2xl mb-2 md:mb-4 text-gray-800 bg-[#f3faff] w-full p-12 sm:p-16 md:p-18 overflow-hidden">
          <div className="absolute -left-26 -bottom-16 w-[500px] h-[200px] rotate-14">
            <img src={bgImg} alt="user-banner" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -right-26 -top-16 w-[500px] h-[200px] rotate-195">
            <img src={bgImg} alt="user-banner" className="w-full h-full object-cover" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-10 z-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              My Account
            </h1>
            <ul className="flex gap-2 mt-3 text-sm md:text-base">
              <li>
                <FaHome />
              </li>
              <li>&gt;</li>
              <li className="font-medium capitalize">
                {pathname.split("/").pop()}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex w-full min-h-[80vh]">
          {/* Sidebar */}
          <div className="w-16 md:w-[300px] bg-gradient-to-bl from-[#f3faff] to-[#ebecf8] rounded-2xl flex flex-col items-center md:items-stretch p-2 md:p-6">
            <div className="flex flex-col items-center gap-2 border-b border-gray-300 py-3">
              <Avatar
                size={50}
                src={user?.avatar || null}
                icon={!user?.avatar && <UserOutlined />}
              />
              <h2 className="hidden md:block">{user?.fullName}</h2>
            </div>

            <div className="flex flex-col mt-4 gap-6">
              <button
                className="flex items-center justify-center md:justify-start gap-3 hover:text-secondary"
                onClick={() => navigate("/user/profile")}
              >
                <FaWallet />
                <span className="hidden md:inline">Profile</span>
              </button>

              <button
                className="flex items-center justify-center md:justify-start gap-3 hover:text-secondary"
                onClick={() => navigate("/user/address")}
              >
                <FaAddressBook />
                <span className="hidden md:inline">Address</span>
              </button>

              <SidebarDropdown
                icon={FaCoins}
                title="Refer & Earn"
                open={open}
                setOpen={setOpen}
                seller={true}
                items={[
                  { label: "Overview", path: "/user/refer-earn" },
                  { label: "Withdraw Requests", path: "/user/refer-earn/withdraws" },
                ]}
              />

              <button
                className="flex items-center justify-center md:justify-start gap-3 hover:text-secondary"
                onClick={() => setOpenModal(true)}
              >
                <ContactsFilled />
                <span className="hidden md:inline">Contact Support</span>
              </button>

              <button
                className="flex items-center justify-center md:justify-start gap-3 hover:text-secondary"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Routes>
              <Route path="profile" element={<Profile />} />
              <Route path="address" element={<Address />} />
              <Route path="refer-earn/*" element={<ReferAndEarn />} />
            </Routes>
          </div>
        </div>
      </div>

      <ContactInfoModel open={openModal} onClose={() => setOpenModal(false)} />
    </>
  )
}
