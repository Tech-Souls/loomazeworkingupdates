import React, { useEffect, useRef, useState } from "react";
import ProductBoxFashion from "../ProductBoxFashion";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlatformRecentProductsFashion({ storeSettings, isCustomDomain }) {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [loadingCategories, setLoadingCategories] = useState(true)
    const categorySliderRef = useRef(null)

    useEffect(() => {
        if (storeSettings?.sellerID) {
            fetchRecentProducts()
        }
    }, [storeSettings, selectedCategory])

    useEffect(() => {
        if (storeSettings?.sellerID) {
            fetchPlatformHomeCategories()
        }
    }, [storeSettings])

    const fetchPlatformHomeCategories = () => {
        setLoadingCategories(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${storeSettings?.sellerID}`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data?.categories)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoadingCategories(false))
    }
    console.log("catgory",categories);

    const slideCategories = (direction) => {
        if (!categorySliderRef.current) return
        const scrollAmount = 220
        categorySliderRef.current.scrollBy({
            left: direction === "next" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        })
    }

    const fetchRecentProducts = () => {
        setLoadingProducts(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-recent-products-filtered?sellerID=${storeSettings?.sellerID}&category=${selectedCategory}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setProducts(data?.products)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoadingProducts(false))
    }

    return (
        <section className="relative main-container min-h-[650px] px-4 pt-8 pb-20">
            <h2 className="text-2xl text-center mb-4 font-bold">Lastest Products</h2>

            <div className="flex items-center gap-2 mb-10">
                <button
                    type="button"
                    onClick={() => slideCategories("prev")}
                    className="shrink-0 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200"
                >
                   <ChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
                </button>
                <div
                    ref={categorySliderRef}
                    className="flex-1 flex overflow-x-auto items-center gap-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                {loadingCategories ?
                    <p>Loading...</p>
                    :
                    <>
                        <button className={`group min-w-fit relative text-sm capitalize font-bold px-8 sm:px-10 py-3 sm:py-4 border rounded-full whitespace-nowrap overflow-hidden transition-all duration-200 ease-linear bg-white text-black hover:bg-black hover:text-white
                        ${selectedCategory === "all" ? "border-black" : "border-gray-300"}`}
                            onClick={() => setSelectedCategory("all")}
                        >
                            <span className="relative z-0">Shop All</span>
                        </button>
                        {categories.map(cat => (
                            <button key={cat._id} className={`group min-w-fit relative text-sm capitalize font-bold px-8 sm:px-10 py-3 sm:py-4 border rounded-full whitespace-nowrap overflow-hidden transition-all duration-200 ease-linear bg-white text-black hover:bg-black hover:text-white
                        ${selectedCategory === cat.name ? "border-black" : "border-gray-300"}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                <span className="relative z-0">{cat.name}</span>
                            </button>
                        ))}
                    </>
                }
                </div>
                <button
                    type="button"
                    onClick={() => slideCategories("next")}
                    className="shrink-0 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200"
                >
                   <ChevronRight className="w-3 h-3 md:w-5 md:h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {loadingProducts ?
                    <p>Loading...</p>
                    :
                    (!loadingProducts && products.length > 0) ?
                        products.map((item, idx) => (
                            <ProductBoxFashion key={idx} item={item} idx={idx} settings={storeSettings} isCustomDomain={isCustomDomain} />
                        ))
                        :
                        <p className="text-red-500">No latest product found!</p>
                }
            </div>
        </section>
    );
}
