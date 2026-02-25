import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetails from '../../../components/ProductDetail'
import ProductBoughtTogether from '../../../components/ProductBoughtTogetther'
import ProductSimilar from '../../../components/ProductSimilar'
import ProductReview from '../../../components/ProductReview'
import Loader from '../../../components/Loader'
import axios from 'axios'

export default function ProductPage({ settings, isCustomDomain }) {
    const { productSlug } = useParams()
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (settings && productSlug) {
            fetchProduct()
        }
    }, [settings, productSlug])

    const fetchProduct = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/product/fetch-product?sellerID=${settings?.sellerID}&&productSlug=${productSlug}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setProduct(data?.product)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    if (loading) return <Loader />
    console.log('Fetched product details:', product)    
    

    return (
        <div>
            <ProductDetails settings={settings} product={product} />
            {product?.boughtTogether?.length > 0 && <ProductBoughtTogether settings={settings} products={product?.boughtTogether} />}
            <ProductSimilar settings={settings} isCustomDomain={isCustomDomain} productSlug={productSlug} category={product?.category} subcategory={product?.subcategory} />
            <ProductReview productID={product?.productID} />
        </div>
    )
}