import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Heart } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

export default function ProductBoxThree({
  item,
  idx,
  settings,
  isCustomDomain,
}) {
  const { user, isAuthenticated, dispatch } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addingToFavourites, setAddingToFavourites] = useState(false);

  const guestFavourites =
    JSON.parse(localStorage.getItem("guest_favourites")) || [];

  const isFavourite = isAuthenticated
    ? user?.favourites?.includes(item._id)
    : guestFavourites.includes(item._id);
  const hasMultipleVariants = item.variants && item.variants.length > 1;
  const hasOptions = item.options && item.options.length > 0;
  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (hasMultipleVariants || hasOptions) {
      return window.open(
        isCustomDomain
          ? `/product/${item.slug}`
          : `/brand/${settings.brandSlug}/product/${item.slug}`,
        "_blank",
      );
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

    // 🔐 LOGGED IN USER
    if (isAuthenticated && user?._id) {
      setAdding(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`,
          cartItem,
        );

        if (res.status === 201) {
          window.toastify(res.data.message, "success");
          dispatch({
            type: "UPDATE_CART",
            payload: { cart: [cartItem, ...(user.cart || [])] },
          });
        }
      } catch (err) {
        window.toastify("Error adding to cart", "error");
      } finally {
        setAdding(false);
      }
    }

    // 👤 GUEST USER
    else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      localStorage.setItem(
        "guest_cart",
        JSON.stringify([cartItem, ...guestCart]),
      );
      window.toastify("Added to cart!", "success");
    }

    window.open(
      isCustomDomain ? `/cart` : `/brand/${settings.brandSlug}/cart`,
      "_blank",
    );
  };
  const handleAddToFavourites = async (e) => {
    e.preventDefault();
    const productID = item._id;

    // 🔐 LOGGED IN USER
    if (isAuthenticated && user?._id) {
      setAddingToFavourites(true);
      try {
        let res;
        if (isFavourite) {
          res = await axios.delete(
            `${import.meta.env.VITE_HOST}/user/favourites/remove`,
            { data: { userID: user._id, productID } },
          );
          dispatch({
            type: "UPDATE_FAVOURITES",
            payload: {
              favourites: user.favourites.filter((f) => f !== productID),
            },
          });
        } else {
          res = await axios.post(
            `${import.meta.env.VITE_HOST}/user/favourites/add`,
            { userID: user._id, productID },
          );
          dispatch({
            type: "UPDATE_FAVOURITES",
            payload: { favourites: [productID, ...(user.favourites || [])] },
          });
        }
        window.toastify("Updated favourites!", "success");
      } catch {
        window.toastify("Error updating favourites", "error");
      } finally {
        setAddingToFavourites(false);
      }
    }

    // 👤 GUEST USER
    else {
      const guestFav =
        JSON.parse(localStorage.getItem("guest_favourites")) || [];
      const updatedFav = guestFav.includes(productID)
        ? guestFav.filter((id) => id !== productID)
        : [productID, ...guestFav];

      localStorage.setItem("guest_favourites", JSON.stringify(updatedFav));
      window.toastify("Updated favourites!", "success");
    }
  };
  return (
    <a
      key={idx}
      target="_blank"
      href={
        isCustomDomain
          ? `/product/${item.slug}`
          : `/brand/${settings.brandSlug}/product/${item.slug}`
      }
      className="group relative block overflow-hidden shadow rounded-2xl"
    >
      <div className="relative w-full h-60 sm:h-70 overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--pr)]/30 transition-all duration-300 ease-linear">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" />
        )}
        <img
          src={`${item.mainImageURL}`}
          alt={item.title}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`w-full h-full object-contain p-3 sm:p-4 transition-transform duration-700 ease-in-out group-hover:scale-110 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="absolute top-2 right-2.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <button
            onClick={handleAddToFavourites}
            disabled={addingToFavourites}
            className="p-2 rounded-full hover:bg-red-100 transition-all duration-200"
          >
            {addingToFavourites ? (
              <ButtonLoader />
            ) : (
              <Heart
                size={18}
                className={`${isFavourite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"}`}
              />
            )}
          </button>
        </div>
        {item.comparedPrice > item.price && (
          <span className="absolute top-3 left-3 bg-green-200 text-green-600 text-[10px] font-semibold px-3 py-1 rounded-full shad">
            {Math.floor(
              ((item.comparedPrice - item.price) / item.comparedPrice) * 100,
            )}
            % OFF
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>

        <div className="flex items-center justify-between">
          <div className="space-x-2 flex flex-col sm:block">
            <span className="text-gray-900 font-bold text-sm sm:text-base">
              {settings.content.currency} {item.price.toLocaleString()}
            </span>
            {item.comparedPrice > item.price && (
              <span className="line-through text-red-500 text-xs">
                {settings.content.currency}{" "}
                {item.comparedPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || item.stock === 0}
            className="p-1.5 bg-[var(--pr)]/10 text-gray-700 rounded-full shad hover:bg-[var(--pr)] hover:text-white transition-all duration-200"
          >
            {adding ? (
              <ButtonLoader />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
              >
                <path
                  d="M8 7H16C17.8856 7 18.8284 7 19.4142 7.58579C20 8.17157 20 9.11438 20 11V15C20 18.2998 20 19.9497 18.9749 20.9749C17.9497 22 16.2998 22 13 22H11C7.70017 22 6.05025 22 5.02513 20.9749C4 19.9497 4 18.2998 4 15V11C4 9.11438 4 8.17157 4.58579 7.58579C5.17157 7 6.11438 7 8 7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 9.5C16 5.63401 14.2091 2 12 2C9.79086 2 8 5.63401 8 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </a>
  );
}
