import React, { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import axios from 'axios'

export default function BrandFaqsFive({ settings }) {
    const demoFaqs = [
  {
    _id: "faq1",
    question: "What products do you sell?",
    answer:
      "We offer a wide range of quality products across multiple categories including electronics, fashion, home essentials, and more. New products are added regularly."
  },
  {
    _id: "faq2",
    question: "How can I place an order?",
    answer:
      "Simply browse the products, add your desired items to the cart, and proceed to checkout. Follow the on-screen steps to complete your purchase securely."
  },
  {
    _id: "faq3",
    question: "What payment methods do you accept?",
    answer:
      "We accept multiple payment options including credit/debit cards, bank transfer, and cash on delivery (where available)."
  },
  {
    _id: "faq4",
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3–7 business days depending on your location. You will receive tracking details once your order is shipped."
  },
  {
    _id: "faq5",
    question: "Can I track my order?",
    answer:
      "Yes. After your order is shipped, you can track it from your account dashboard using the tracking number provided."
  },
  {
    _id: "faq6",
    question: "What is your return policy?",
    answer:
      "If you receive a damaged or incorrect product, you can request a return or replacement within 7 days of delivery, subject to our return policy."
  },
  {
    _id: "faq7",
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled or modified before they are shipped. Once shipped, cancellation may not be possible."
  },
  {
    _id: "faq8",
    question: "Is my personal and payment information secure?",
    answer:
      "Yes. We use industry-standard security measures and encryption to protect your personal and payment information."
  }
];

    const [faqs, setFaqs] = useState(demoFaqs)
    const [loading, setLoading] = useState(true)

    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
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
                if (status === 200 && data?.faqs.length > 0) {
                    setFaqs(data?.faqs)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <div className='w-full mx-auto max-w-5xl py-10 sm:py-16 px-3 sm:px-8 !my-10'>
            <div className='flex flex-col justify-center items-center space-y-4 mb-4'>
                <h1 className='head text-2xl font-extrabold text-[var(--text)] text-center'>Frequently asked questions</h1>
                <button className='justify-center  text-[#fff] bg-[var(--pr)] hover:bg-[var(--pr)]/70 border-gray-600 transform transition-all ease-linear duration-300 px-4 py-2 rounded-lg mb-6'>Contact Support</button>
            </div>
            <div className='space-y-6'>
                {loading ? (
                    <p className='text-center text-gray-500'>Loading FAQs...</p>
                ) : faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                        <div key={faq._id} className='bg-[#f3f3f3] border border-gray-200 rounded-[12px]' >
                            <button className='w-full flex justify-between items-center p-3 sm:p-6 text-left font-medium' onClick={() => toggleFAQ(index)}>
                                <span>{faq.question}</span>
                                <FiChevronDown className={`text-xl transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} />
                            </button>
                            <div className={`px-4 overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96 pb-4" : "max-h-0"}`}>
                                <p className="text-[var(--text)]/80 whitespace-pre-line">{faq.answer}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-red-500'>No FAQs found.</p>
                )}
            </div>
        </div>
    )
}