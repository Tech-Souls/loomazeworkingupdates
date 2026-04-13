import { Typography } from "antd";
import { Link } from "react-router-dom";

import fashImg from "@/assets/images/fashion.webp";
import furnImg from "@/assets/images/furniture.webp";
import elecImg from "@/assets/images/electronics.webp";
import sportsImg from "@/assets/images/sports.webp";
import liquorImg from "@/assets/images/liqour.webp";
import digImg from "@/assets/images/digital-products.webp";
import pharmImg from "@/assets/images/pharmacy.webp";
import auctImg from "@/assets/images/auction-marketplace.webp";
import groceImg from "@/assets/images/grocery-marketplace.webp";

const { Title, Paragraph } = Typography;

const services = [
  { img: fashImg, title: "Fashion", desc: "Launch a modern fashion marketplace showcasing trends, collections and smooth shopping experiences." },
  { img: furnImg, title: "Furniture", desc: "Build a digital furniture showroom with inventory, vendors and seamless browsing." },
  { img: elecImg, title: "Electronics", desc: "Create a high-performance electronics marketplace with powerful product and order management." },
  { img: sportsImg, title: "Sports", desc: "Sell sports equipment through a responsive, vendor-driven marketplace platform." },
  { img: liquorImg, title: "Liquor", desc: "Launch a compliant age-verified liquor marketplace with smooth checkout and catalog flow." },
  { img: digImg, title: "Digital Products", desc: "Sell digital assets with secure payments and instant downloads." },
  { img: pharmImg, title: "Pharmacy", desc: "Build a scalable pharmacy marketplace for prescriptions and healthcare products." },
  { img: auctImg, title: "Auction Marketplace", desc: "Enable real-time bidding and auction-based selling on a powerful platform." },
  { img: groceImg, title: "Grocery Marketplace", desc: "Run a fast-delivery grocery marketplace with deals, vendors and inventory tracking." },
];

export default function HomePageService() {
  return (
    <section className="py-15 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14" data-aos="fade-up">
          <Title level={2}>
            <span className="text-primary">loomaze</span> fits a wide range of eCommerce niches
          </Title>
          <Paragraph className="max-w-3xl! mx-auto! text-gray-600!">
            Industry-specific multi-vendor solutions designed to help you grow faster and compete smarter.
          </Paragraph>
        </div>

        <div className="flex flex-wrap justify-between">
          {services.map((item, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={3 * 80} className="group relative w-full sm:w-[48%] md:w-[32%] mb-8 overflow-hidden rounded-lg">
              <img src={item.img} alt={item.title} className="w-full h-[297px] object-cover transition-transform duration-300 group-hover:scale-105" />

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Title level={4} className="text-white! mb-0!">
                  {item.title}
                </Title>
              </div>

              <div className="absolute inset-0 bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all p-6">
                <Paragraph className="text-center! text-lg! text-gray-700!">
                  {item.desc}
                </Paragraph>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
