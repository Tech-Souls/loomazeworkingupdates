import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const SaleCountdown = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const target = dayjs(endTime);

        const timer = setInterval(() => {
            const now = dayjs();
            const diff = target.diff(now);

            if (diff <= 0) {
                clearInterval(timer);
                setTimeLeft({
                    days: "00",
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                });
                return;
            }

            const durationObj = dayjs.duration(diff);

            setTimeLeft({
                days: durationObj.days().toString().padStart(2, "0"),
                hours: durationObj.hours().toString().padStart(2, "0"),
                minutes: durationObj.minutes().toString().padStart(2, "0"),
                seconds: durationObj.seconds().toString().padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <>
            <div className="text-center">
                <h3 className="text-lg">{timeLeft.days}</h3>
                <p className="text-[3vw] sm:text-xs">Days</p>
            </div>

            <p>:</p>

            <div className="text-center">
                <h3 className="text-lg">{timeLeft.hours}</h3>
                <p className="text-[3vw] sm:text-xs">Hours</p>
            </div>

            <p>:</p>

            <div className="text-center">
                <h3 className="text-lg">{timeLeft.minutes}</h3>
                <p className="text-[3vw] sm:text-xs">Minutes</p>
            </div>

            <p>:</p>

            <div className="text-center">
                <h3 className="text-lg">{timeLeft.seconds}</h3>
                <p className="text-[3vw] sm:text-xs">Seconds</p>
            </div>
        </>
    );
};

export default SaleCountdown;