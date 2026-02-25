import React, { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext';
import { Image } from 'antd'
import { BiTrash, BiX } from "react-icons/bi";
import { VscAdd } from "react-icons/vsc";
import axios from 'axios';
import Loader from '../../../../components/Loader';

export default function ImageGallery() {
    const { user } = useSellerAuthContext()
    const [gallery, setGallery] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user._id) return
        fetchGallery()
    }, [user._id])

    const fetchGallery = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/image-gallery/all?sellerID=${user._id}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setGallery(data?.gallery || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return alert("Only PNG, JPG or WEBP files are allowed!");
            }

            setImage(file);
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleAddImage = () => {
        if (!image) return window.toastify("Please select an image to add!", "warning");

        const formData = new FormData();
        formData.append("sellerID", user._id);
        formData.append("image", image);

        setLoading(true);
        axios.post(`${import.meta.env.VITE_HOST}/seller/image-gallery/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                if (res.status === 201) {
                    window.toastify(res.data.message, "success")
                    setGallery(prev => [res.data.image, ...prev]);
                    setShowCreateModal(false);
                    setImage(null);
                    setPreview(null);
                }
            })
            .catch(err => {
                console.error("Frontend POST error", err.message)
                window.toastify(err.response?.data?.message || "Something went wrong! Please try again", "error")
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteImage = (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/image-gallery/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setGallery(prev => prev.filter(img => img._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete category", "error")
            })
            .finally(() => setLoading(false));
    };

    if (loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Image Gallery</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage your image gallery here to display your work.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Inventory / Image Gallery</p>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 bg-white p-3 mt-8 light-shad'>
                    <div className='flex flex-col justify-center items-center gap-3 border-2 border-dotted border-gray-300 hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-out aspect-[4/4]'
                        onClick={() => setShowCreateModal(true)}
                    >
                        <VscAdd className='text-3xl' />
                        <p className='text-sm'>Add new image</p>
                    </div>
                    {gallery.map((img, i) => (
                        <div key={img._id} className='relative aspect-[4/4]'>
                            <Image src={`${img.imageURL}`} alt={`image-${i}`} loading='lazy' style={{ aspectRatio: 4/4, objectFit: 'cover' }} />
                            <div className="absolute top-2 right-2 text-sm text-red-600 bg-white rounded-full p-1 cursor-pointer z-10"
                                onClick={() => handleDeleteImage(img._id)}
                            >
                                <BiTrash />
                            </div>
                        </div>
                    ))}
                </div>
            </div >

            <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showCreateModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                onClick={() => setShowCreateModal(false)}
            >
                <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showCreateModal ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                        <p className='font-bold'>Add New Image</p>
                        <BiX className='text-2xl cursor-pointer' onClick={() => setShowCreateModal(false)} />
                    </div>

                    <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                        <div>
                            <label className='font-bold text-sm'>Image</label>
                            <input type="file" name="image" id="image" className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleImageChange} />
                        </div>

                        {preview && (
                            <div className="mt-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <div className='flex justify-end gap-3 p-6'>
                        <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowCreateModal(false)}>Cancel</button>
                        <button className='px-4 py-1.5 bg-[var(--secondary)] text-white'
                            disabled={loading}
                            onClick={handleAddImage}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}