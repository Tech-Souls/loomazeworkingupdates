import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../contexts/SellerAuthContext'
import axios from 'axios'

export default function Menus() {
    const { user } = useSellerAuthContext()
    const [menus, setMenus] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user._id) return
        fetchMenus()
    }, [user])

    const fetchMenus = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/seller/menus/all?sellerID=${user._id}`,)
            .then(res => {
                if (res.status === 200) {
                    setMenus(res.data.menus || []);
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Menus</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage your store main menu and footer menu content.</p>
            </div>

            <div className='seller-container'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Menus</p>
                    <button className='text-xs bg-[var(--primary)] text-white px-4 py-1.5 font-semibold rounded-lg transition-all duration-300 ease-out hover:opacity-70'
                        onClick={() => navigate("create")}
                    >
                        Create Menu
                    </button>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">Menu</th>
                                <th scope="col" className="font-bold px-6 py-4">Menu Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr className='bg-white'>
                                        <td colSpan={2} className='py-20'>
                                            <div className='flex justify-center'>
                                                <div className='flex flex-col items-center gap-5'>
                                                    <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                    <p>Loading...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    menus.map(menu => (
                                        <tr key={menu._id} className="bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-100" onClick={() => navigate(`update/${menu._id}`)}>
                                            <td scope="row" className="px-6 py-4 text-gray-900 font-bold">
                                                <span className='hover:underline'>{menu.name}</span>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <div className='flex gap-1 flex-wrap'>
                                                    {menu.links.map((item, i) => (
                                                        <span key={item._id}>
                                                            {item.label}{i < menu.links.length - 1 && ","}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}