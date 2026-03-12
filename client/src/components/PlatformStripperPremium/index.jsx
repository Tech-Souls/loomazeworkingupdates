import React, { useEffect, useState } from "react";
import axios from "axios";

function PlatformStripperPremium(settings) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-stripper-content/${settings?.settings?.sellerID}`
      )
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data?.content || []);
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message));
  }, [settings?.settings?.sellerID]);

  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full h-60 flex flex-col items-center justify-center gap-6">

      {/* TOP STRIP */}
      <div className="w-full h-20  overflow-hidden bg-yellow-300 rotate-[-4deg] flex items-center relative">

        <div className="marquee-left flex items-center absolute">
          {repeatedItems.map((elem, i) => (
            <div
              key={`top-${i}`}
              className="flex items-center gap-4 px-6 shrink-0"
            >
              <span className="font-medium">{elem.text}</span>

              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img
                  src={elem.imageURL}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="w-full h-20 overflow-hidden bg-gray-300 rotate-[2deg] flex items-center relative">

        <div className="marquee-right flex items-center absolute">
          {repeatedItems.map((elem, i) => (
            <div
              key={`bottom-${i}`}
              className="flex items-center gap-4 px-6 shrink-0"
            >
              <span className="font-medium">{elem.text}</span>

              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img
                  src={elem.imageURL}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default PlatformStripperPremium;