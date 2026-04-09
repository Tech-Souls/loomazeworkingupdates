import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Heart, ShoppingBag } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

export default function ProductBoxPremium({
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
      className="group relative h-[350px]  rounded-lg   overflow-hidden block outline-none"
    >
      <div className="relative w-full  h-[70%] rounded-xl overflow-hidden ">
        {loading && <div className="absolute inset-0 animate-pulse " />}
        <img
          src={`${item.mainImageURL}`}
          alt={item.name}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`w-full h-full object-cover   overflow-hidden ${loading ? "opacity-0" : "opacity-100"}`}
        />

        <div className="absolute inset-0 flex flex-row items-end justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out bg-black/5">
          <button
            className="group/heart w-8 h-8 hover:w-32  absolute top-14  hover:bg-black hover:text-white right-3 p-2 bg-white rounded-full  transition-all duration-200 ease-linear opacity-0   group-hover:opacity-100 translate-x-5 group-hover:translate-x-0"
            disabled={adding}
            onClick={handleAddToCart}
          >
            {adding ? (
              <ButtonLoader />
            ) : hasMultipleVariants || hasOptions ? (
              "Choose Option"
            ) : (
              <span
                className={`w-full h-full flex overflow-hidden items-center  justify-between`}
              >
                <ShoppingBag
                  size={16}
                  className={`transition-all  text-xl duration-20 `}
                />
                <span className="text-xs hidden font-bold  whitespace-nowrap w-[80%] h-full  group-hover/heart:block ">{`Add to Cart`}</span>
              </span>
            )}
          </button>
        </div>

        <div
          role="button"
          className={`group/heart w-8 h-8 hover:w-32  absolute top-3  hover:bg-black hover:text-white right-3 p-2 bg-white rounded-full  transition-all duration-200 ease-linear opacity-0   group-hover:opacity-100 translate-x-5 group-hover:translate-x-0`}
          onClick={handleAddToFavourites}
        >
          {addingToFavourites ? (
            <ButtonLoader />
          ) : (
            <span
              className={`w-full h-full flex overflow-hidden items-center  justify-between`}
            >
              <Heart
                size={16}
                className={`transition-all  text-xl duration-20 ${isFavourite ? "fill-red-600 text-red-600" : "text-black group-hover/heart:text-white"} font-bold ease-linear`}
              />
              <span className="text-xs hidden font-bold  whitespace-nowrap w-[80%] h-full  group-hover/heart:block ">{`${isFavourite ? "Remove" : "Add To"} Wishlist`}</span>
            </span>
          )}
        </div>

        {item.comparedPrice > item.price && (
          <span className="absolute top-0 left-0 text-white font-semibold text-[10px] bg-[#E95144] px-2 py-1">
            {Math.floor(
              ((item.comparedPrice - item.price) / item.comparedPrice) * 100,
            )}
            % OFF
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-start items-start">
        <p className="head text-sm relative transition-all duration-200 hover:text-blue-600 group/item sm:text-base text-[var(--text)] text-left line-clamp-1 cursor-pointer">
          {item.title}

          {/* 2. Span ab is group ke hover par scale hoga */}
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-blue-600 origin-left transform scale-x-0 transition-transform duration-300 group-hover/item:scale-x-100"></span>
        </p>
        <div className="flex flex-row items-center gap-2 mt-2">
          <span className="text-blue-700 font-bold text-md sm:text-lg">
            {settings.content.currency} {item.price.toLocaleString()}
          </span>
          <span className="text-xl text-gray-700 ">{item.comparedPrice}</span>
          {item.comparedPrice > item.price && (
            <span className="line-through text-red-400 text-xs">
              {settings.content.currency} {item.comparedPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
