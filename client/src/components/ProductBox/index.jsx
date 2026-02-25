import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Heart } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

export default function ProductBox({ item, idx, settings, isCustomDomain }) {
  const { user, isAuthenticated, dispatch } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addingToFavourites, setAddingToFavourites] = useState(false);
  console.log("user  authanticated", isAuthenticated);

  const guestFavourites =
    JSON.parse(localStorage.getItem("guest_favourites")) || [];

  const isFavourite = isAuthenticated
    ? user?.favourites?.includes(item._id)
    : guestFavourites.includes(item._id);
  console.log("isAuthenticating", isAuthenticated);
  const hasMultipleVariants = item.variants && item.variants.length > 1;
  const hasOptions = item.options && item.options.length > 0;

  // const handleAddToCart = async (e) => {
  //     e.preventDefault()

  //     if (hasMultipleVariants || hasOptions) {
  //         return window.open(isCustomDomain ? `/product/${item.slug}` : `/brand/${settings.brandSlug}/product/${item.slug}`, '_blank')
  //     }

  //     if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

  //     // Prepare cart data for products WITHOUT variants
  //     const data = {
  //         productID: item.productID,
  //         variantID: null,
  //         brandSlug: item.brandSlug,
  //         title: item.title,
  //         slug: item.slug,
  //         mainImageURL: item.mainImageURL,
  //         variantImageURL: null,
  //         quantity: 1,
  //         price: item.price,
  //         comparedPrice: item.comparedPrice,
  //         stock: item.stock,
  //         selectedOptions: []
  //     }

  //     // If product has exactly ONE variant, add it automatically
  //     if (item.variants && item.variants.length === 1) {
  //         const singleVariant = item.variants[0]
  //         cartData = {
  //             ...cartData,
  //             variantID: singleVariant.id,
  //             variantImageURL: singleVariant.imageURL || item.mainImageURL,
  //             price: singleVariant.price,
  //             stock: singleVariant.stock,
  //             selectedOptions: singleVariant.optionValues.map((value, idx) => ({
  //                 optionName: item.options[idx].name,
  //                 optionValue: value
  //             }))
  //         }
  //     }

  //     setAdding(true)
  //     try {
  //         const res = await axios.post(`${import.meta.env.VITE_HOST}/platform/product/add-to-cart?userID=${user._id}`, data)
  //         if (res.status === 201) {
  //             window.toastify(res.data.message, "success")
  //             dispatch({ type: "UPDATE_CART", payload: { cart: [data, ...(user.cart || [])] }, })
  //             window.open(isCustomDomain ? `/cart` : `/brand/${settings.brandSlug}/cart`, '_blank')
  //         }
  //     } catch (err) {
  //         window.toastify(err.response?.data?.message || "Error adding to cart", "error")
  //     } finally {
  //         setAdding(false)
  //     }
  // }

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
  // const handleAddToFavourites = async (e) => {
  //     e.preventDefault()
  //     if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

  //     const productID = item._id
  //     setAddingToFavourites(true)

  //     try {
  //         let res
  //         if (isFavourite) {
  //             res = await axios.delete(`${import.meta.env.VITE_HOST}/user/favourites/remove`, { data: { userID: user._id, productID } })
  //             if (res.status === 200) {
  //                 window.toastify("Removed from favourites!", "success")
  //                 dispatch({
  //                     type: "UPDATE_FAVOURITES", payload: { favourites: user.favourites.filter(f => f !== productID) },
  //                 })
  //             }
  //         } else {
  //             res = await axios.post(`${import.meta.env.VITE_HOST}/user/favourites/add`, { userID: user._id, productID })
  //             if (res.status === 201) {
  //                 window.toastify("Added to favourites!", "success")
  //                 dispatch({ type: "UPDATE_FAVOURITES", payload: { favourites: [productID, ...(user.favourites || [])] }, })
  //             }
  //         }
  //     } catch (err) {
  //         window.toastify(err.response?.data?.message || "Error updating favourites", "error")
  //     } finally {
  //         setAddingToFavourites(false)
  //     }
  // }
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
      window.toastify("Added to Favourite Successfully!", "success");
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
      className="group relative block outline-none bg-white border border-gray-200 transition-all duration-300 ease-linear hover:border-[var(--pr)]/30"
    >
      <div className="w-full h-40 sm:h-56 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" />
        )}

        <img
          src={`${item.mainImageURL}`}
          alt={item.name}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`w-full h-full object-contain p-3 transition-all duration-200 ease-linear group-hover:scale-105${loading ? "opacity-0" : "opacity-100"}`}
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="head text-sm sm:text-base text-[var(--text)] truncate">
          {item.title}
        </h3>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 whitespace-nowrap mt-2 sm:mt-3">
          <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
            <span className="text-gray-700 font-bold text-sm sm:text-base">
              {settings.content.currency} {item.price.toLocaleString()}
            </span>
            {item.comparedPrice > item.price && (
              <span className="line-through text-red-400 text-xs">
                {settings.content.currency}{" "}
                {item.comparedPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className="w-full sm:w-fit flex justify-center items-center mt-1 sm:mt-0 gap-1 text-[9px] sm:text-[11px] border border-[var(--pr)] rounded-full text-[var(--pr)] font-bold p-1 sm:px-2 sm:py-1.5 hover:bg-[var(--pr)] hover:text-white disabled:opacity-70"
            disabled={adding}
            onClick={handleAddToCart}
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
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
                {hasMultipleVariants || hasOptions
                  ? "Choose Option"
                  : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>

      {item.comparedPrice > item.price && (
        <span className="absolute top-3 left-3 text-green-600 font-semibold text-[7px] sm:text-[9px] bg-green-100 px-2 py-1 rounded">
          {Math.floor(
            ((item.comparedPrice - item.price) / item.comparedPrice) * 100,
          )}
          % OFF
        </span>
      )}

      <div
        className="absolute top-3 right-3 transition-all duration-300 ease-out opacity-0 p-2.5 rounded-xl bg-[var(--pr)]/10 group-hover:opacity-100"
        onClick={handleAddToFavourites}
      >
        {addingToFavourites ? (
          <ButtonLoader />
        ) : (
          <Heart
            size={18}
            className={
              isFavourite
                ? "text-red-500 fill-red-500"
                : "text-[#666] hover:text-red-500"
            }
          />
        )}
      </div>
    </a>
  );
}
