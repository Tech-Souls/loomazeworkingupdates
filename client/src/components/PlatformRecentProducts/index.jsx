import React, { useEffect, useState } from "react";
import ProductBox from "../ProductBox";
import axios from "axios";

export default function PlatformRecentProducts({ storeSettings, isCustomDomain }) {
    const demoProducts = [
  {
    _id: "lp1",
    slug: "noise-cancelling-headphones",
    title: "Noise Cancelling Headphones",
    name: "Noise Cancelling Headphones",
    mainImageURL: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
    price: 15999,
    comparedPrice: 19999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "lp2",
    slug: "smart-fitness-band",
    title: "Smart Fitness Band",
    name: "Smart Fitness Band",
    mainImageURL: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
    price: 6999,
    comparedPrice: 8999,
    hasMultipleVariants: true,
    hasOptions: true
  },
  {
    _id: "lp3",
    slug: "modern-office-chair",
    title: "Modern Office Chair",
    name: "Modern Office Chair",
    mainImageURL: "https://images.unsplash.com/photo-1582582494700-26f6d7b61c88?auto=format&fit=crop&w=800&q=80",
    price: 28999,
    comparedPrice: 32999,
    hasMultipleVariants: false,
    hasOptions: true
  },
  {
    _id: "lp4",
    slug: "wireless-earbuds-pro",
    title: "Wireless Earbuds Pro",
    name: "Wireless Earbuds Pro",
    mainImageURL: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    price: 9999,
    comparedPrice: 12999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "lp5",
    slug: "minimal-table-lamp",
    title: "Minimal Table Lamp",
    name: "Minimal Table Lamp",
    mainImageURL: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    price: 4499,
    comparedPrice: 5999,
    hasMultipleVariants: false,
    hasOptions: true
  },
  {
    _id: "lp6",
    slug: "premium-leather-wallet",
    title: "Premium Leather Wallet",
    name: "Premium Leather Wallet",
    mainImageURL: "https://images.unsplash.com/photo-1600180758895-7e9f7a7a6b7f?auto=format&fit=crop&w=800&q=80",
    price: 2999,
    comparedPrice: 3999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "lp7",
    slug: "gaming-mechanical-keyboard",
    title: "Gaming Mechanical Keyboard",
    name: "Gaming Mechanical Keyboard",
    mainImageURL: "https://images.unsplash.com/photo-1612198188060-c7c2a3b49f87?auto=format&fit=crop&w=800&q=80",
    price: 13499,
    comparedPrice: 16999,
    hasMultipleVariants: true,
    hasOptions: true
  },
  {
    _id: "lp8",
    slug: "dslr-camera-bag",
    title: "DSLR Camera Bag",
    name: "DSLR Camera Bag",
    mainImageURL: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80",
    price: 6499,
    comparedPrice: 7999,
    hasMultipleVariants: false,
    hasOptions: false
  },
  {
    _id: "lp9",
    slug: "ceramic-coffee-mug-set",
    title: "Ceramic Coffee Mug Set",
    name: "Ceramic Coffee Mug Set",
    mainImageURL: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    price: 2499,
    comparedPrice: 3499,
    hasMultipleVariants: false,
    hasOptions: true
  },
  {
    _id: "lp10",
    slug: "portable-bluetooth-speaker",
    title: "Portable Bluetooth Speaker",
    name: "Portable Bluetooth Speaker",
    mainImageURL: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80",
    price: 8999,
    comparedPrice: 11999,
    hasMultipleVariants: false,
    hasOptions: false
  }
];

    const [products, setProducts] = useState(demoProducts)
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
                if (status === 200 && data?.products?.length > 0) {
                    setProducts(data?.products)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <section className="relative main-container min-h-[650px] px-4 pt-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className=" head text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text)]">
                    Latest Products
                </h1>
                <a
                    href={isCustomDomain ? "/products" : `/brand/${storeSettings.brandSlug}/pages/products`}
                    target="_blank"
                    className="text-sm sm:text-[16px] text-[var(--pr)] font-bold hover:underline"
                >
                    View All &rarr;
                </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {loading ?
                    <p>Loading...</p>
                    :
                    (!loading && products.length > 0) ?
                        products.map((item, idx) => (
                            <ProductBox key={idx} item={item} idx={idx} settings={storeSettings} isCustomDomain={isCustomDomain} />
                        ))
                        :
                        <p className="text-red-500">No latest product found!</p>
                }
            </div>
        </section>
    );
}