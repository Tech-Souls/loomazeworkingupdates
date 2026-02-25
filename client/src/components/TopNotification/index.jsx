import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
    <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white z-10"
        onClick={onClick}
    >
        <ChevronRight className="w-5 h-5" />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white z-10"
        onClick={onClick}
    >
        <ChevronLeft className="w-5 h-5" />
    </button>
);

export default function TopNotification({ notifications = [] }) {
    if (!notifications.length) return null;

    if (notifications.length === 1) {
        return (
            <div className="w-full bg-black text-white text-center px-8 py-2 text-sm font-medium">
                {notifications[0]}
            </div>
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="relative w-full bg-black text-white text-center py-2 text-sm font-medium">
            <Slider {...settings}>
                {notifications.map((note, idx) => (
                    <div key={idx} className="px-8">
                        <span>{note}</span>
                    </div>
                ))}
            </Slider>
        </div>
    );
}