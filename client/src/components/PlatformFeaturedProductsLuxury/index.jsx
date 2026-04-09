import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { Heart, ArrowRight } from "lucide-react";
import ButtonLoader from "../ButtonLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ item, settings, isCustomDomain }) {
    const { user, isAuthenticated, dispatch } = useAuthContext();
    const [adding, setAdding] = useState(false);
    const [addingToFavourites, setAddingToFavourites] = useState(false);

    const guestFavourites = JSON.parse(localStorage.getItem("guest_favourites")) || [];
    const isFavourite = isAuthenticated
        ? user?.favourites?.includes(item._id)
        : guestFavourites.includes(item._id);

    const hasMultipleVariants = item?.variants?.length > 1;
    const hasOptions = item?.options?.length > 0;

    const productUrl = isCustomDomain
        ? `/product/${item.slug}`
        : `/brand/${settings?.brandSlug}/product/${item.slug}`;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasMultipleVariants || hasOptions) {
            window.open(productUrl, "_blank");
            return;
        }

        const cartItem = {
            productID: item.productID,
            variantID: null,
            brandSlug: item.brandSlug,
            title: item.title,
            slug: item.slug,
            mainImageURL: item.mainImageURL,
            variantImageURL: null,
            quantity: 1,
            price: item.price,
            comparedPrice: item.comparedPrice,
            stock: item.stock,
            selectedOptions: [],
        };

        if (isAuthenticated && user?._id) {
            setAdding(true);
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`,
                    cartItem
                );

                if (res.status === 201) {
                    window.toastify(res.data.message, "success");
                    dispatch({
                        type: "UPDATE_CART",
                        payload: { cart: [cartItem, ...(user.cart || [])] },
                    });
                }
            } catch {
                window.toastify("Error adding to cart", "error");
            } finally {
                setAdding(false);
            }
        } else {
            const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
            localStorage.setItem("guest_cart", JSON.stringify([cartItem, ...guestCart]));
            window.toastify("Added to cart!", "success");
        }

        window.open(isCustomDomain ? `/cart` : `/brand/${settings?.brandSlug}/cart`, "_blank");
    };

    const handleAddToFavourites = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const productID = item._id;

        if (isAuthenticated && user?._id) {
            setAddingToFavourites(true);
            try {
                if (isFavourite) {
                    await axios.delete(`${import.meta.env.VITE_HOST}/user/favourites/remove`, {
                        data: { userID: user._id, productID },
                    });

                    dispatch({
                        type: "UPDATE_FAVOURITES",
                        payload: {
                            favourites: user?.favourites?.filter(f => f !== productID) || [],
                        },
                    });
                } else {
                    await axios.post(
                        `${import.meta.env.VITE_HOST}/user/favourites/add`,
                        { userID: user._id, productID }
                    );

                    dispatch({
                        type: "UPDATE_FAVOURITES",
                        payload: {
                            favourites: [productID, ...(user?.favourites || [])],
                        },
                    });
                }

                window.toastify("Updated favourites!", "success");
            } catch {
                window.toastify("Error updating favourites", "error");
            } finally {
                setAddingToFavourites(false);
            }
        } else {
            const guestFav = JSON.parse(localStorage.getItem("guest_favourites")) || [];
            const updatedFav = guestFav.includes(productID)
                ? guestFav.filter(id => id !== productID)
                : [productID, ...guestFav];

            localStorage.setItem("guest_favourites", JSON.stringify(updatedFav));
            window.toastify("Updated favourites!", "success");
        }
    };

    return (
        <a
            href={productUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative block outline-none"
        >
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#f3f3f3]">
                <img
                    src={item.mainImageURL}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {item?.comparedPrice > item?.price ? (
                    <span className="absolute top-3 left-3 text-xs font-bold bg-black text-white px-2 py-1">
                        {Math.floor(((item.comparedPrice - item.price) / item.comparedPrice) * 100)}% OFF
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 text-xs font-bold bg-white text-black px-2 py-1 tracking-widest">
                        NEW
                    </span>
                )}

                <div
                    role="button"
                    className="absolute top-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={handleAddToFavourites}
                >
                    {addingToFavourites ? (
                        <ButtonLoader />
                    ) : (
                        <Heart
                            size={16}
                            className={isFavourite ? "text-red-500 fill-red-500" : "text-gray-700"}
                        />
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        type="button"
                        className="w-full text-xs text-white bg-black font-bold py-3 hover:bg-white hover:text-black border border-black transition-all duration-200"
                        disabled={adding}
                        onClick={handleAddToCart}
                    >
                        {adding ? <ButtonLoader /> : hasMultipleVariants || hasOptions ? "Choose Option" : "Add To Cart"}
                    </button>
                </div>
            </div>

            <div className="pt-3 pb-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-800 font-bold">
                        {settings?.content?.currency} {item.price?.toLocaleString()}
                    </span>
                    {item?.comparedPrice > item?.price && (
                        <span className="text-xs line-through text-gray-400">
                            {settings?.content?.currency} {item.comparedPrice?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}


// ─── Main Section ─────────────────────────────────────────────
export default function PlatformFeaturedProductsLuxury({ storeSettings, isCustomDomain }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (storeSettings) fetchFeaturedProducts();
    }, [storeSettings]);

    const fetchFeaturedProducts = () => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${storeSettings?.sellerID}`)
            .then(res => {
                if (res.status === 200) setProducts(res.data?.products || []);
            })
            .catch(err => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    const viewAllUrl = isCustomDomain
        ? `/products`
        : `/brand/${storeSettings?.brandSlug}/pages/products`;

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-gray-400 text-sm">Loading...</p>
            </div>
        );
    }

    if (!products.length) return null;

    return (
        <section className="py-12">
            <div className="flex items-center justify-between px-6 md:px-12 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
                    Best Seller
                </h2>

                <a
                    href={viewAllUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-black transition border-b border-gray-800 pb-0.5"
                >
                    View All <ArrowRight size={14} />
                </a>
            </div>

            <div className="relative">
                <button
                    ref={prevRef}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition"
                >
                    ←
                </button>

                <button
                    ref={nextRef}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition"
                >
                    →
                </button>

                <Swiper
                    modules={[Navigation]}
                    speed={600}
                    spaceBetween={8}
                    slidesPerView={3}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        599: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {products.map((item, idx) => (
                        <SwiperSlide key={idx} className="px-1">
                            <ProductCard
                                item={item}
                                settings={storeSettings}
                                isCustomDomain={isCustomDomain}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}