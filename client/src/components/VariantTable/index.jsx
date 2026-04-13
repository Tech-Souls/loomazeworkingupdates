import React, { useState, useEffect, useMemo } from "react";
import { BiChevronDown, BiChevronUp, BiImageAdd } from "react-icons/bi";

export default function VariantTable({ options, variants, setVariants }) {
    // Ensure groupBy defaults to the first valid option name
    const [groupBy, setGroupBy] = useState(() => {
        const firstOption = options[0];
        return firstOption?.name?.trim() || "";
    });

    const [expandedGroups, setExpandedGroups] = useState({});

    // Reset expanded groups and update groupBy when options change
    useEffect(() => {
        setExpandedGroups({});
        // Update groupBy to first valid option if current groupBy is invalid
        const validOptions = options.filter(opt => opt.name?.trim());
        if (validOptions.length > 0 && !validOptions.some(opt => opt.name === groupBy)) {
            setGroupBy(validOptions[0].name);
        }
    }, [options]);

    // Calculate grouped variants using useMemo for performance
    const { grouped, groupIndex } = useMemo(() => {
        if (!options.length || !variants.length) {
            return { grouped: {}, groupIndex: -1 };
        }

        // Find the group index, ensure we have a valid index
        const validOptions = options.filter(opt => opt.name?.trim());
        const selectedOption = validOptions.find(o => o.name === groupBy);
        const groupIndex = selectedOption ?
            options.findIndex(o => o.name === groupBy) :
            (validOptions[0] ? options.findIndex(o => o.name === validOptions[0].name) : -1);

        if (groupIndex === -1) {
            return { grouped: {}, groupIndex: -1 };
        }

        const grouped = variants.reduce((acc, variant) => {
            const key = variant.optionValues[groupIndex] || "Unknown";
            if (!acc[key]) acc[key] = [];
            acc[key].push(variant);
            return acc;
        }, {});

        return { grouped, groupIndex };
    }, [options, variants, groupBy]);

    // Toggle group expansion
    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    // Handle parent price change
    const handleParentPriceChange = (groupKey, value) => {
        const price = parseFloat(value) || 0;

        setVariants(prev => prev.map(variant => {
            if (variant.optionValues[groupIndex] === groupKey) {
                return {
                    ...variant,
                    price: price,
                };
            }
            return variant;
        }));
    };

    // Handle child variant price change
    const handleChildPriceChange = (variantId, value) => {
        const price = parseFloat(value) || 0;
        setVariants(prev => prev.map(variant =>
            variant.id === variantId ? { ...variant, price: price } : variant
        ));
    };

    // Handle child variant stock change
    const handleChildStockChange = (variantId, value) => {
        const stock = parseInt(value) || 0;
        setVariants(prev => prev.map(variant =>
            variant.id === variantId ? { ...variant, stock } : variant
        ));
    };

    // Handle image upload for variant
    const handleImageUpload = (variantId, event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            window.toastify("Please upload an image file", "error");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            window.toastify("Image size should be less than 5MB", "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setVariants(prev => prev.map(variant =>
                variant.id === variantId ? {
                    ...variant,
                    imageFile: file,
                    imagePreview: reader.result
                } : variant
            ));
        };
        reader.readAsDataURL(file);
    };

    // Remove image from variant
    const handleRemoveImage = (variantId) => {
        setVariants(prev => prev.map(variant =>
            variant.id === variantId ? {
                ...variant,
                imageFile: null,
                imagePreview: "",
                imageURL: ""
            } : variant
        ));
    };

    // Handle parent image upload for all variants in group
    const handleParentImageUpload = (groupKey, event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            window.toastify("Please upload an image file", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            window.toastify("Image size should be less than 5MB", "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setVariants(prev => prev.map(variant => {
                if (groupIndex === -1) return variant;

                // Check if this variant belongs to the current group
                if (options.length === 1) {
                    // For single option, apply to all variants
                    return {
                        ...variant,
                        imageFile: file,
                        imagePreview: reader.result,
                        imageURL: ""
                    };
                } else if (variant.optionValues[groupIndex] === groupKey) {
                    // For multiple options, apply to group variants
                    return {
                        ...variant,
                        imageFile: file,
                        imagePreview: reader.result,
                        imageURL: ""
                    };
                }
                return variant;
            }));
        };
        reader.readAsDataURL(file);
    };

    // Calculate parent price display
    const getParentPriceDisplay = (groupKey) => {
        const groupVariants = grouped[groupKey] || [];
        if (groupVariants.length === 0) return "0";

        const prices = [...new Set(groupVariants.map(v => v.price || 0))];
        if (prices.length === 1) {
            return prices[0].toString();
        } else {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return `${minPrice}-${maxPrice}`;
        }
    };

    // Calculate total stock for group
    const getTotalStockForGroup = (groupKey) => {
        const groupVariants = grouped[groupKey] || [];
        return groupVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    };

    // Check if all variants in group have the same image
    const getGroupImageStatus = (groupKey) => {
        const groupVariants = grouped[groupKey] || [];
        if (groupVariants.length === 0) return { hasImage: false, isSame: false };

        const firstImage = groupVariants[0]?.imagePreview;
        const hasImage = !!firstImage;
        const isSame = groupVariants.every(v => v.imagePreview === firstImage);

        return { hasImage, isSame };
    };

    // Return empty if no variants
    if (!options.length || !variants.length) {
        return <></>;
    }

    // If only one option, show all variants directly
    if (options.length === 1) {
        return (
            <div className="mt-6">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-body">
                        <thead className="bg-gray-100 border-b border-neutral-200 text-xs text-neutral-500 font-semibold">
                            <tr>
                                <th className="px-6 py-2.5">Variant</th>
                                <th className="px-4 py-2.5">Image</th>
                                <th className="px-4 py-2.5">Price</th>
                                <th className="px-4 py-2.5">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map(variant => (
                                <tr key={variant.id} className="border-b border-neutral-200 hover:bg-neutral-100/70">
                                    <td className="px-6 py-3 font-medium text-neutral-800">
                                        {variant.optionValues[0] || "Unknown"}
                                    </td>
                                    <td className="px-4 py-3 w-48">
                                        <div className="flex items-center gap-3">
                                            {variant.imagePreview ? (
                                                <div className="relative group">
                                                    <img
                                                        src={variant.imagePreview}
                                                        alt={variant.optionValues[0] || "Variant"}
                                                        className="w-16 h-16 object-cover rounded border border-gray-300"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveImage(variant.id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(variant.id, e)}
                                                    />
                                                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                                                        <BiImageAdd size={20} />
                                                        <span className="text-xs mt-1">Add</span>
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 w-40">
                                        <input
                                            type="number"
                                            value={variant.price || ""}
                                            min="0"
                                            placeholder="0"
                                            className="w-full bg-white border border-gray-300 px-3! py-2! rounded-lg!"
                                            onChange={(e) => handleChildPriceChange(variant.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 w-40">
                                        <input
                                            type="number"
                                            value={variant.stock || ""}
                                            min="0"
                                            placeholder="0"
                                            className="w-full bg-white border border-gray-300 px-3! py-2! rounded-lg!"
                                            onChange={(e) => handleChildStockChange(variant.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Multiple options - show with grouping
    // If groupIndex is -1 or no valid grouping, show fallback
    if (groupIndex === -1 || Object.keys(grouped).length === 0) {
        return (
            <div className="mt-6">
                <div className="text-center py-4 text-gray-500">
                    No valid options for grouping. Please check your option names.
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            {/* Group By Dropdown */}
            <div className="flex items-center gap-4 mb-4">
                <label className="text-xs text-neutral-600 font-semibold">Group by</label>
                <select
                    value={groupBy}
                    className="w-28 px-2 py-1 text-sm border border-gray-300 outline-none rounded"
                    onChange={(e) => setGroupBy(e.target.value)}
                >
                    {options.filter(opt => opt.name?.trim()).map((opt, i) => (
                        <option key={i} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            </div>

            {/* Variant Table */}
            <div className="relative overflow-x-auto border border-gray-200">
                <table className="w-full text-sm text-left text-body">
                    <thead className="bg-gray-100 border-b border-neutral-200 text-xs text-neutral-500 font-semibold">
                        <tr>
                            <th className="px-6 py-2.5">Variant</th>
                            <th className="px-6 py-2.5">Image</th>
                            <th className="px-6 py-2.5">Price</th>
                            <th className="px-6 py-2.5">Stock</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.keys(grouped).map((groupKey, i) => {
                            const isExpanded = expandedGroups[groupKey];
                            const groupVariants = grouped[groupKey];
                            const parentPriceDisplay = getParentPriceDisplay(groupKey);
                            const totalStock = getTotalStockForGroup(groupKey);
                            const { hasImage: groupHasImage, isSame: groupImagesSame } = getGroupImageStatus(groupKey);

                            return (
                                <React.Fragment key={i}>
                                    {/* Parent Group Row */}
                                    <tr className="border-b border-neutral-200 hover:bg-neutral-100/70">
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => toggleGroup(groupKey)}
                                                className="flex items-center gap-2 font-semibold text-neutral-800 hover:text-neutral-900"
                                            >
                                                {isExpanded ? <BiChevronUp size={18} /> : <BiChevronDown size={18} />}
                                                {groupKey}
                                                <span className="text-xs font-normal text-neutral-500 ml-2">
                                                    ({groupVariants.length} variants)
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 w-48">
                                            <div className="flex items-center gap-3">
                                                {groupHasImage && groupImagesSame ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={groupVariants[0]?.imagePreview}
                                                            alt={groupKey}
                                                            className="w-16 h-16 object-cover rounded border border-gray-300"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                // Remove image from all variants in group
                                                                setVariants(prev => prev.map(variant => {
                                                                    if (variant.optionValues[groupIndex] === groupKey) {
                                                                        return {
                                                                            ...variant,
                                                                            imageFile: null,
                                                                            imagePreview: "",
                                                                            imageURL: ""
                                                                        };
                                                                    }
                                                                    return variant;
                                                                }));
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : groupHasImage ? (
                                                    <div className="relative group">
                                                        <div className="w-16 h-16 rounded border border-gray-300 flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                                                            Multiple
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleParentImageUpload(groupKey, e)}
                                                        />
                                                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                                                            <BiImageAdd size={20} />
                                                            <span className="text-xs mt-1">Add All</span>
                                                        </div>
                                                    </label>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 w-40">
                                            <input
                                                type="text"
                                                value={parentPriceDisplay}
                                                className="w-full bg-white border border-gray-300 px-3! py-2! rounded-lg! font-medium"
                                                min={0}
                                                placeholder="Set price for all"
                                                onChange={(e) => handleParentPriceChange(groupKey, e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 w-40">
                                            <input
                                                type="text"
                                                value={totalStock}
                                                readOnly
                                                disabled
                                                className="w-full border border-gray-300 px-3! py-2! rounded-lg! font-medium bg-gray-100 cursor-not-allowed"
                                            />
                                        </td>
                                    </tr>

                                    {/* Child Variant Rows - Only show if expanded */}
                                    {isExpanded && groupVariants.map(variant => {
                                        const childName = variant.optionValues
                                            .filter((_, ix) => ix !== groupIndex)
                                            .join(", ");

                                        return (
                                            <tr key={variant.id} className="border-b border-neutral-200 hover:bg-neutral-100/70">
                                                <td className="px-12 py-3 text-neutral-600">
                                                    <span className="flex items-center">
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                                                        {childName || "Unknown"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 w-48">
                                                    <div className="flex items-center gap-3">
                                                        {variant.imagePreview ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={variant.imagePreview}
                                                                    alt={childName}
                                                                    className="w-16 h-16 object-cover rounded border border-gray-300"
                                                                />
                                                                <button
                                                                    onClick={() => handleRemoveImage(variant.id)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className="cursor-pointer">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => handleImageUpload(variant.id, e)}
                                                                />
                                                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                                                                    <BiImageAdd size={20} />
                                                                    <span className="text-xs mt-1">Add</span>
                                                                </div>
                                                            </label>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 w-40">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.price || ""}
                                                        className="w-full bg-white border border-gray-300 px-3! py-2! rounded-lg!"
                                                        onChange={(e) => handleChildPriceChange(variant.id, e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 w-40">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.stock || ""}
                                                        className="w-full bg-white border border-gray-300 px-3! py-2! rounded-lg!"
                                                        onChange={(e) => handleChildStockChange(variant.id, e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}