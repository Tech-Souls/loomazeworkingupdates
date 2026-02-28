import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../../../../components/ButtonLoader";
import { ArrowLeft, ArrowRight, Star, Users2 } from "lucide-react";
import axios from "axios";

const initialState = {
  layout: {
    homePageStyle: "style1",
    categoriesSection: "grid",
    showCategoriesText: true,
    productListing: "grid",
  },
  visibility: {
    showTopNotification: true,
    showHeroSection: true,
    showCategories: true,
    autoplayCategories: false,
    autoplayCategoriesSpeed: 1,
    showFeaturedProducts: true,
    showExploreMore: true,
    showReviews: true,
    showRatings: true,
  },
};

const styles = [
<<<<<<< HEAD
    { key: "style1", title: "Classic", desc: "Sharp edges", rounded: "rounded-none" },
    { key: "style2", title: "Modern", desc: "Rounded edges", rounded: "rounded-3xl" },
    { key: "style3", title: "Emarald", desc: "Smooth feel", rounded: "rounded-3xl" },
    { key: "jewellery", title: "Jewellery", desc: "Premium Feel", rounded: "rounded-none" },
    { key: "fashion", title: "Fashion", desc: "Modern Look", rounded: "rounded-none" },
    {key: "luxury", title:"luxury", des:"Different look", rounded:"rounded-2xl"}
=======
  {
    key: "style1",
    title: "Classic",
    desc: "Sharp edges",
    rounded: "rounded-none",
  },
  {
    key: "style2",
    title: "Modern",
    desc: "Rounded edges",
    rounded: "rounded-3xl",
  },
  {
    key: "style3",
    title: "Emarald",
    desc: "Smooth feel",
    rounded: "rounded-3xl",
  },
  {
    key: "jewellery",
    title: "Jewellery",
    desc: "Premium Feel",
    rounded: "rounded-none",
  },
  {
    key: "fashion",
    title: "Fashion",
    desc: "Modern Look",
    rounded: "rounded-none",
  },
  {
    key: "premium",
    title: "Premium",
    desc: "Exclusive Design",
    rounded: "rounded-4xl",
  },
>>>>>>> 97c9624df971c26b0c35baa3a6681e75d2f3f5d8
];

