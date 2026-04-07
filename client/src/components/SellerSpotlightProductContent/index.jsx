import React, { useEffect, useState } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import ButtonLoader from "../ButtonLoader";

function SellerSpotlightProductContent({ settings, setSettings }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expiresIn, setExpiresIn] = useState(0);
  const [productID, setProductID] = useState(null)
  const [previousProduct, setPreviousProduct] = useState(null)
  const handleAddProduct = () => {
    setLoading(true)
    if(!productID || !expiresIn){
      window.toastify("Please select a product and expiration date", "error");
      setLoading(false)
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_HOST}/seller/content/set-spotlight-product/${settings?.sellerID}`,
        {productID, expiresIn}
      )
      .then((res) => {
        const { status, data } = res;

        if (status === 200) {
      window.toastify("Added to spotlight!", "success");
          setSettings((prev) => ({
            ...prev,
            content: {
              ...prev.content,
              spotlightProduct: data.data,
            },
          }));
        }
      })
      .catch((err) => {
        console.error("Error setting spotlight product:", err.message);
      })
      .finally(()=>{
          setLoading(false)
      })
  };

  useEffect(() => {
    if (settings) {
      fetchFeaturedProducts();
      
    }
  }, []);

  useEffect(() => {
    const currentSpotlight = settings?.content?.spotlightProduct?.[0]?.productID;
    if(!previousProduct){
      setPreviousProduct(currentSpotlight);
    }
  }, [settings,productID,products])
  



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
    <div className="w-full mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl font-semibold text-slate-900">Choose a spotlight product</p>
          <p className="mt-1 text-sm text-slate-500">
            Select a product and expiration date to highlight in your store.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="date"
            className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500"
            onChange={(e) => setExpiresIn(e.target.value)}
          />
          <button
            onClick={handleAddProduct}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {loading ? <ButtonLoader /> : "Set Expires In"}
          </button>
        </div>
      </div>

      <div className="max-h-[28rem] overflow-x-auto bg-slate-50 px-5 pb-5 pt-6">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.15em] text-slate-500">
              <th className="border-b border-slate-200 px-4 py-3 text-center">#</th>
              <th className="border-b border-slate-200 px-4 py-3 text-center">Image</th>
              <th className="border-b border-slate-200 px-4 py-3 text-left">Title</th>
              <th className="border-b border-slate-200 px-4 py-3 text-center">Price</th>
              <th className="border-b border-slate-200 px-4 py-3 text-center">Qty</th>
              <th className="border-b border-slate-200 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((item, i) => (
              <tr
                key={item._id || i}
                className={`${previousProduct === item._id ? "bg-emerald-100" : "bg-white"}`}
              >
                <td className="border-b border-slate-200 px-4 py-4 text-center text-slate-700">{i + 1}</td>
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                    <img className="h-full w-full object-cover" src={item.mainImageURL} alt="" />
                  </div>
                </td>
                <td className="border-b border-slate-200 px-4 py-4 text-left text-slate-800">{item.title}</td>
                <td className="border-b border-slate-200 px-4 py-4 text-center text-slate-700">{item.price}</td>
                <td className="border-b border-slate-200 px-4 py-4 text-center text-slate-700">{item.stock}</td>
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  <button
                    onClick={() => {
                      setProductID(item._id);
                      setPreviousProduct(item._id);
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerSpotlightProductContent;
