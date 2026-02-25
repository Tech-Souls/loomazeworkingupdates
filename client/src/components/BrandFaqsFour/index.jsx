import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaHeadset } from "react-icons/fa";
import axios from "axios";

export default function BrandFaqsFour({ settings }) {
    const [faqs, setFaqs] = useState([])
    const [loading, setLoading] = useState(true)

    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        if (settings) {
            fetchFaqs()
        }
    }, [settings])

    const fetchFaqs = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-faqs?sellerID=${settings?.sellerID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setFaqs(data?.faqs)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <section className="relative w-full main-container py-16 px-4 sm:px-10 !my-20">
            <div className="absolute inset-0 pointer-events-none" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text)] leading-tight">
                        Got questions? <br />
                        <span className="text-[var(--pr)]">We've got answers.</span>
                    </h2>

                    <p className="text-[var(--text)]/70 text-sm sm:text-base leading-relaxed max-w-md">
                        Find clear, concise answers to the most common questions about
                        loomaze. Still need help? Reach out to our team anytime.
                    </p>

                    <button className="flex items-center gap-2 bg-[var(--pr)] text-white px-6 py-3 text-sm font-semibold hover:bg-[var(--pr)]/10 hover:text-gray-800 hover:border border-gray-700 hover:gap-3 transition-all duration-300">
                        <FaHeadset className="text-lg" /> Contact Support
                    </button>
                </div>
                <div className="space-y-4">
                    {loading ?
                        <p>Loading...</p>
                        : faqs.length > 0 ?
                            faqs.map((faq, index) => (
                                <div
                                    key={faq._id}
                                    className={`border border-gray-200 transition-all duration-300 ${openIndex === index ? " border-[var(--pr)]/40" : "bg-[#fafafa]"}`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex justify-between items-center text-left px-5 py-4 sm:px-6 sm:py-5 font-semibold text-[var(--text)] transition-all"
                                    >
                                        <span>{faq.question}</span>
                                        <FiChevronDown className={`text-xl transform transition-transform duration-300 ${openIndex === index ? "rotate-180 text-[var(--pr)]" : "rotate-0"}`} />
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                        <div className="overflow-hidden">
                                            <p className="px-6 pb-5 text-[var(--text)]/80 text-sm sm:text-base leading-relaxed border-t border-gray-100">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <p className='text-center text-red-500'>No FAQs found.</p>
                    }
                </div>
            </div>
        </section>
    );
}