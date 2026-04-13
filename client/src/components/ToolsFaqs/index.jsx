import React, { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FaHeadset } from "react-icons/fa";
import axios from "axios";

export default function ToolsFaqs({ settings }) {
  const [faqs, setFaqs] = useState([
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@example.com",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused products in their original packaging. Please contact support for assistance.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we offer international shipping to most countries. Shipping costs and delivery times may vary.",
    },
  ]);
  const [loading, setLoading] = useState(true);

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (settings) {
      fetchFaqs();
    }
  }, [settings]);
  const dummyfaqs = [
    {
      question: "What is this platform about?",
      answer:
        "This platform allows users to explore, compare, and purchase products from multiple categories in one place.",
    },
    {
      question: "How can I place an order?",
      answer:
        "Simply browse products, add them to your cart, and proceed to checkout to place your order.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit/debit cards, bank transfers, and selected digital wallets.",
    },
    {
      question: "Can I return or exchange a product?",
      answer:
        "Yes, you can return or exchange products within the specified return period according to our policy.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order is placed, you will receive a tracking link via email or SMS.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes, our support team is available 24/7 to assist you with any queries.",
    },
    {
      question: "Are there any delivery charges?",
      answer:
        "Delivery charges may vary depending on your location and order amount.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Yes, orders can be canceled before they are shipped from our warehouse.",
    },
  ];

  useEffect(() => {
    if (faqs.length === 0) {
      setFaqs(dummyfaqs);
    }
  }, []);

  const fetchFaqs = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-faqs?sellerID=${settings?.sellerID}`,
      )
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          setFaqs(data?.faqs);
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };
  return (
    <section className="relative flex flex-col items-start py-5 justify-start w-full my-10  px-5 ">
      <div className="w-full flex items-center justify-center flex-col font-[roboto-condensed]">
        <h1 className="text-4xl text-center font-[bebas-neue]">
          what our customers ask
        </h1>
        <p className="text-lg">your guide to our products and services</p>
      </div>
      <div className="w-full flex items-start font-[roboto-condensed] justify-start flex-col mt-10">
        {dummyfaqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`w-full border-b border-t border-gray-600  cursor-pointer overflow-hidden transition-all duration-300 
      ${openIndex === index ? "max-h-40" : "lg:max-h-16 max-h-12 "} group`}
          >
            <div className="w-full flex items-center text-gray-800 justify-between py-4">
              <p className="lg:text-3xl text-xl font-semibold transition-colors duration-200 group-hover:text-[#E53935]">
                {faq.question}
              </p>

              {/* Rotating Icon */}
              <span
                className={`text-2xl transform transition-transform duration-300 
          ${openIndex === index ? "rotate-180 text-[#E53935]" : "rotate-0"} 
          group-hover:text-[#E53935]`}
              >
                {openIndex === index ? <Minus /> : <Plus />}
              </span>
            </div>

            <div
              className={`px-1 transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <p className="text-lg text-gray-500 pb-4">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
