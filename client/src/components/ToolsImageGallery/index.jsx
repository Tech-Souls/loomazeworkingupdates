import React, { useEffect, useState } from "react";
import { Image } from "antd";
import axios from "axios";

export default function ToolsImageGallery({ settings }) {
  const demoGallery = [
    { _id: "img1", imageURL: "https://cdn.loomaze.com/uploads/headphones.jpg" },
    { _id: "img2", imageURL: "https://cdn.loomaze.com/uploads/smartwatch.jpg" },
    { _id: "img3", imageURL: "https://cdn.loomaze.com/uploads/running-shoes.jpg" },
    { _id: "img4", imageURL: "https://cdn.loomaze.com/uploads/wallet.jpg" },
    { _id: "img5", imageURL: "https://cdn.loomaze.com/uploads/coffee-maker.jpg" },
  
  ];

  const [gallery, setGallery] = useState(demoGallery);
  const [filteredGallery, setFilteredGallery] = useState(demoGallery);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!settings?.sellerID) {
      setLoading(false);
      return;
    }
    fetchGallery();
  }, [settings]);

  const fetchGallery = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-image-gallery?sellerID=${settings?.sellerID}`
      )
      .then((res) => {
        if (res.status === 200 && res.data?.gallery?.length > 0) {
          setGallery(res.data.gallery);
          setFilteredGallery(res.data.gallery.slice(0, 5)); // ✅ keep filtered
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };


  return (
    <div className="px-2 w-full min-h-screen mt-10 ">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredGallery.length <= 5 ? (
        // ✅ PERFECT 5 LAYOUT
       <div className="w-full flex flex-col lg:flex-row lg:h-screen gap-3">

  {/* LEFT SIDE */}
  <div className="w-full lg:w-[24%] h-[400px] lg:h-full flex gap-3 lg:flex-col">

    <div className="w-1/2 lg:w-full h-full lg:h-[48%] rounded-2xl overflow-hidden group">
      <img
        src={filteredGallery[0].imageURL}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        alt=""
      />
    </div>

    <div className="w-1/2 lg:w-full h-full lg:h-[48%] rounded-2xl overflow-hidden group">
      <img
        src={filteredGallery[1].imageURL}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        alt=""
      />
    </div>

  </div>

  {/* CENTER IMAGE */}
  <div className="w-full lg:w-[49%] h-[300px] lg:h-full rounded-2xl overflow-hidden group">
    <img
      src={filteredGallery[2].imageURL}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      alt=""
    />
  </div>

  {/* RIGHT SIDE */}
  <div className="w-full lg:w-[24%] h-[400px] lg:h-full flex gap-3 lg:flex-col">

    <div className="w-1/2 lg:w-full h-full lg:h-[48%] rounded-2xl overflow-hidden group">
      <img
        src={filteredGallery[3].imageURL}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        alt=""
      />
    </div>

    <div className="w-1/2 lg:w-full h-full lg:h-[49%] rounded-2xl overflow-hidden group">
      <img
        src={filteredGallery[4].imageURL}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        alt=""
      />
    </div>

  </div>

</div>
       
      ) : (
        // ✅ FALLBACK GRID
        <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
            {
                filteredGallery.map((item,idx)=>{
                 return(  <div className="w-full h-80 overflow-hidden group rounded-lg "> <img className="w-full h-full object-cover group-hover:scale-110 transition-scale duration-300" src={item.imageURL} alt="" /></div>)
                })
            }
           
        </div>
      )}
    </div>
  );
}