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
        <div className='w-full flex flex-col gap-2'>
<p className="text-center capitalize text-lg text-blue-500">our brands</p>
      <h1 className="text-center text-4xl font-weight-[200]">Higher Demand</h1>
      <p className="text-sm text-center">
        Top picks from the most wanted labels.
      </p>
        </div>
        <div className="w-full items-center gap-5 flex-wrap  p-5 justify-center flex">
            {
                icons.map((item, i )=>{
                    return (
                         <img className='w-35 border border-gray-300 hover:border-gray-900 p-5 rounded-lg h-35 object-cover  ' src={item.imageURL} alt="" />
                    )
                })
            }
           
        </div>
      
    </div>
  );
}

export default PlatformIconsPremium;
