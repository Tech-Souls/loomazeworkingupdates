import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingBag, ThumbsUp } from "lucide-react";
import ButtonLoader from "../ButtonLoader";
import { useAuthContext } from "../../contexts/AuthContext";
import SpotlightProductCounter from "../SpotlightProductCounter";

function ToolsSpotlightProduct({ settings, storeSettings }) {
  const [product, setProduct] = useState(null);
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
    console.log('hyhy')
  }, [settings ]);

 

  // --- Spotlight Badge ---
  const SpotlightBadge = () => (
    <div className="absolute w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center">
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
            <text className="fill-gray-800 text-[12px] font-bold tracking-wider">
              <textPath href="#circlePath" startOffset="10%" textAnchor="start">
                GETup 20% OFF 
              </textPath>
            </text>
            <text className="fill-gray-800 text-[12px] font-bold tracking-wider">
              <textPath href="#circlePath" startOffset="55%" textAnchor="start">
                GETup 20% OFF 
              </textPath>
            </text>
          </g>
        </svg>
        <div className="relative w-18 h-18 rounded-full bg-[#E53935] flex items-center justify-center">
          <ThumbsUp className="w-10 h-10 -rotate-30 text-white" />
        </div>
      </div>
    </div>
  );

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
      quantity: 1,
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
    <div className="w-full mt-15 font-[roboto-condensed] p-10 h-screen text-white bg-[#E53935]">
      {product ? (
        <div className="flex w-full h-full flex-wrap   relative items-start justify-center gap-5">
          <div className="flex items-center absolute -top-15 left-5 justify-center w-50 h-50">
            <SpotlightBadge />
          </div>

          <a
            href={`/brand/${storeSettings.brandSlug}/product/${product.slug}`}
            target="_blank"
            className="lg:w-[50%] w-full h-full rounded-2xl overflow-hidden"
          >
            <img
              className="w-full h-full object-cover"
              src={product.mainImageURL}
              alt={product.title}
            />
          </a>

          <div className="lg:w-[45%] w-full h-full p-5 flex flex-col gap-5">
        

            <h1 className="text-6xl font-[bebas-neue] capitalize">{product.title}</h1>

            <div className="flex items-center text-4xl gap-3">
              {showComparedPrice && (
                <p className="text-gray-400 line-through text-lg">
                  {settings?.content?.currency} {product.comparedPrice}
                </p>
              )}
              <p className="text-6xl  font-[bebas-neue]  text-white">
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

            <div className="w-full lg:h-17 gap-2 py-2 flex-wrap flex items-center justify-center lg:justify-start">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="block relative overflow-hidden  rounded-lg  group  transition-colors duration-300 hover:bg-gray-200  text-2xl  h-full lg:w-[80%]"
              >
                <span className=" w-full -group-hover:top-10 absolute left-0 h-full flex items-center justify-center gap-2 transition-all duration-75 top-0 font-[bebas-neue] bg-gray-500  text-white text-center ">
                 <ShoppingBag size={'20px'}/> Add to Cart
                </span>
                <span className=" w-full h-full flex bg-gray-200 text-gray-600  items-center justify-center  absolute left-0 top-50 transition-all  duration-300 ease-in-out group-hover:top-0 font-[bebas-neue] gap-2  text-center ">
                 <ShoppingBag size={'20px'}/>  Add to Cart
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

export default ToolsSpotlightProduct;
