import React, { useEffect, useState } from "react";

function PlatformIconsPremium({settings}) {
    const [icons, setIcons] = useState([])

const dummy = [
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968852.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968866.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968896.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968841.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968734.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968770.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968704.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968830.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968717.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968784.png" },
  { imageURL: "https://cdn-icons-png.flaticon.com/512/5968/5968743.png" },
];

useEffect(() => {
  if(settings?.content?.brandIcons.length > 0){
   return  setIcons(settings?.content?.brandIcons)
  }
  else{
    setIcons(dummy)
  }

  
}, [settings])







  return (
    <div className="w-full mt-20">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">
          Our brands
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
          Higher Demand
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Top picks from the most wanted labels.
        </p>
      </div>

      <div className="w-full flex items-center justify-center mt-10 gap-6 px-5  ">
        {icons.map((item, i) => (
          <div
            key={i}
            className="flex h-28 items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              className="h-16 w-16 object-contain"
              src={item.imageURL}
              alt={`Brand icon ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlatformIconsPremium;
