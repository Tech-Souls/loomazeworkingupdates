import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { User } from "lucide-react";

function PlatformStripperPremium(settings) {
  // const items = [
  //   {
  //     text: "ali haider",
  //     imageURL:
  //       "https://images.pexels.com/photos/257897/pexels-photo-257897.jpeg",
  //   },
  //   {
  //     text: "ali haider",
  //     imageUR
  //       "https://images.pexels.com/photos/257897/pexels-photo-257897.jpeg",
  //   },
  
    
  // ];
  const [items, setItems] = useState(settings?.content?.stripperText || [])

  useEffect(() => {
      axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-stripper-content/${settings?.settings?.sellerID}`)
      .then(res => {        const { status, data } = res;
        if(status === 200) {
          setItems(data?.content || [])
        } })
      .catch(err => console.error('Frontend GET error', err.message))
  }, [settings?.sellerID])

  useEffect(() => {


    if(settings?.content?.stripperText) {
      setItems(settings.content.stripperText)   
    }
  }, [settings?.content?.stripperText])
  
console.log('settings', settings);
console.log('settings.sellerID', settings?.settings?.sellerID);


  return (
  <div className=" h-60 relative overflow-hidden">
  <marquee
    className="w-[105%] absolute whitespace-nowrap z-10 origin-right bg-black text-white -rotate-1 block"
    behavior="scroll"
    scrollamount="10"
    direction="left"
    onMouseOver={(e) => e.currentTarget.stop()}
    onMouseOut={(e) => e.currentTarget.start()}
  >
    {Array(6)
      .fill(items) 
      .flat()
      .map((elem, i) => (
        <span key={i} className="inline-flex items-center gap-2 mr-10">
          <h1 className="m-0">{elem.text}</h1>
          <img
            src={elem.imageURL}
            alt=""
            className="w-20 h-20 object-contain"
          />
        </span>
      ))}
  </marquee>
  <marquee
    className="w-[110%] absolute whitespace-nowrap bg-gray-200 text-gray-500 rotate-6 origin-left block"
    behavior="scroll"
    scrollamount="10"
    direction="right"
    onMouseOver={(e) => e.currentTarget.stop()}
    onMouseOut={(e) => e.currentTarget.start()}
  >
    {Array(6)
      .fill(items) 
      .flat()
      .map((elem, i) => (
        <span key={i} className="inline-flex items-center gap-2 mr-10">
          <h1 className="m-0">{elem.text}</h1>
          <img
            src={elem.imageURL}
            alt=""
            className="w-20 h-20 object-contain"
          />
        </span>
      ))}
  </marquee>
</div>
  );
}

export default PlatformStripperPremium;
