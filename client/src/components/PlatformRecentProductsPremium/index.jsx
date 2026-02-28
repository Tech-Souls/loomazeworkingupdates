import React, { useEffect, useState } from "react";
import ProductBoxJewellery from "../ProductBoxJewellery";
import axios from "axios";
import ProductBoxPremium from "../ProductBoxPremium";

export default function PlatformRecentProductsPremium({ storeSettings, isCustomDomain }) {
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
            <div className="mb-10">
                <h1 className="text-2xl text-gray-900 text-center mb-2 font-bold">
                    Lastest Products
                </h1>
                <a
                    href={isCustomDomain ? "/products" : `/brand/${storeSettings.brandSlug}/pages/products`}
                    target="_blank"
                    className="block text-sm text-center text-[var(--pr)] font-bold underline"
                >
                    View All
                </a>
            </div>

            <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {loading ?
                    <p>Loading...</p>
                    :
                    (!loading && products.length > 0) ?
                        products.map((item, idx) => (
                            <ProductBoxPremium key={idx} item={item} idx={idx} settings={storeSettings} isCustomDomain={isCustomDomain} />
                        ))
                        :
                        <p className="text-red-500">No latest product found!</p>
                }
            </div>
        </section>
    );
}