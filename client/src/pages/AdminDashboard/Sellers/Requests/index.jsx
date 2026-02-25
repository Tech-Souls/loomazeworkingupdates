import React, { useEffect, useState } from 'react'
import { MdOutlineEdit } from 'react-icons/md'
import { RxTrash } from 'react-icons/rx'
import { BiX } from 'react-icons/bi';
import dayjs from 'dayjs'
import axios from 'axios'

export default function SellerRequests() {
    const [sellers, setSellers] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [activeSearch, setActiveSearch] = useState("")
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        if (activeSearch) {
            fetchSearchedSellers(activeSearch, page)
        } else {
            fetchSellers(page)
        }
    }, [page, activeSearch])

    const fetchSellers = (page) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/admin/sellers/requests/all?page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setSellers(data?.sellers || [])
                    setTotalPages(Math.ceil(data?.totalSellers / 20))
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const fetchSearchedSellers = (text, page) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/admin/sellers/requests/search?searchText=${text}&page=${page}`)
            .then(res => {
                if (res.status === 200) {
                    setSellers(res.data?.searchedSellers || [])
                    setTotalPages(Math.ceil(res.data?.totalSearchedSellers / 20))
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleSearch = () => {
        if (!searchText) {
            setActiveSearch("")
            setPage(1)
            return
        }
        setActiveSearch(searchText)
        setPage(1)
    }

    const handleUpdateSeller = async (ans) => {
        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_HOST}/admin/sellers/requests/update-status/${selectedSeller._id}`, { status: ans });
            if (res.status === 202) {
                setShowUpdateModal(false);
                setSelectedSeller(null);
                window.toastify(res.data.message, "success")
                if (activeSearch) {
                    fetchSearchedSellers(activeSearch, page);
                } else {
                    fetchSellers(page);
                }
            }
        } catch (err) {
            console.error("Frontend UPDATE error", err.message);
            window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error")
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteSeller = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this seller?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const res = await axios.delete(`${import.meta.env.VITE_HOST}/admin/sellers/requests/delete/${id}`);
            if (res.status === 203) {
                window.toastify("Seller deleted successfully!", "success")
                if (activeSearch) {
                    fetchSearchedSellers(activeSearch, page);
                } else {
                    fetchSellers(page);
                }
            }
        } catch (err) {
            console.error("Frontend DELETE error", err.message);
            window.toastify(err.response.data.message || "Something went wrong! Please try again.", "error")
        } finally {
            setLoading(false);
        }
    };

    const renderPageNumbers = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`px-3 py-1 cursor-pointer hover:!bg-[#666] hover:!text-white ${page === i ? 'bg-[var(--secondary)]/75 text-white' : 'bg-white !text-gray-700'}`}
                    onClick={() => setPage(i)}
                >
                    {i}
                </button>
            )
        }
        return pages
    }

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Seller Requests</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>View and manage all sellers application on the platform.</p>
            </div>

            <div className='admin-container'>
                <div className='flex justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Admin</span> / Seller Requests</p>

                    <div className='flex flex-1 justify-end items-center gap-2.5'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search by id, username or email' className='w-full max-w-[250px] text-sm bg-white !px-4 !py-2 !rounded-none' onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className='text-sm text-white bg-[var(--secondary)] px-6 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70' onClick={handleSearch}>Search</button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-white uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">Seller ID</th>
                                <th scope="col" className="font-bold px-6 py-4">Seller</th>
                                <th scope="col" className="font-bold px-6 py-4">Reg. Date</th>
                                <th scope="col" className="font-bold px-6 py-4">Status</th>
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
                                    sellers.length > 0 ?
                                        sellers.map(seller => (
                                            <tr className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{seller.userID}</td>
                                                <td scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap">
                                                    <div className='flex flex-col gap-1'>
                                                        <p className='text-gray-900 font-bold'>{seller.username}</p>
                                                        <p className='text-gray-600'>{seller.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{dayjs(seller.createdAt).format('DD-MM-YYYY HH:mm')}</td>
                                                <td className="px-6 py-4 capitalize">
                                                    <span className={`text-[10px] px-2 py-1 font-bold ${seller.status === 'pending' ? 'text-[#d4d407] bg-[#f6fac6]' : 'text-[#4b8fd9] bg-[#e4f1ff]'}`}>
                                                        {seller.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300'
                                                            onClick={() => {
                                                                setSelectedSeller(seller);
                                                                setShowUpdateModal(true);
                                                            }}
                                                        />
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300' onClick={() => handleDeleteSeller(seller._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={5} className='px-6 py-4 text-center text-red-500'>No seller found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {
                    !loading &&
                    totalPages > 1 &&
                    <div className='flex flex-wrap my-8 items-center justify-center gap-1'>
                        {renderPageNumbers()}
                    </div>
                }

                {/* Update Modal */}
                <div className={`flex flex-col justify-between fixed top-0 left-0 w-full bg-white h-screen transition-all duration-300 ease-linear ${showUpdateModal ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-75'}`}>
                    <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                        <p className='font-bold'>Seller Details</p>
                        <BiX className='text-2xl cursor-pointer' onClick={() => setShowUpdateModal(false)} />
                    </div>

                    <div className='w-full max-w-7xl mx-auto flex-1 p-6 overflow-y-auto'>
                        {selectedSeller?.status === "pending" &&
                        <p className='text-sm text-orange-400 bg-orange-50 px-2.5 py-1 w-fit'>Review the seller application for account approval</p>
                        }

                        <div className='flex flex-col lg:flex-row justify-between gap-12 mt-8'>
                            <div className='text-gray-800 flex flex-1 flex-col gap-3 h-fit bg-[#f1f5f9c9] p-6'>
                                <p><span className='font-bold'>Brand Name:</span> <span className='inline-block px-3 py-0.5 bg-green-100 text-green-500'>{selectedSeller?.brandName}</span></p>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <p><span className='font-bold'>Username:</span> {selectedSeller?.username}</p>
                                    <p><span className='font-bold'>Fullname:</span> {selectedSeller?.fullname}</p>
                                </div>
                                <p><span className='font-bold'>Email:</span> {selectedSeller?.email}</p>
                                <p><span className='font-bold'>CNIC:</span> {selectedSeller?.cnic}</p>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <p><span className='font-bold'>Phone:</span> {selectedSeller?.phoneNumber}</p>
                                    <p><span className='font-bold'>Whatsapp:</span> {selectedSeller?.whatsappNumber}</p>
                                </div>
                                <p><span className='font-bold'>Address:</span> {selectedSeller?.address}</p>
                                <p><span className='font-bold'>Status:</span> <span className='inline-block px-3 py-0.5 text-[#d4d407] bg-[#f6fac6]'>{selectedSeller?.status}</span></p>
                            </div>

                            <div className='flex-1'>
                                <p className='font-bold text-gray-800 mb-6'>Documents:</p>
                                <div className='w-fit flex flex-col gap-8'>
                                    <img src={`${selectedSeller?.cnicFront}`} alt="cnic-front" loading='lazy' className='w-50' />
                                    <img src={`${selectedSeller?.cnicBack}`} alt="cnic-back" loading='lazy' className='w-50' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 p-6'>
                        <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowUpdateModal(false)}>Cancel</button>
                        <button
                            className='px-4 py-1.5 bg-[#f73535] text-white'
                            onClick={() => handleUpdateSeller("rejected")}
                        >
                            Reject
                        </button>
                        <button
                            className='px-4 py-1.5 bg-[var(--secondary)] text-white'
                            onClick={() => handleUpdateSeller("approved")}
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}