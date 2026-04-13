import React, { useEffect, useState } from 'react'
import ProductBox from '../ProductBox';
import axios from 'axios'
import ProductBoxTwo from '../ProductBoxTwo';
import ProductBoxThree from '../ProductBoxThree';
import ProductBoxJewellery from '../ProductBoxJewellery';
import ProductBoxFashion from '../ProductBoxFashion';

export default function ProductSimilar({ settings, isCustomDomain, productSlug, category, subcategory }) {
    const style = settings?.layout?.homePageStyle

    const productBoxComponents = {
        style1: ProductBox,
        style2: ProductBoxTwo,
        style3: ProductBoxThree,
        jewellery: ProductBoxJewellery,
        fashion: ProductBoxFashion
    };

    const ProductBoxComponent = productBoxComponents[style] || null;

    const [products, setProducts] = useState()
    const [loading, setLoading] = useState()

    useEffect(() => {
        if (settings && productSlug) {
            fetchSimilarProducts()
        }
    }, [settings, productSlug])

    const fetchSimilarProducts = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/product/fetch-similar-products?sellerID=${settings?.sellerID}&&productSlug=${productSlug}&&category=${category}&&subcategory=${subcategory}`)
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
        products?.length > 0 &&
        <section className="relative main-container px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="head font-bold text-xl sm:text-2xl md:text-3xl text-[var(--text)] ">
                    Similar Products
                </h1>
                <a
                    href={isCustomDomain ? "/products" : `/brand/${settings?.brandSlug}/pages/products`}
                    target="_blank"
                    className="text-[var(--pr)] font-bold hover:underline"
                >
                    View All &rarr;
                </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products?.map((item, idx) => (
                    ProductBoxComponent && <ProductBoxComponent item={item} idx={idx} settings={settings} />
                ))}
            </div>
        </section>
    )
}