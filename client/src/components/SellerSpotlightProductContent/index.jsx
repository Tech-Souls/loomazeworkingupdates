import React, { useEffect, useState } from "react";
import axios from "axios";
import { Settings } from "lucide-react";

function SellerSpotlightProductContent({ settings, setSettings }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddProduct = (item) => {
    const productID = item._id;
    axios
      .post(
        `${import.meta.env.VITE_HOST}/seller/content/set-spotlight-product/${settings?.sellerID}`,
        { productID },
      )
      .then((res) => {
        const { status, data } = res;
        console.log(data)
    
        if (status === 200) {
          window.tostify("product added to spotlight", "success");
          setSettings((prev) => ({
            ...prev,
            content: {
              ...prev.content,
              spotlightProduct: data.data, 
            },
          }));
        }
      })
      .catch(err => {
    console.error('Error setting spotlight product:', err.message);
  });
  };

  useEffect(() => {
    if (settings) {
      fetchFeaturedProducts();
    }
  }, [settings]);

  const fetchFeaturedProducts = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-featured-products?sellerID=${settings?.sellerID}`,
      )
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data?.products);
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full p-5 overflow-hidden px-5 scrollBar-hide mt-5 border border-gray-200">
      <p className="text-xl font-bold capitalize mb-5">
        Chose a spotlight product
      </p>
      <div className="w-full grid grid-cols-4 gap-5 p-5 bg-gray-300">
        {products.map((item, idx) => {
          return (
            <div
              key={idx}
              className="w-full flex flex-col gap-2  shrink-0 p-5 bg-white"
            >
              <img
                className="w-20 h-20 object-contain"
                src={item.mainImageURL}
                alt=""
              />
              <h6>{item.title}</h6>
              <p>PRICE: {item.price}</p>
              <p>QTY: {item.stock}</p>

              <button
                onClick={() => handleAddProduct(item)}
                className="w-full border rounded-lg hover:bg-gray-900 hover:text-white py-2"
              >
                Add to SpotLight
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerSpotlightProductContent;
