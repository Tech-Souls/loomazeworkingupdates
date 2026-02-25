import React, { useRef } from 'react';
import { IoImageOutline, IoClose } from "react-icons/io5";

const ColorImageInput = ({ color, onUpdate, onRemove }) => {
    const imageInputRef = useRef();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        const validFiles = files.filter(file => allowedTypes.includes(file.type));

        if (validFiles.length === 0) {
            return alert("Only PNG, JPG or WEBP files are allowed!");
        }

        // Create preview URLs for new images
        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        onUpdate({
            ...color,
            images: [...color.images, ...newImages]
        });
    };

    const removeImage = (index) => {
        const img = color.images[index];
        if (img.preview) URL.revokeObjectURL(img.preview);
        onUpdate({ ...color, images: color.images.filter((_, i) => i !== index) });
    };

    const handleNameChange = (newName) => {
        onUpdate({
            ...color,
            name: newName
        });
    };

    return (
        <div className="border border-gray-300 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Color name (e.g., Red, Blue, Black)"
                    className="flex-1 text-sm !p-2 border border-gray-300 !rounded-none"
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-2 text-red-500 hover:text-red-700"
                >
                    <IoClose size={20} />
                </button>
            </div>

            {/* Color Images */}
            <div className="mb-3">
                <label className="text-xs text-gray-600 font-bold mb-2 block">
                    Color Images ({color.images.length} selected)
                </label>

                {/* Image upload area */}
                <div
                    className="group relative w-full h-24 border-2 border-dashed border-gray-300 cursor-pointer transition-all duration-200 hover:border-[var(--secondary)]"
                    onClick={() => imageInputRef.current.click()}
                >
                    <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <div className="flex flex-col justify-center items-center h-full text-gray-500 group-hover:text-[var(--secondary)]">
                        <IoImageOutline className="text-2xl mb-1" />
                        <p className="text-xs font-bold">Add Images for {color.name || 'this color'}</p>
                        <p className="text-[10px]">Multiple images allowed</p>
                    </div>
                </div>

                {/* Image previews */}
                {color.images.length > 0 && (
                    <div className="mt-3">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {color.images.map((img, imgIndex) => {
                                const src = typeof img === "string" ? `${import.meta.env.VITE_HOST}${img}` : (img.preview || img.url);
                                return (
                                    <div key={imgIndex} className="relative group">
                                        <img
                                            src={src}
                                            alt={`${color.name} ${imgIndex + 1}`}
                                            className="w-full h-20 object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(imgIndex)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorImageInput;