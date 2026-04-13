import React, { useEffect, useState } from "react";
import ProductBoxThree from "../ProductBoxThree";
import axios from "axios";

export default function PlatformRecentProductsThree({ storeSettings, isCustomDomain }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (storeSettings) {
            fetchRecentProducts()
        }
    }, [storeSettings])

    const fetchRecentProducts = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-recent-products?sellerID=${storeSettings?.sellerID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setProducts(data?.products)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <section className="relative main-container min-h-[650px] px-4 pt-8 pb-20">
            <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    LATEST PRODUCT
                </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {loading ?
                    <p>Loading...</p>
                    :
                    (!loading && products.length > 0) ?
                        products.map((item, idx) => (
                            <ProductBoxThree key={idx} item={item} idx={idx} settings={storeSettings} isCustomDomain={isCustomDomain} />
                        ))
                        :
                        <p className="text-red-500">No latest product found!</p>
                }
            </div>
        </section>
    );
}
