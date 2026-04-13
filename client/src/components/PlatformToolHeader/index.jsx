import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiX } from "react-icons/bi";
import axios from "axios";
import { Heart, ShoppingBag, Search, User } from "lucide-react";

export default function PlatformToolHeader({ settings, isCustomDomain }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [mainMenuItems, setMainMenuItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu fetch
  useEffect(() => {
    if (!settings?.sellerID) return;

    axios
      .get(`${import.meta.env.VITE_HOST}/platform/home/fetch-main-menu`, {
        params: {
          sellerID: settings.sellerID,
          headerMenuName: settings?.content?.headerMenuName || "",
        },
      })
      .then((res) => setMainMenuItems(res?.data?.mainMenuItems?.links || []))
      .catch(console.error);
  }, [settings?.sellerID]);

  useEffect(() => {
    setCartLength(user?.cart?.length || 0);
  }, [user?.cart]);

  const buildNavPath = (url) =>
    isCustomDomain ? `/${url}` : `/brand/${settings?.brandSlug}${url}`;

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(buildNavPath(`/products?s=${searchText.trim()}`));
  };

  const handleAuthNavigation = (path) => {
    if (!["/auth/login", "/auth/signup"].includes(location.pathname)) {
      sessionStorage.setItem("redirectPath", location.pathname);
    }
    navigate(path);
  };
    console.log('data from platfomr header' , settings)

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`  font-[roboto-condensed] flex justify-between items-center gap-8 px-4 sm:px-8 h-25   w-full transition-all duration-300
         `}
      >
        <div className="flex items-center justify-between w-full">
          {/* LEFT - Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <HiOutlineMenuAlt3
              size={24}
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>

          {/* CENTER - Logo */}
          <div className="flex-1 flex  justify-center items-center h-full gap-10 lg:justify-start">
            <h1
              role="button"
              className="uppercase lg:text-5xl text-2xl  hover:scale-70 cursor-pointer text-[#E53935] font-bold tracking-widest transition-scale ease-in-out duration-200"
              onClick={() =>
                navigate(isCustomDomain ? "/" : `/brand/${settings?.brandSlug}`)
              }
            >
              {settings?.brandName || "Brand"}
            </h1>
          </div>

          {/* RIGHT - Icons */}
          <div className="flex  h-12 lg:w-[77.5%] w-40  items-center gap-6">
            <div className="hidden lg:flex relative rounded-md  h-full bg-gray-300  items-center justify-between overflow-hidden w-full transition-all duration-300 hover:border border-gray-400 hover:shadow shadow-gray-600 hover:bg-white">
              <input
                type="search"
                value={searchText}
                placeholder="Search products..."
                className="w-[80%] text-sm bg-transparent outline-none"
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer"
              >
                <Search
                  size={20}
                  className="hover:text-[#E53935] hover:scale-110 transition-all duration-200"
                />
              </div>
            </div>

            {/* LOGIN */}
            <button
              className="relative flex transition-all text-gray-700 font-semibold hover:text-[#E53935] hover:-translate-y-1 duration-300 items-center justify-center gap-2"
              onClick={() => handleAuthNavigation("/auth/login")}
            >
              <User />

              <p className=" hidden lg:block text-lg rounded-full   transition-all duration-300 pointer-events-none">
                login
              </p>
            </button>

            {/* FAVOURITE */}
            <button
              className="relative flex transition-all text-gray-700 font-semibold hover:text-[#E53935] hover:-translate-y-1 duration-300 items-center justify-center gap-2"
              onClick={() => navigate(buildNavPath("/customer/favourites"))}
            >
              <Heart className="" />

              <p className=" hidden lg:block text-lg rounded-full   transition-all duration-300 pointer-events-none">
                wishlist
              </p>
            </button>

            {/* CART */}
            <button
              className="relative flex transition-all text-gray-700 font-semibold hover:text-[#E53935] hover:-translate-y-1 duration-300 items-center justify-center gap-2"
              onClick={() => handleAuthNavigation(buildNavPath("/cart"))}
            >
              <ShoppingBag />

              <p className=" hidden lg:block text-lg rounded-full   transition-all duration-300 pointer-events-none">
                cart
              </p>

              {cartLength > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartLength}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          mobileMenuOpen
            ? "bg-black/50 opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute top-0 left-0 h-full w-72 bg-white p-6 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <BiX
            size={28}
            className="cursor-pointer mb-6"
            onClick={() => setMobileMenuOpen(false)}
          />

          <ul className="flex flex-col gap-4">
            {mainMenuItems.map((item) => (
              <li key={item._id}>
                <button
                  onClick={() => {
                    navigate(buildNavPath(item.url));
                    setMobileMenuOpen(false);
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
    </>
  );
}
