import React, { useEffect, useState } from "react";

export default function ViewChartModal({ chart, onClose }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (chart) {
            setShow(true);
        }
    }, [chart]);

    if (!chart) return null;

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center px-2.5 sm:px-5 z-50">
            {/* Background Overlay */}
            <div
                className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Modal Box */}
            <div
                className={`bg-white w-full max-w-3xl rounded-2xl shadow-lg p-4 sm:p-6 relative transform transition-all duration-500 ease-[cubic(0.7,1,0.3,0)] ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-100"
                    }`}
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 sm:top-5 right-4 sm:right-6 text-gray-500 hover:text-red-500"
                    onClick={handleClose}
                >
                    ✕
                </button>

                {/* Chart Name */}
                <h2 className="font-bold text-gray-900 mb-4">{chart.name}</h2>

                {/* Chart Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                {chart.columns.map((col) => (
                                    <th
                                        key={col}
                                        className="border-b border-gray-200 px-4 py-2 text-left font-semibold text-gray-700"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chart.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {chart.columns.map((col) => (
                                        <td
                                            key={col}
                                            className="border-b border-gray-200 px-4 py-3 text-gray-700"
                                        >
                                            {row[col] || "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}