export default function Layout({ user, settings, setSettings }) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      homePageStyle,
      categoriesSection,
      showCategoriesText,
      productListing,
    } = settings.layout;
    const {
      showTopNotification,
      showHeroSection,
      showCategories,
      autoplayCategories,
      autoplayCategoriesSpeed,
      showFeaturedProducts,
      showExploreMore,
      showReviews,
      showRatings,
    } = settings.visibility;
    setState({
      layout: {
        homePageStyle,
        categoriesSection,
        showCategoriesText,
        productListing,
      },
      visibility: {
        showTopNotification,
        showHeroSection,
        showCategories,
        autoplayCategories,
        autoplayCategoriesSpeed,
        showFeaturedProducts,
        showExploreMore,
        showReviews,
        showRatings,
      },
    });
  }, [settings]);

  const handleSaveChanges = () => {
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_HOST}/seller/layout/update/${user._id}`,
        state,
      )
      .then((res) => {
        const { status, data } = res;
        console.log("🚀 ~ file: index.jsx:86 ~ .then ~ res:", data);
        if (status === 202) {
          setSettings(data.updatedData);
          window.toastify(res.data.message, "success");
        }
      })
      .catch((err) => {
        window.toastify(
          err.response?.data?.message || "Something went wrong",
          "error",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#333]">Home Layout & Visibility Settings</h1>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1.5 text-xs bg-gray-100 text-gray-800 font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-gray-200"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-1.5 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70"
            disabled={loading}
            onClick={handleSaveChanges}
          >
            {!loading ? (
              "Save Changes"
            ) : (
              <>
                Saving <ButtonLoader />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="w-fit text-sm bg-blue-50 text-blue-500 border border-blue-200 px-2 py-1 rounded-md mb-6">
        Select a layout style for your website
      </p>
      <div className="p-4 border border-gray-200 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style) => {
            const isActive = state?.layout?.homePageStyle === style.key;
            const isDisabled =
              user.planDetails.plan === "Grow" &&
              ["jewellery", "fashion"].includes(style.key);
            return (
              <div
                key={style.key}
                className={`flex flex-col justify-center items-center border aspect-4/5 ${style.rounded} ${isActive ? "bg-blue-50 border-blue-400" : "bg-gray-100 border-gray-200"} ${isDisabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:border-blue-300"}`}
                onClick={() => {
                  if (!isDisabled) {
                    setState((prev) => ({
                      ...prev,
                      layout: { ...prev.layout, homePageStyle: style.key },
                    }));
                  }
                }}
              >
                <p
                  className={`font-bold ${isActive ? "text-blue-500" : "text-gray-700"}`}
                >
                  {style.title}
                  {isDisabled && <span className="ml-1 text-[10px]">🔒</span>}
                </p>
                <p
                  className={`text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}
                >
                  {isDisabled ? "Upgrade to Grow" : style.desc}
                </p>
              </div>
            );
          })}
          {/* Coming Soon Box */}
          <div className="flex flex-col justify-center items-center bg-gray-100 border-gray-200 border aspect-4/5 cursor-not-allowed rounded-4xl opacity-50">
            <p className="font-bold text-gray-700">Premium</p>
            <p className="text-xs text-gray-500">Coming Soon</p>
          </div>
        </div>
      </div>

      <p className="w-fit text-sm bg-blue-50 text-blue-500 border border-blue-200 px-2 py-1 rounded-md mb-6">
        Manage which section you want to display on your home page
      </p>

      <div className="flex flex-col gap-6">
        <div className="p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-900 font-bold">
              Display Top Notifications Bar
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showTopNotification ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showTopNotification: !prev.visibility.showTopNotification,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showTopNotification ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="relative flex justify-center items-end p-3 w-full bg-gray-100 border border-gray-200">
            <p className="text-sm text-gray-800">
              Order above 5000 for free delivery
            </p>
            <ArrowLeft
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
            />
            <ArrowRight
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
            />
          </div>
        </div>

        <div className="p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-900 font-bold">
              Display Hero Section
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showHeroSection ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showHeroSection: !prev.visibility.showHeroSection,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showHeroSection ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-center items-end p-6 w-full h-[450px] bg-gray-100 border border-gray-200">
            <div className="flex gap-2">
              <div className="w-5 h-5 bg-red-300 rounded-full"></div>
              <div className="w-5 h-5 bg-red-300 rounded-full"></div>
              <div className="w-5 h-5 bg-red-300 rounded-full"></div>
              <div className="w-5 h-5 bg-red-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-900 font-bold">
              Display Categories
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showCategories ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showCategories: !prev.visibility.showCategories,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showCategories ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-900 font-bold">
              Display Category Text
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.layout.showCategoriesText ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  layout: {
                    ...prev.layout,
                    showCategoriesText: !prev.layout.showCategoriesText,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.layout.showCategoriesText ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-900 font-bold">Enable Autoplay</p>
              <div
                className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.autoplayCategories ? "bg-blue-500" : "bg-gray-200"}`}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    visibility: {
                      ...prev.visibility,
                      autoplayCategories: !prev.visibility.autoplayCategories,
                    },
                  }))
                }
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.autoplayCategories ? "left-[calc(100%-20px)]" : "left-1"}`}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-900 font-bold">
                Autoplay Speed{" "}
                <span className="text-xs font-normal text-gray-700">
                  (In Seconds)
                </span>
              </p>
              <div className="flex gap-2 items-end">
                <div>
                  <input
                    type="number"
                    min="1"
                    name="categories-autoplay-speed"
                    id="categories-autoplay-speed"
                    value={state.visibility.autoplayCategoriesSpeed}
                    className="w-14 !p-2 !border !border-gray-300 !rounded-none"
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        visibility: {
                          ...prev.visibility,
                          autoplayCategoriesSpeed: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <p>s</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 w-full">
              {["Category 1", "Category 2", "Category 3", "Category 4"].map(
                (cat, i) => (
                  <div key={i}>
                    <div className="flex justify-center items-center bg-gray-100 border border-gray-200 aspect-4/3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="#666666"
                        className="size-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </div>
                    {state.layout.showCategoriesText && (
                      <h1 className="text-gray-700 text-center mt-3">{cat}</h1>
                    )}
                  </div>
                ),
              )}
            </div>

            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
              <ArrowLeft className="text-gray-500" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
              <ArrowRight className="text-gray-500" />
            </div>
          </div>
        </div>

        <div className="relative p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-900 font-bold">
              Display Featured Products
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showFeaturedProducts ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showFeaturedProducts: !prev.visibility.showFeaturedProducts,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showFeaturedProducts ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 w-full">
            {["Product", "Product", "Product", "Product"].map((prod, i) => (
              <div key={i}>
                <div className="flex justify-center items-center bg-gray-100 border border-gray-200 aspect-4/3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="#666666"
                    className="size-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <div className="mt-4">
                  <div className="w-[80%] h-3 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-[50%] h-3 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
            <ArrowLeft className="text-gray-500" />
          </div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
            <ArrowRight className="text-gray-500" />
          </div>
        </div>

        <div className="p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-900 font-bold">
              Display Explore More Section
            </p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showExploreMore ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showExploreMore: !prev.visibility.showExploreMore,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showExploreMore ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center p-6 w-full h-[450px]">
            <div className="flex-1">
              <div className="w-[80%] h-3 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-[50%] h-3 bg-gray-200 rounded-full"></div>
              <button className="text-sm px-5 py-2 bg-gray-200 text-gray-800 mt-6">
                Explore More
              </button>
            </div>

            <div className="flex justify-center items-center w-full max-w-[500px] h-full bg-gray-100 border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#666666"
                className="size-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-900 font-bold">Show Reviews</p>
            <div
              className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${state.visibility.showReviews ? "bg-blue-500" : "bg-gray-200"}`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  visibility: {
                    ...prev.visibility,
                    showReviews: !prev.visibility.showReviews,
                  },
                }))
              }
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-out ${state.visibility.showReviews ? "left-[calc(100%-20px)]" : "left-1"}`}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 w-full">
            {["Product", "Product", "Product"].map((prod, i) => (
              <div
                key={i}
                className="flex flex-col justify-center aspect-4/3 border border-gray-200"
              >
                <p className="flex justify-center items-center gap-2 text-gray-700">
                  <Users2 size={16} /> User 1
                </p>
                <div className="flex justify-center gap-1 mt-2 mb-6">
                  <Star size={14} className="text-yellow-500" />
                  <Star size={14} className="text-yellow-500" />
                  <Star size={14} className="text-yellow-500" />
                  <Star size={14} className="text-yellow-500" />
                  <Star size={14} className="text-yellow-500" />
                </div>
                <div className="flex flex-col items-center mt-4">
                  <div className="w-[80%] h-3 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-[80%] h-3 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-[50%] h-3 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
            <ArrowLeft className="text-gray-500" />
          </div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 h-12 bg-gray-100 border border-gray-200">
            <ArrowRight className="text-gray-500" />
          </div>
        </div>
      </div>
    </>
  );
}
