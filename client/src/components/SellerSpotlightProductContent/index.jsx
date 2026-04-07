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
    <div className="w-full p-5 overflow-hidden px-5 scrollBar-hide mt-5 border border-gray-200">
      <div className="w-full flex items-center mb-2 h-10  justify-between">
        <p className="text-xl font-bold capitalize mb-5">
        Chose a spotlight product
      </p>
      <input type="date" className="border h-10 rounded p-1"  onChange={(e)=>{setExpiresIn(e.target.value)} }/>
      <button onClick={handleAddProduct} className="px-3 py-1 bg-blue-600 text-white rounded-lg">
         {loading ? <ButtonLoader/> : 'Set Expires In'}
      </button>
      </div>
      <div className="w-full h-60 overflow-auto bg-gray-300">
        <table className="w-full border ">
          <thead className="w-full capitalize ">
            <tr className="w-full p-2 border ">
              <th className="px-2 py-2 border">#</th>
              <th className="px-2 py-2  border">image</th>
              <th className="px-2 py-2  border">title</th>
              <th className="px-2 py-2  border">price</th>
              <th className="px-2 py-2  border">qty</th>
              <th className="px-2 py-2  border">action</th>
            </tr>
          </thead>
          <tbody className="w-full bg-white ">
            {products.map((item,i)=>{
              return(
                <tr key={i} className={`w-full  text-center ${previousProduct === item._id ? 'bg-green-300' : ''  }  border   `}>
              <td className="px-2 border py-2">{i+1}</td>
              <td className="px-2   flex items-center justify-center py-2">
                <img className="w-10 h-10  object-cover" src={item.mainImageURL} alt="" />
              </td>
              <td className="px-2  border py-2">{item.title}</td>
              <td className="px-2  border py-2">{item.price}</td>
              <td className="px-2  border   py-2">{item.stock}</td>
              
              <td className="px-2   py-2">
                <button onClick={() => {setProductID(item._id) 
                  setPreviousProduct(item._id)
                  }} className="px-3 py-1 bg-green-600 text-white rounded-lg mx-2">
                 Add
                </button>
                
              </td>
            </tr>
              )

            })}
          </tbody>
        </table>

       
      </div>
    </div>
  );
}

export default SellerSpotlightProductContent;
