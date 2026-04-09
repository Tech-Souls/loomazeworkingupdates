import { useEffect, useState } from "react";


const SpotlightProductCounter = ({ saleEndDate }) => {
  const [time, setTime] = useState({ totalHours: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!saleEndDate) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = saleEndDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTime({ totalHours: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalHours = days * 24;
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ totalHours, h: hours, m: minutes, s: seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndDate]);

  return (
    <div className="w-full font-[Inter] text-lg font-semibold flex items-center justify-between mt-5">
      <div className="w-15 h-15 bg-gray-300 p-5 flex items-center justify-center rounded-md">{time.totalHours}</div>
      <span>:</span>
      <div className="w-15 h-15 bg-gray-300 p-5 flex items-center justify-center rounded-md">{time.h}</div>
      <span>:</span>
      <div className="w-15 h-15 bg-gray-300 p-5 flex items-center justify-center rounded-md">{String(time.m).padStart(2, "0")}</div>
      <span>:</span>
      <div className="w-15 h-15 bg-gray-300 p-5 flex items-center justify-center rounded-md">{String(time.s).padStart(2, "0")}</div>
    </div>
  );
};

export default SpotlightProductCounter;