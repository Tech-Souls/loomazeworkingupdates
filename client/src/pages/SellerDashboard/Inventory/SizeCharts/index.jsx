import React, { useEffect, useState } from "react";
import { useSellerAuthContext } from "../../../../contexts/SellerAuthContext";
import { RxTrash } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import dayjs from "dayjs";
import axios from "axios";
import ViewChartModal from "../../../../components/ViewChartModal";

export default function SizeCharts() {
    const { user } = useSellerAuthContext()
    const [sizeCharts, setSizeCharts] = useState([])
    const [chartName, setChartName] = useState("");
    const [columns, setColumns] = useState(["Size", "Chest", "Waist", "Length"]);
    const [rows, setRows] = useState([
        { Size: "Small", Chest: "", Waist: "", Length: "" },
        { Size: "Medium", Chest: "", Waist: "", Length: "" },
        { Size: "Large", Chest: "", Waist: "", Length: "" }
    ]);
    const [editingId, setEditingId] = useState(null);
    const [selectedChart, setSelectedChart] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchSizeCharts()
    }, [])

    const fetchSizeCharts = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/size-charts/all?sellerID=${user._id}`)
            .then(res => {
                if (res.status === 200) {
                    setSizeCharts(res.data.sizeCharts)
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Error fetching size chart", "error");
            })
            .finally(() => setLoading(false))
    }

    const handleAddColumn = () => {
        const newColumn = prompt("Enter column name:");
        if (newColumn && !columns.includes(newColumn)) {
            setColumns([...columns, newColumn]);
            setRows(rows.map(row => ({ ...row, [newColumn]: "" })));
        }
    };

    const handleRemoveColumn = (col) => {
        if (col === "Size") return alert("You cannot remove the 'Size' column!");
        setColumns(columns.filter(c => c !== col));
        setRows(rows.map(row => {
            const { [col]: _, ...rest } = row;
            return rest;
        }));
    };

    const handleAddRow = () => {
        const newSize = prompt("Enter size (e.g., XL):") || "";
        const newRow = {};
        columns.forEach(c => {
            newRow[c] = c === "Size" ? newSize : "";
        });
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleChange = (rowIndex, col, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex][col] = value;
        setRows(updatedRows);
    };

    const resetForm = () => {
        setEditingId(null);
        setChartName("");
        setColumns(["Size", "Chest", "Waist", "Length"]);
        setRows([
            { Size: "S", Chest: "", Waist: "", Length: "" },
            { Size: "M", Chest: "", Waist: "", Length: "" }
        ]);
    };

    const handleSave = () => {
        if (!chartName.trim()) {
            return alert("Please enter a name for this size chart!");
        }

        const payload = {
            sellerID: user._id,
            name: chartName,
            rows,
            columns
        };

        setLoading(true);

        if (editingId) {
            axios.put(`${import.meta.env.VITE_HOST}/seller/size-charts/update/${editingId}`, payload)
                .then(res => {
                    window.toastify(res.data.message, "success");
                    setSizeCharts(prev =>
                        prev.map(c => (c._id === editingId ? res.data.sizeChart : c))
                    );
                    resetForm();
                })
                .catch(err => {
                    window.toastify(err.response?.data?.message || "Error updating size chart", "error");
                })
                .finally(() => setLoading(false));
        } else {
            axios.post(`${import.meta.env.VITE_HOST}/seller/size-charts/create`, payload)
                .then(res => {
                    window.toastify(res.data.message, "success");
                    setSizeCharts(prev => [res.data.sizeChart, ...prev]);
                    resetForm();
                })
                .catch(err => {
                    window.toastify(err.response?.data?.message || "Error creating size chart", "error");
                })
                .finally(() => setLoading(false));
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this chart?")) return;

        setLoading(true)
        axios.delete(`${import.meta.env.VITE_HOST}/seller/size-charts/delete/${id}`)
            .then(res => {
                window.toastify(res.data.message, "success");
                setSizeCharts(prev => prev.filter(chart => chart._id !== id))
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Error deleting chart", "error");
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Size Charts</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create and use size charts for your products.</p>
            </div>

            <div className='seller-container'>
                <div className="flex justify-between items-center">
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Inventory / Size Charts</p>
                    <div className="flex items-center gap-2">
                        <button className="text-xs font-bold text-gray-700 bg-gray-100 px-4 py-1.5 rounded-[8px] transition-all duration-200 ease-linear hover:bg-gray-200">Cancel</button>
                        <button
                            className="bg-[var(--primary)] text-white px-4 py-1.5 font-bold text-xs rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70"
                            onClick={handleSave}
                        >
                            Save Chart
                        </button>
                    </div>
                </div>

                {/* Chart Name */}
                <div className="mb-6 mt-8">
                    <label className="text-sm font-bold text-gray-900 mb-1">
                        Size Chart Name
                    </label>
                    <input
                        type="text"
                        value={chartName}
                        onChange={(e) => setChartName(e.target.value)}
                        placeholder="e.g. Men's T-Shirts"
                        className="block w-full max-w-[400px] border border-gray-300 !rounded-none !p-3 text-sm mt-3"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-900">Size Chart Builder</p>
                    <div className="flex gap-2">
                        <button
                            className="text-green-500 bg-green-100 px-4 py-1.5 text-xs font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-green-200"
                            onClick={handleAddRow}
                        >
                            + Row
                        </button>
                        <button
                            className="text-green-500 bg-green-100 px-4 py-1.5 text-xs font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-green-200"
                            onClick={handleAddColumn}
                        >
                            + Column
                        </button>
                    </div>
                </div>

                {/* Chart Create Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="border-b border-gray-200 px-4 py-2.5 relative"
                                    >
                                        {col}
                                        {col !== "Size" && (
                                            <button
                                                onClick={() => handleRemoveColumn(col)}
                                                className="ml-2 text-red-500 text-xs w-5 h-5 rounded-full hover:bg-red-200"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </th>
                                ))}
                                <th className="border-b border-gray-300 px-4 py-2.5 bg-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((col) => (
                                        <td key={col} className="border-b border-gray-300 p-3">
                                            <input
                                                type="text"
                                                value={row[col]}
                                                onChange={(e) => handleChange(rowIndex, col, e.target.value)}
                                                className="w-full text-gray-900 border border-gray-300 !p-3 !rounded-none text-sm"
                                            />
                                        </td>
                                    ))}
                                    <td className="border-b border-gray-300 p-3 text-center">
                                        <button
                                            onClick={() => handleRemoveRow(rowIndex)}
                                            className="text-red-500 text-xs w-5 h-5 rounded-full hover:bg-red-200"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Charts List */}
                <div className="my-10">
                    <p className="text-sm font-bold text-gray-900 mb-3">Your Size Charts</p>
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : sizeCharts.length === 0 ? (
                        <p className="text-gray-500 text-sm">No size charts created yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase">
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Created At</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizeCharts.map(chart => (
                                    <tr key={chart._id} className="text-xs text-gray-900 border-b border-gray-200">
                                        <td className="p-4">{chart.name}</td>
                                        <td className="p-4">
                                            {dayjs(chart.createdAt).format("DD-MM-YYYY HH:mm")}
                                        </td>
                                        <td className="flex justify-end items-center gap-2 p-4 text-right">
                                            <BsFillEyeFill className="text-green-500 text-sm mr-1 cursor-pointer hover:text-green-300" onClick={() => setSelectedChart(chart)} />
                                            <MdOutlineEdit className="text-blue-500 text-[16px] cursor-pointer hover:text-blue-300" onClick={() => {
                                                setEditingId(chart._id);
                                                setChartName(chart.name);
                                                setColumns(chart.columns);
                                                setRows(chart.rows);
                                            }} />
                                            <RxTrash className="text-red-500 text-[16px] cursor-pointer hover:text-red-300" onClick={() => handleDelete(chart._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {selectedChart && (
                    <ViewChartModal
                        chart={selectedChart}
                        onClose={() => setSelectedChart(null)}
                    />
                )}
            </div>
        </>
    );
}