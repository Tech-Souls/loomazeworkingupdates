import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    user: {},
    guestCart: JSON.parse(localStorage.getItem("guest_cart")) || [],
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGGED_IN":
        case "SET_PROFILE":
            return { ...state, isAuthenticated: true, user: payload.user };
        case "UPDATE_CART":
            return { ...state, user: { ...state.user, cart: payload.cart } };
        case "UPDATE_GUEST_CART":
            return { ...state, guestCart: payload.cart };
        case "UPDATE_FAVOURITES":
            return { ...state, user: { ...state.user, favourites: payload.favourites } };
        case "SET_LOGGED_OUT":
            return { ...initialState, guestCart: [] };
        default:
            return state;
    }
};

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(true);

    // ================== MERGE FUNCTIONS ==================
    const mergeGuestCart = async (userID) => {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        if (guestCart.length === 0) return;

        try {
            await axios.post(`${import.meta.env.VITE_HOST}/platform/cart/merge`, {
                userID,
                cartItems: guestCart,
            });

            // Update context cart
            dispatch({ type: "UPDATE_CART", payload: { cart: guestCart } });

            // Clear guest cart
            localStorage.removeItem("guest_cart");
        } catch (err) {
            console.error("Guest cart merge failed:", err.message);
        }
    };

    const mergeGuestFavourites = async (userID) => {
        const guestFav = JSON.parse(localStorage.getItem("guest_favourites")) || [];
        if (guestFav.length === 0) return;

        try {
            await axios.post(`${import.meta.env.VITE_HOST}/user/favourites/merge`, {
                userID,
                favourites: guestFav,
            });

            dispatch({
                type: "UPDATE_FAVOURITES",
                payload: { favourites: guestFav },
            });

            localStorage.removeItem("guest_favourites");
        } catch (err) {
            console.error("Guest favourites merge failed:", err.message);
        }
    };

    // ================== GET USER PROFILE ==================
    const getUserProfile = useCallback(async (token, brandSlug) => {
        if (!token) return;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-brand-slug": brandSlug,
            },
        };

        try {
            const res = await axios.get(`${import.meta.env.VITE_HOST}/auth/user`, config);
            if (res.status === 200) {
                const user = res.data.user;
                dispatch({ type: "SET_PROFILE", payload: { user } });

                // Merge guest cart & favourites
                await mergeGuestCart(user._id);
                await mergeGuestFavourites(user._id);
            }
        } catch (err) {
            console.error("Error fetching user profile:", err.message);
            dispatch({ type: "SET_LOGGED_OUT" });
            localStorage.removeItem(`ecomplatjwt_${brandSlug}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // ================== INIT ON PAGE LOAD ==================
    useEffect(() => {
        const resolveAndVerify = async () => {
            setLoading(true);

            const currentDomain = window.location.hostname;
            const isMainDomain =
                currentDomain.includes("localhost") ||
                currentDomain.includes("vercel.app") ||
                currentDomain.includes(import.meta.env.VITE_MAIN_DOMAIN);

            let detectedSlug = null;

            if (!isMainDomain) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_HOST}/auth/brand/get?domain=${currentDomain}`);
                    detectedSlug = res.data.brand.brandSlug;
                } catch (err) {
                    console.error("Could not resolve domain to brand");
                }
            } else {
                const pathParts = window.location.pathname.split("/");
                const brandIndex = pathParts.indexOf("brand");
                if (brandIndex !== -1 && pathParts[brandIndex + 1]) {
                    detectedSlug = pathParts[brandIndex + 1];
                }
            }

            if (detectedSlug) {
                localStorage.setItem("last_visited_brand", detectedSlug);
                const token = localStorage.getItem(`ecomplatjwt_${detectedSlug}`);
                if (token) {
                    await getUserProfile(token, detectedSlug);
                }
            }

            setLoading(false);
        };

        resolveAndVerify();
    }, [getUserProfile]);

    // ================== LOGOUT ==================
    const handleLogout = () => {
        const currentDomain = window.location.hostname;
        const isMainDomain =
            currentDomain.includes("localhost") ||
            currentDomain.includes("vercel.app") ||
            currentDomain.includes(import.meta.env.VITE_MAIN_DOMAIN);

        const brand = state.user.brandSlug || localStorage.getItem("last_visited_brand");

        // Clear JWT & guest data
        localStorage.removeItem(`ecomplatjwt_${brand}`);
        localStorage.removeItem("last_visited_brand");
        localStorage.removeItem("guest_cart");
        localStorage.removeItem("guest_favourites");

        dispatch({ type: "SET_LOGGED_OUT" });
        window.location.replace(isMainDomain ? `/brand/${brand}` : "/");
    };

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, setLoading, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);