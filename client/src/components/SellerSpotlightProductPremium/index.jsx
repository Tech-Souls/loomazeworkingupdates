import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ThumbsUp } from "lucide-react";
import ButtonLoader from "../ButtonLoader";
import { useAuthContext } from "../../contexts/AuthContext";
import SpotlightProductCounter from "../SpotlightProductCounter";

function SellerSpotlightProductPremium({ settings, storeSettings }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addingToFavourites, setAddingToFavourites] = useState(false);
  const { user, isAuthenticated, dispatch } = useAuthContext();

  // --- Persistent Sale End Date ---
  const [saleEndDate, setSaleEndDate] = useState(null);

  // --- Fetch Spotlight Product ---
  const fetchSpotlightProduct = () => {
    if (!settings?.sellerID) return;

    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-spotlight-product/${settings?.sellerID}`,
      )
      .then((res) => {
        const productData = res.data?.data?.content?.spotlightProduct;
        const spotlight = productData?.[0];

        if (spotlight?.expiresIn) {
          setSaleEndDate(new Date(spotlight.expiresIn).getTime()); // ✅ only once
        }

        setProduct(spotlight?.productID || null);
      })
      .catch((err) => console.error("Error fetching spotlight product:", err));
  };

  useEffect(() => {
    fetchSpotlightProduct();
  }, [settings ]);

 

  // --- Spotlight Badge ---
  const SpotlightBadge = () => (
    <div className="absolute w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-blue-600 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 p-2 w-full h-full"
        >
          <defs>
            <path
              id="circlePath"
              d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
            />
          </defs>
          <g
            className="animate-spin origin-center"
            style={{ animationDuration: "6s" }}
          >
            <text className="fill-white text-[14px] font-semibold tracking-wider">
              <textPath
                href="#circlePath"
                startOffset="25%"
                textAnchor="middle"
              >
                Spotlight
              </textPath>
            </text>
            <text className="fill-white text-[14px] font-semibold tracking-wider">
              <textPath
                href="#circlePath"
                startOffset="80%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                Spotlight
              </textPath>
            </text>
          </g>
        </svg>
        <div className="relative w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center">
          <ThumbsUp className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  // --- Quantity Handlers ---
  const increaseQty = () => {
    if (qty < product?.stock) setQty((prev) => prev + 1);
  };
  const decreaseQty = () => {
    if (qty > 0) setQty((prev) => prev - 1);
  };

  // --- Add to Cart ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!product) return;

    const cartItem = {
      productID: product._id,
      variantID: null,
      brandSlug: storeSettings.brandSlug,
      title: product.title,
      slug: product.slug,
      mainImageURL: product.mainImageURL,
      variantImageURL: null,
      quantity: qty,
      price: product.price,
      comparedPrice: product.comparedPrice,
      stock: product.stock,
      selectedOptions: [],
    };

    setAdding(true);

    try {
      if (isAuthenticated && user?._id) {
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
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        localStorage.setItem(
          "guest_cart",
          JSON.stringify([cartItem, ...guestCart]),
        );
        window.toastify("Added to cart!", "success");
      }
    } catch (err) {
      window.toastify("Error adding to cart", "error");
    } finally {
      setAdding(false);
      window.open(`/brand/${storeSettings.brandSlug}/cart`, "_blank");
    }
  };

  // --- Add to Wishlist ---
  const handleAddToFavourites = async (e) => {
    e.preventDefault();
    if (!product) return;
    const productID = product._id;

    setAddingToFavourites(true);

    try {
      if (isAuthenticated && user?._id) {
        if (user.favourites?.includes(productID)) {
          await axios.delete(
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
          await axios.post(`${import.meta.env.VITE_HOST}/user/favourites/add`, {
            userID: user._id,
            productID,
          });
          dispatch({
            type: "UPDATE_FAVOURITES",
            payload: { favourites: [productID, ...(user.favourites || [])] },
          });
        }
      } else {
        const guestFav =
          JSON.parse(localStorage.getItem("guest_favourites")) || [];
        const updatedFav = guestFav.includes(productID)
          ? guestFav.filter((id) => id !== productID)
          : [productID, ...guestFav];
        localStorage.setItem("guest_favourites", JSON.stringify(updatedFav));
      }
      window.toastify("Wishlist updated!", "success");
    } catch {
      window.toastify("Error updating wishlist", "error");
    } finally {
      setAddingToFavourites(false);
    }
  };

  const showComparedPrice =
    product?.comparedPrice && product.comparedPrice > product.price;

  return (
    <div className="w-full mt-15  p-10 font-[Inter]
     text-white">
      {product ? (
        <div className="flex w-full h-full flex-wrap  relative items-start justify-center gap-5">
          <div className="flex items-center absolute -top-25 left-5 justify-center w-50 h-50">
            <SpotlightBadge />
          </div>

          <a
            href={`/brand/${storeSettings.brandSlug}/product/${product.slug}`}
            target="_blank"
            className="lg:w-[48%] w-full h-full rounded-2xl overflow-hidden"
          >
            <img
              className="w-full h-full object-cover"
              src={product.mainImageURL}
              alt={product.title}
            />
          </a>

          <div className="lg:w-[45%] w-full h-full p-3 flex flex-col gap-5 text-black">
            <div className="lg:w-[70%] w-full h-35 p-2 lg:px-5 rounded-xl border">
              <p className="text-xl font-semibold">Hurry up! Sale end in </p>
              <SpotlightProductCounter saleEndDate={saleEndDate} />
            </div>

            <h1 className="text-4xl font-semibold">{product.title}</h1>

            <div className="flex items-center gap-3">
              {showComparedPrice && (
                <p className="text-gray-400 line-through text-lg">
                  {settings?.content?.currency} {product.comparedPrice}
                </p>
              )}
              <p className="text-2xl font-bold text-[#E74133]">
                {settings?.content?.currency} {product.price}
              </p>
            </div>

            <p> just {product.stock} left. Order soon!</p>
            <p>
              {product.sizeChart
                ? "size :"
                : product.variants
                  ? "variants"
                  : ""}
            </p>

            <div className="w-full lg:h-15 gap-2 flex-wrap flex items-center py-2 justify-between">
              <div className="lg:w-[25%] w-full bg-white hover:border-blue-500 hover:shadow-lg shadow-blue-200 flex items-center justify-between rounded-lg h-full p-2 border">
                <p
                  onClick={decreaseQty}
                  className="cursor-pointer px-3 text-xl hover:text-blue-500 font-semibold"
                >
                  -
                </p>
                <p className="text-lg font-semibold">{qty}</p>
                <p
                  onClick={increaseQty}
                  className="cursor-pointer px-3 text-xl hover:text-blue-500 font-semibold"
                >
                  +
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="block relative overflow-hidden  rounded-lg h-12 group  transition-colors duration-300 hover:bg-black font-semibold w-[75%] lg:w-60 mx-auto"
              >
                <span className=" w-full -group-hover:top-10 absolute left-0 h-full flex items-center justify-center transition-all duration-75 top-0   bg-[#304FFE]  font-semibold  text-white text-center ">
                  Add to Cart
                </span>
                <span className=" w-full h-full flex bg-black  items-center justify-center  absolute left-0 top-50 transition-all  duration-300 ease-in-out group-hover:top-0 font-semibold  text-white text-center ">
                  Add to Cart
                </span>
              </button>

              <div
                onClick={handleAddToFavourites}
                className="w-12 h-12 bg-gray-200 flex hover:bg-black hover:text-white text-black font-semibold items-center justify-center rounded-full cursor-pointer"
              >
                {addingToFavourites ? (
                  <ButtonLoader />
                ) : (
                  <Heart
                    className={`transition-all duration-200 ease-linear ${isAuthenticated && user?.favourites?.includes(product._id) ? "text-red-500 fill-red-500" : ""}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading spotlight product...</p>
      )}
    </div>
  );
}

export default SellerSpotlightProductPremium;
