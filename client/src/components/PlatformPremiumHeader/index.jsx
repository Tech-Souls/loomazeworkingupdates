import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiX } from "react-icons/bi";
import axios from "axios";
import { Heart, ShoppingBag, Search, User } from "lucide-react";

export default function PlatformPremiumHeader({
  settings,
  isCustomDomain,
}) {
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
      .then((res) =>
        setMainMenuItems(res?.data?.mainMenuItems?.links || [])
      )
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

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`${scrolled ? "bg-white/60 fixed backdrop-blur-xl": 'bg-gray-200 relative'} top-0 z-50 font-[Inter] flex justify-between items-center gap-8 px-4 sm:px-8 py-3 w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-2xl bg-gray-200/50"
            : "bg-gray-200"
        }`}
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
              className="uppercase text-xl md:text-4xl hover:scale-70 cursor-pointer text-[#304FFE] font-bold tracking-widest transition-scale ease-in-out duration-200"
              onClick={() =>
                navigate(
                  isCustomDomain
                    ? "/"
                    : `/brand/${settings?.brandSlug}`
                )
              }
            >
              {settings?.brandName || "Brand"}
            </h1>

              <div className="hidden lg:flex  items-center gap-6">
          {mainMenuItems.map((item) => (
            <button
              key={item._id}
              onClick={() => {
                navigate(buildNavPath(item.url));
                window.scrollTo(0, 0);
              }}
              className="hover:text-[#304FFE] transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>
          </div>




          {/* RIGHT - Icons */}
          <div className="flex items-center gap-6">

            {/* SEARCH (Desktop only - unchanged design) */}
            <div className="hidden lg:flex relative rounded-xl h-10 bg-gray-300 border-[#304FFE] items-center justify-between overflow-hidden w-60 transition-all duration-300 hover:border hover:shadow shadow-[#304FFE] hover:bg-white">
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
                  className="hover:text-[#304FFE] hover:scale-110 transition-all duration-200"
                />
              </div>
            </div>

            {/* FAVOURITE */}
            <button
              className="relative group"
              onClick={() =>
                navigate(buildNavPath("/customer/favourites"))
              }
            >
              <Heart className="transition-all hover:text-[#304FFE] hover:-translate-y-2 duration-300" />

              <small className="absolute left-1/2 -translate-x-1/2 top-5 px-2 py-1 bg-black text-white text-[10px] rounded-full opacity-0 scale-95 translate-y-5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                favourites
              </small>
            </button>

            {/* CART */}
            <button
              className="relative group"
              onClick={() =>
                handleAuthNavigation(buildNavPath("/cart"))
              }
            >
              <ShoppingBag className="transition-all hover:text-[#304FFE] hover:-translate-y-2 duration-300" />

              <small className="absolute left-1/2 -translate-x-1/2 top-5 px-2 py-1 bg-black text-white text-[10px] rounded-full opacity-0 scale-95 translate-y-5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                cart
              </small>

              {cartLength > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartLength}
                </span>
              )}
            </button>

            {/* LOGIN */}
            <button
              className="relative group"
              onClick={() => handleAuthNavigation("/auth/login")}
            >
              <User className="transition-all hover:text-[#304FFE] hover:-translate-y-2 duration-300" />

              <small className="absolute left-1/2 -translate-x-1/2 top-5 px-2 py-1 bg-black text-white text-[10px] rounded-full opacity-0 scale-95 translate-y-5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                login
              </small>
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