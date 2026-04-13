import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import { FiPlusCircle } from 'react-icons/fi'
import { FaRegEye } from "react-icons/fa6";
import { MdOutlineEdit } from 'react-icons/md'
import { RxTrash } from 'react-icons/rx'
import dayjs from 'dayjs'
import axios from 'axios'

export default function Pages() {
    const { user } = useSellerAuthContext()
    const [pages, setPages] = useState([])
    const [settings, setSettings] = useState({})
    const [settingsLoading, setSettingsLoading] = useState(true)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user?._id) return
        fetchSettings()
    }, [user?._id])

    useEffect(() => {
        if (!user?._id) return
        fetchPages()
    }, [user?._id])

    const fetchSettings = () => {
        setSettingsLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/pages/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings || {})
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setSettingsLoading(false))
    }

    const fetchPages = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/pages/all?sellerID=${user._id}`)
            .then(res => {
                setPages(res.data.pages)
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setLoading(false))
    }

    const handleDeletePage = (id) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return

        setLoading(true)
        axios.delete(`${import.meta.env.VITE_HOST}/seller/pages/delete-page/${id}`)
            .then(res => {
                if (res.status === 203) {
                    setPages(pages.filter(page => page._id !== id))
                }
            })
            .catch(err => {
                console.error(err.response?.data?.message || "Something went wrong. Please try again!")
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Pages</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Create and manage pages here to show on your store.</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Pages</p>

                    <button className='flex items-center gap-2 text-xs bg-[var(--primary)]/5 text-[var(--primary)] px-6 py-2 transition-all duration-150 ease-linear hover:bg-[var(--primary)]/10' onClick={() => navigate("add")}>Add page <FiPlusCircle /></button>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">Title</th>
                                <th scope="col" className="font-bold px-6 py-4">Visibility</th>
                                <th scope="col" className="font-bold px-6 py-4">Content</th>
                                <th scope="col" className="font-bold px-6 py-4 text-end">Updated At</th>
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
                                    pages.length > 0 ?
                                        pages.map((page) => (
                                            <tr key={page._id} className="bg-white border-b border-gray-200">
                                                <td scope="row" className="px-6 py-4 text-gray-900 font-bold capitalize">
                                                    <div className='w-fit flex items-center gap-4'>
                                                        <span className='whitespace-nowrap'>{page.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    <div className={`w-fit px-2 py-0.5 ${page.visibility ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-700"}`}>
                                                        {page.visibility ? "Visibile" : "Hidden"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 capitalize" dangerouslySetInnerHTML={{ __html: page.content }}></td>
                                                <td className="px-6 py-4 text-end capitalize">
                                                    {dayjs(page.updatedAt).format("DD-MM-YYYY HH:MM A")}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className='flex justify-end gap-2 items-center'>
                                                        {!settingsLoading &&
                                                            <FaRegEye className='text-[16px] text-gray-500 cursor-pointer hover:text-gray-300'
                                                                onClick={() => {
                                                                    const url = settings?.domain
                                                                        ? `${settings?.domain?.startsWith("http") ? settings.domain : `https://${settings.domain}`}/pages/${page.slug}`
                                                                        : `${import.meta.env.VITE_MAIN_DOMAIN.startsWith("http") ? import.meta.env.VITE_MAIN_DOMAIN : `https://${import.meta.env.VITE_MAIN_DOMAIN}`}/brand/${settings?.brandSlug}/pages/${page.slug}`

                                                                    window.open(url, "_blank", "noopener,noreferrer");
                                                                }}
                                                            />
                                                        }
                                                        <MdOutlineEdit className='text-[16px] text-blue-500 cursor-pointer hover:text-blue-300'
                                                            onClick={() => navigate(`update/${page._id}`)}
                                                        />
                                                        <RxTrash className='text-[16px] text-red-500 cursor-pointer hover:text-red-300'
                                                            onClick={() => handleDeletePage(page._id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={5} className='px-6 py-4 text-center text-red-500'>No pages added yet!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}