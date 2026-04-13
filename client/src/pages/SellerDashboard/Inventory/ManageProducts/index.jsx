import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { LuSearch } from 'react-icons/lu'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'
import { RxTrash } from 'react-icons/rx'
import { BiCheck } from 'react-icons/bi'

export default function ManageProducts() {
    const [searchParams] = useSearchParams();
    const urlPage = parseInt(searchParams.get("page")) || 1;

    const { user } = useSellerAuthContext()
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(urlPage);
    const [totalPages, setTotalPages] = useState(1);
    const [currency, setCurrenct] = useState("")
    const [searchText, setSearchText] = useState("")
    const [activeSearch, setActiveSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (activeSearch) {
            fetchSearchedProducts(activeSearch, page)
        } else {
            fetchProducts(page)
        }
    }, [activeSearch, page])

    const fetchProducts = (page = 1) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/manage-products/all?sellerID=${user._id}&page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setProducts(data?.products || [])
                    setTotalPages(Math.ceil((data?.totalProducts || 0) / 20));
                    setCurrenct(data?.currency)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const fetchSearchedProducts = (text, page = 1) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/manage-products/search?sellerID=${user._id}&searchText=${text}&page=${page}`)
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data?.searchedProducts || [])
                    setTotalPages(Math.ceil((res.data?.totalSearchedProducts || 0) / 20));
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleSearch = () => {
        if (!searchText) return setActiveSearch("")
        setActiveSearch(searchText)
    }

    const handleProductStatusToggle = (id) => {
        setLoading(true);
        axios.put(`${import.meta.env.VITE_HOST}/seller/manage-products/toggle-status/${id}`)
            .then(res => {
                if (res.status === 202) {
                    setTimeout(() => {
                        setProducts(prev => prev.map(product => (product._id === res.data.product._id ? res.data.product : product)));
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Frontend TOGGLE error", err.message);
                window.toastify(err.response?.data?.message || "Failed to update toggle", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleProductSaleStatusToggle = (id) => {
        setLoading(true);
        axios.put(`${import.meta.env.VITE_HOST}/seller/manage-products/toggle-sale-status/${id}`)
            .then(res => {
                if (res.status === 202) {
                    setTimeout(() => {
                        setProducts(prev => prev.map(product => (product._id === res.data.product._id ? res.data.product : product)));
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Frontend TOGGLE error", err.message);
                window.toastify(err.response?.data?.message || "Failed to update toggle", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteProduct = (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        axios.delete(`${import.meta.env.VITE_HOST}/seller/manage-products/delete/${id}`)
            .then(res => {
                if (res.status === 203) {
                    window.toastify(res.data.message, "success")
                    setProducts(prev => prev.filter(product => product._id !== id));
                }
            })
            .catch(err => {
                console.error("Frontend DELETE error", err.message)
                window.toastify(err.response?.data?.message || "Failed to delete product", "error")
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Manage Products</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage the data and avaialbity of your products in your inventory.</p>
            </div>

            <div className='seller-container'>
                <div className='flex justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Inventory / Manage Product</p>

                    <div className='flex flex-1 justify-end items-center gap-2.5'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search by category id, title, description' className='w-full max-w-[250px]  border border-gray-200 text-sm bg-white !px-4 !py-2 !rounded-none' onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className='flex items-center gap-1 text-sm text-white bg-[var(--secondary)] px-5 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70' onClick={handleSearch}>Search <LuSearch /></button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">#</th>
                                <th scope="col" className="font-bold px-6 py-4">Product</th>
                                <th scope="col" className="font-bold px-6 py-4">Price ({currency})</th>
                                <th scope="col" className="font-bold px-6 py-4">Category</th>
                                <th scope="col" className="font-bold px-6 py-4">Sold</th>
                                <th scope="col" className="font-bold px-6 py-4">Status</th>
                                <th scope="col" className="font-bold px-6 py-4">On Sale</th>
                                <th scope="col" className="font-bold px-6 py-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr className='bg-white'>
                                        <td colSpan={8} className='py-20'>
                                            <div className='flex justify-center'>
                                                <div className='flex flex-col items-center gap-5'>
                                                    <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                    <p>Loading...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    products.length > 0 ?
                                        products.map((product, i) => (
                                            <tr key={product._id} className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{i + 1}</td>
                                                <td className="px-6 py-4 text-gray-900 font-bold capitalize">
                                                    <div className='w-fit flex items-center gap-4'>
                                                        {product.mainImageURL && <img src={`${product.mainImageURL}`} alt={i + 1} className='w-8 h-8 object-contain' />}
                                                        <div className='flex flex-col'>
                                                            <span className='whitespace-nowrap'>{product.title}</span>
                                                            <span className={`${product.stock > 0 ? 'text-[#39ea4a] font-normal!' : 'text-neutral-400 font-normal!'}`}>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {product.price} <span className='text-[11px] text-red-400 line-through'>{product.comparedPrice}</span>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {product.category || "_"}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {product.sold}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${product.status === 'active' ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                                        onClick={() => handleProductStatusToggle(product._id)}
                                                    >
                                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${product.status === 'active' ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${product.onSale ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                                        onClick={() => handleProductSaleStatusToggle(product._id)}
                                                    >
                                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${product.onSale ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300' onClick={() => navigate(`/seller/inventory/manage-products/edit/${product._id}`)} />
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteProduct(product._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={8} className='px-6 py-4 text-center text-red-500'>No product found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex gap-2 mt-5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => { setPage(p); navigate(`?page=${p}`) }}
                                className={`px-3 py-1 text-sm 
                                ${page === p ? "bg-[var(--secondary)] text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div >
        </>
    )
}