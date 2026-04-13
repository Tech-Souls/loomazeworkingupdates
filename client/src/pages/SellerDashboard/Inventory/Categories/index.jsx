import React, { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { MdOutlineEdit } from 'react-icons/md'
import { RxTrash } from 'react-icons/rx'
import { FiPlusCircle } from 'react-icons/fi'
import { LuSearch } from "react-icons/lu";
import { BiCheck, BiX } from 'react-icons/bi'
import axios from 'axios'

export default function Categories() {
    const { user } = useSellerAuthContext()
    const [categoryName, setCategoryName] = useState("")
    const [categoryImage, setCategoryImage] = useState(null)
    const [categoryImagePreview, setCategoryImagePreview] = useState(null)
    const [subcategoryName, setSubcategoryName] = useState("")

    const [categories, setCategories] = useState([])
    const [searchText, setSearchText] = useState("")
    const [activeSearch, setActiveSearch] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (activeSearch) {
            fetchSearchedCategories(activeSearch)
        } else {
            fetchCategories()
        }
    }, [activeSearch])

    const fetchCategories = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/categories/all?sellerID=${user._id}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setCategories(data?.categories || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const fetchSearchedCategories = (text) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/categories/search?sellerID=${user._id}&searchText=${text}`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data?.searchedCategories || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleSearch = () => {
        if (!searchText) return setActiveSearch("")
        setActiveSearch(searchText)
    }

    const handleCategoryImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return alert("Only PNG, JPG or WEBP files are allowed!");
            }

            setCategoryImage(file);
            setCategoryImagePreview(URL.createObjectURL(file))
        }
    }

    const handleCreateCategory = () => {
        if (!categoryName) return alert("Please enter a category name");

        const formData = new FormData();
        formData.append("sellerID", user._id);
        formData.append("name", categoryName);
        if (categoryImage) formData.append("categoryImage", categoryImage);

        setLoading(true);
        axios.post(`${import.meta.env.VITE_HOST}/seller/categories/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                if (res.status === 201) {
                    window.toastify(res.data.message, "success")
                    setCategories(prev => [res.data.category, ...prev]);
                    setShowCreateModal(false);
                    setCategoryName("");
                    setCategoryImage(null);
                    setCategoryImagePreview(null);
                }
            })
            .catch(err => {
                console.error("Frontend POST error", err.message)
                window.toastify(err.response?.data?.message || "Something went wrong! Please try again", "error")
            })
            .finally(() => setLoading(false));
    };

    const handleUpdateCategory = () => {
        if (!selectedCategory) return;

        const formData = new FormData();
        if (categoryName) formData.append("name", categoryName);
        if (categoryImage) formData.append("categoryImage", categoryImage);
        formData.append("subcategories", JSON.stringify(selectedCategory.subcategories || []));

        setLoading(true);
        axios.put(`${import.meta.env.VITE_HOST}/seller/categories/update/${selectedCategory._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                if (res.status === 202) {
                    window.toastify(res.data.message, "success");
                    setCategories(prev => prev.map(cat => (cat._id === res.data.category._id ? res.data.category : cat)));
                    setShowUpdateModal(false);
                    setCategoryName("");
                    setCategoryImage(null);
                    setCategoryImagePreview(null);
                    setSelectedCategory(null);
                }
            })
            .catch(err => {
                console.error("Frontend PUT error", err.message);
                window.toastify(err.response?.data?.message || "Failed to update category", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleCategoryDisplayToggle = (id) => {
        setLoading(true);
        axios.put(`${import.meta.env.VITE_HOST}/seller/categories/toggle-display/${id}`)
            .then(res => {
                if (res.status === 202) {
                    setTimeout(() => {
                        setCategories(prev => prev.map(cat => (cat._id === res.data.category._id ? res.data.category : cat)));
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Frontend TOGGLE error", err.message);
                window.toastify(err.response?.data?.message || "Failed to update toggle", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleSubcategoryAdd = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (!subcategoryName.trim()) return

            setSelectedCategory(prev => ({ ...prev, subcategories: [...(prev.subcategories || []), subcategoryName.trim().toLowerCase()] }))
            setSubcategoryName("")
        }
    };

    const handleRemoveSubcategory = (subcatToRemove) => {
        setSelectedCategory(prev => ({ ...prev, subcategories: prev.subcategories.filter(sub => sub !== subcatToRemove) }));
    };

    const handleDeleteCategory = (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/categories/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setCategories(prev => prev.filter(cat => cat._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete category", "error")
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Categories</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create and manage product categories for your store.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Categories</p>

                <div className='flex justify-between items-center gap-5 my-5'>
                    <button className='flex items-center gap-2 text-xs bg-[var(--primary)]/5 text-[var(--primary)] px-6 py-2 transition-all duration-150 ease-linear hover:bg-[var(--primary)]/10' onClick={() => setShowCreateModal(true)}>Create new category <FiPlusCircle /></button>

                    <div className='flex flex-1 justify-end items-center gap-2.5'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search by category name' className='w-full max-w-[250px]  border border-gray-200 text-sm bg-white !px-4 !py-2 !rounded-none' onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className='flex items-center gap-1 text-sm text-white bg-[var(--secondary)] px-5 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70' onClick={handleSearch}>Search <LuSearch /></button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">#</th>
                                <th scope="col" className="font-bold px-6 py-4">Name</th>
                                <th scope="col" className="font-bold px-6 py-4">Subcategories</th>
                                <th scope="col" className="font-bold px-6 py-4">Display On Home</th>
                                <th scope="col" className="font-bold px-6 py-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr className='bg-white'>
                                        <td colSpan={5} className='py-20'>
                                            <div className='flex justify-center'>
                                                <div className='flex flex-col items-center gap-5'>
                                                    <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                    <p>Loading...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    categories.length > 0 ?
                                        categories.map((cat, i) => (
                                            <tr key={cat._id} className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{i + 1}</td>
                                                <td scope="row" className="px-6 py-4 text-gray-900 font-bold capitalize">
                                                    <div className='w-fit flex items-center gap-4'>
                                                        <span className='whitespace-nowrap'>{cat.name}</span>
                                                        {cat.imageURL && <img src={`${cat.imageURL}`} alt={cat.name} loading='lazy' className='w-8 h-8 object-contain' />}
                                                    </div>
                                                </td>
                                                <td className="flex flex-wrap gap-1 items-center px-6 py-4 whitespace-nowrap">
                                                    {cat.subcategories && cat.subcategories.length > 0 ? (
                                                        cat.subcategories.map((subcat, i) => (
                                                            <span key={i} className='inline-block text-[11px] text-blue-500 bg-blue-50 p-1 capitalize'>{subcat}</span>
                                                        ))
                                                    ) : (
                                                        <span>None</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${cat.displayOnHome ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                                        onClick={() => handleCategoryDisplayToggle(cat._id)}
                                                    >
                                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${cat.displayOnHome ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300'
                                                            onClick={() => {
                                                                setSelectedCategory(cat);
                                                                setCategoryName(cat.name);
                                                                setCategoryImagePreview(cat.imageURL ? `${import.meta.env.VITE_HOST}${cat.imageURL}` : null);
                                                                setSubcategoryName("")
                                                                setShowUpdateModal(true);
                                                            }}
                                                        />
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteCategory(cat._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={5} className='px-6 py-4 text-center text-red-500'>No category found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showCreateModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showCreateModal ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                            <p className='font-bold'>Create New Category</p>
                            <BiX className='text-2xl cursor-pointer' onClick={() => setShowCreateModal(false)} />
                        </div>

                        <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                            <div>
                                <label className='font-bold text-sm'>Name</label>
                                <input type="text" name="categoryName" id="categoryName" value={categoryName} placeholder='Enter name of category' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={e => setCategoryName(e.target.value)} />
                            </div>

                            <div>
                                <label className='font-bold text-sm'>Image</label>
                                <input type="file" name="categoryImage" id="categoryImage" className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleCategoryImageChange} />
                            </div>

                            {categoryImagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={categoryImagePreview}
                                        alt="Preview"
                                        className="w-full h-40 object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        <div className='flex justify-end gap-3 p-6'>
                            <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className='px-4 py-1.5 bg-[var(--secondary)] text-white' onClick={handleCreateCategory}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>

                {/* Update Modal */}
                <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showUpdateModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                    onClick={() => {
                        setShowUpdateModal(false)
                        setSelectedCategory(null);
                        setCategoryName("");
                        setCategoryImagePreview(null);
                    }}
                >
                    <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showUpdateModal ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                            <p className='font-bold'>Update Category</p>
                            <BiX className='text-2xl cursor-pointer' onClick={() => {
                                setShowUpdateModal(false)
                                setSelectedCategory(null);
                                setCategoryName("");
                                setCategoryImagePreview(null);
                            }} />
                        </div>

                        <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                            <div>
                                <label className='font-bold text-sm'>Name</label>
                                <input type="text" name="categoryName" id="categoryName" value={categoryName} placeholder='Enter name of category' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={e => setCategoryName(e.target.value)} />
                            </div>

                            <div>
                                <label className='font-bold text-sm'>Subcategories</label>
                                <input type="text" name="subcategoryName" id="subcategoryName" value={subcategoryName} placeholder="Type press 'Enter' to add subcategory" className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={e => setSubcategoryName(e.target.value)} onKeyDownCapture={handleSubcategoryAdd} />

                                <div className='flex flex-wrap items-center gap-2 mt-3'>
                                    {selectedCategory?.subcategories?.map((subcat, i) => (
                                        <span key={i} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                                            {subcat}
                                            <button
                                                type="button"
                                                className="text-red-500 hover:text-red-300 text-[8px] font-bold"
                                                onClick={() => handleRemoveSubcategory(subcat)}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className='font-bold text-sm'>Image</label>
                                <input type="file" name="categoryImage" id="categoryImage" className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleCategoryImageChange} />
                            </div>

                            {categoryImagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={categoryImagePreview}
                                        alt="Preview"
                                        className="w-full h-40 object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        <div className='flex justify-end gap-3 p-6'>
                            <button className='px-4 py-1.5 bg-gray-100 text-gray-600'
                                onClick={() => {
                                    setShowUpdateModal(false)
                                    setSelectedCategory(null);
                                    setCategoryName("");
                                    setCategoryImagePreview(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button className='px-4 py-1.5 bg-[var(--secondary)] text-white' onClick={handleUpdateCategory}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}