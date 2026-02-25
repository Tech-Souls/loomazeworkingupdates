import React, { useEffect, useState } from "react";
import { FaTags, FaShoppingBag, FaCheck, FaCoins } from "react-icons/fa";
import Loader from "../../../components/Loader";
import axios from 'axios'

export default function BrandCoupons({ settings }) {
    const [coupons, setCoupons] = useState([]);
    const [copiedCode, setCopiedCode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!settings?.sellerID) return;

        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_HOST}/platform/coupons/all/${settings.sellerID}`);
                if (res.status === 200) {
                    setCoupons(res.data.coupons);
                }
            } catch (err) {
                console.error("Fetch coupons error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, [settings?.sellerID]);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) return <Loader />

    if (coupons.length === 0)
        return (
            <div className="flex justify-center items-center py-20">
                <p>No coupons available right now.</p>
            </div>
        );

    return (
        <section className="main-container py-12 px-10 mt-10">
            <h2 className=" head text-2xl text-[var(--text)] mb-6 flex items-center gap-2 font-bold">
                <FaTags className="text-[var(--primary)]" />
                Available Coupons
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {coupons.map((coupon) => (
                    <div
                        key={coupon._id}
                        className="relative bg-[#f3f3f3] rounded-[12px] border border-dashed border-gray-300 hover:border-[var(--secondary)]/70 p-4 sm:p-6 shadow hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FaTags className="text-[var(--primary)] text-lg" />
                            <h3 className="head text-[var(--text)] tracking-wide font-extrabold">
                                {coupon.code}
                            </h3>
                        </div>
                        <p className="text-[var(--text)] mb-3 flex items-center gap-2">
                            <FaCoins className="text-[var(--pr)] text-sm" />
                            <span className="font-semibold text-sm">
                                {coupon.type === "percentage"
                                    ? `${coupon.value}% OFF`
                                    : `${settings?.content?.currency} ${coupon.value} OFF`}
                            </span>
                        </p>
                        <p className="text-gray-500 text-sm mb-7 flex items-center gap-2">
                            <FaShoppingBag className="text-[var(--primary)] text-sm" />
                            Min Order:{" "}
                            <strong>
                                {settings?.content?.currency} {" "}
                                {coupon.minOrderValue}
                            </strong>
                        </p>
                        <button
                            onClick={() => handleCopy(coupon.code)}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${copiedCode === coupon.code
                                ? "bg-[var(--pr)] text-white"
                                : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80 transition-all duration-200 ease-in-out"
                                }`}
                        >
                            {copiedCode === coupon.code ? (
                                <>
                                    <FaCheck /> Copied!
                                </>
                            ) : (
                                <>
                                    <FaTags /> Copy Code
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}