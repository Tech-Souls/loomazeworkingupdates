import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Loader from "../../../components/Loader";

export default function Favourites({ isCustomDomain }) {
    const { user } = useAuthContext()
    const [favourites, setFavourites] = useState([])
    const [currency, setCurrency] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user._id) fetchFavourites()
    }, [user._id])

    const fetchFavourites = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/user/favourites/get?userID=${user._id}`)
            .then(res => {
                setFavourites(res.data.favourites || [])
                setCurrency(res.data.currency)
            })
            .catch(err => console.error("Frontend GET error:", err))
            .finally(() => setLoading(false))
    }

    const handleRemoveFavourite = async (e, productID) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            await axios.delete(`${import.meta.env.VITE_HOST}/user/favourites/remove`, { data: { userID: user._id, productID }, });
            window.toastify("Removed from favourites", "success");
            setFavourites(favourites.filter(f => f._id !== productID));
        } catch (err) {
            window.toastify("Error removing product", "error");
        }
    };

    if (loading) return <Loader />

    return (
        <div className="p-3 sm:p-6 md:p-10">
            <div className="flex items-center mb-6">
                <h1 className="head font-bold text-xl sm:text-2xl head text-[var(--text)]">Favourites</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favourites.length > 0 ?
                    favourites.map((item) => (
                        <a href={
                            isCustomDomain
                                ? `/product/${item.slug}`
                                : `/brand/${item.brandSlug}/product/${item.slug}`
                        }
                            target="_blank" key={item._id} className="group block outline-none border border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 ease-linear hover:border-[var(--pr)]/30 ">
                            <div className="relative">
                                <img src={`${item.mainImageURL}`} alt={item.title} className="w-full h-52 object-contain p-3 transition-all duration-200 ease-linear group-hover:scale-105 " />
                                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition bg-black/20 rounded-2xl">
                                    <button className="bg-white p-3 rounded shadow hover:bg-gray-200 text-[var(--primary)]" onClick={(e) => handleRemoveFavourite(e, item._id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h6 className="head font-medium truncate text-[var(--text)]">{item.title}</h6>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{currency} {item.discountedPrice}</p>
                                    <p className="text-xs text-red-500 line-through font-semibold">{currency} {item.price}</p>
                                </div>
                            </div>
                        </a>
                    ))
                    :
                    <p className="text-sm text-center bg-amber-100 text-amber-600 p-2 rounded-lg">No favourite product found!</p>
                }
            </div>
        </div>
    );
}