import { useEffect, useState } from "react";

function ToolsBrandsIcon({ settings }) {
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
    <section className="w-full min-h-[70vh] mt-10 ">
        <div className="w-full flex items-center justify-center flex-col gap-5">
            <h1 className="text-2xl font-bold text-[#e53935]">Brands</h1>
            <h1 className="text-5xl tracking-tighter font-bold text-slate-900">World’s Leading Makes</h1>
            <p className="text-lg font-bold text-gray-800 tracking-tight">Discover tools and equipment from the world’s top manufacturers.

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
    </section>
  );
}

export default ToolsBrandsIcon;