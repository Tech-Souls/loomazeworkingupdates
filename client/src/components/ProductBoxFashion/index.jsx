import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Heart } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

export default function ProductBoxFashion({
  item,
  idx,
  settings,
  isCustomDomain,
}) {
  const { user, isAuthenticated, dispatch } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addingToFavourites, setAddingToFavourites] = useState(false);
  console.log("Authentication", isAuthenticated);
  console.log("user and dispatch", user, dispatch);

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

  //     // if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

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
  //     // if (!isAuthenticated || !user?._id) return window.toastify("Please login to continue!", "info")

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
      className="group relative block outline-none"
    >
      <div className="relative w-full h-42 sm:h-56 md:h-72 overflow-hidden bg-[#f8f8f8]">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" />
        )}
        <img
          src={`${item.mainImageURL}`}
          alt={item.name}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`w-full h-full object-contain p-2 sm:p-3 transition-transform duration-300 ease-in-out group-hover:scale-105 ${loading ? "opacity-0" : "opacity-100"}`}
        />

        <div className="absolute inset-0 flex flex-row items-end justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out bg-black/5">
          <button
            className="group/button relative w-full flex justify-center items-center text-xs text-white bg-[#333] font-bold p-3 hover:text-black border border-[#333] hover:border-black translate-y-full group-hover:translate-y-0 disabled:bg-[#333] transition-all duration-200 ease-linear"
            disabled={adding}
            onClick={handleAddToCart}
          >
            {adding ? (
              <ButtonLoader />
            ) : (
              <>
                <span className="z-1">
                  {hasMultipleVariants || hasOptions
                    ? "Choose Option"
                    : "Add To Cart"}
                </span>
                <span className="absolute top-0 left-0 w-0 h-full bg-white z-0 group-hover/button:w-full transition-all duration-200 ease-linear"></span>
              </>
            )}
          </button>
        </div>

        <div
          role="button"
          className="group/heart absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-red-100 transition-all duration-200 ease-linear opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0"
          onClick={handleAddToFavourites}
        >
          {addingToFavourites ? (
            <ButtonLoader />
          ) : (
            <Heart
              size={16}
              className={`transition-all duration-200 ease-linear ${isFavourite ? "text-red-500 fill-red-500" : "text-[#333] group-hover/heart:text-red-500"}`}
            />
          )}
        </div>

        {item.comparedPrice > item.price && (
          <span className="absolute top-3 left-3 text-white font-semibold text-[10px] bg-[#f83b2a] px-2 py-1">
            {Math.floor(
              ((item.comparedPrice - item.price) / item.comparedPrice) * 100,
            )}
            % OFF
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-center items-center">
        <p className="head text-sm sm:text-base text-gray-950 text-center line-clamp-1">
          {item.title}
        </p>

        <div className="flex flex-row items-center gap-2 mt-2">
          {item.comparedPrice > item.price && (
            <span className="line-through text-gray-700 font-bold text-sm">
              {settings.content.currency} {item.comparedPrice.toLocaleString()}
            </span>
          )}
          <span className="text-gray-950 font-bold text-sm sm:text-base">
            {settings.content.currency} {item.price.toLocaleString()}
          </span>
        </div>
      </div>
    </a>
  );
}
