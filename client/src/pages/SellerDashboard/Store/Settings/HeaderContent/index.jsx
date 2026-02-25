import React, { useEffect, useState } from 'react'
import ButtonLoader from '../../../../../components/ButtonLoader'
import axios from 'axios'

export default function HeaderContent({ settings, setSettings }) {
    const [menus, setMenus] = useState([])
    const [selectedMenu, setSelectedMenu] = useState(settings?.content?.headerMenuName)
    const [headerMenuSaving, setHeaderMenuSaving] = useState(false)
    const [loadingMenus, setLoadingMenus] = useState(true)

    useEffect(() => {
        if (!settings.sellerID) return
        fetchMenuItems()
    }, [settings?.sellerID])

    const fetchMenuItems = () => {
        setLoadingMenus(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/header-content/fetch-menus?sellerID=${settings?.sellerID}`)
            .then(res => {
                setMenus(res.data.menus)
            })
            .catch(err => console.error(err?.response?.data?.message || "Something went wrong while fetching menus!"))
            .finally(() => setLoadingMenus(false))
    }

    const handleUpdateHeaderMenu = () => {
        setHeaderMenuSaving(true)
        axios.patch(`${import.meta.env.VITE_HOST}/seller/header-content/update-header-menu/${settings?.sellerID}`, { selectedMenu })
            .then(res => {
                setSettings(prev => ({
                    ...prev,
                    content: {
                        ...prev.content,
                        headerMenuName: selectedMenu
                    }
                }))
                window.toastify(res.data.message, "success")
            })
            .catch(err => window.toastify(err.response.data.message, "error"))
            .finally(() => setHeaderMenuSaving(false))
    }

    return (
        <div>
            <h1 className='text-[#333]'>Header Menu</h1>
            <p className='w-fit text-sm bg-yellow-50 text-yellow-600 mt-1 mb-6'>Select a menu to display on your store header</p>

            <div className='w-full max-w-3xl flex flex-col gap-6 bg-white p-6 light-shad'>
                <div>
                    <label className='text-xs font-bold text-gray-900'>Select Menu</label>
                    {loadingMenus ?
                        <p className='mt-3 text-sm'>Loading...</p>
                        :
                        <select name="headerMenuName" id="headerMenuName" value={selectedMenu} className='mt-3 text-sm block w-full !p-2.5 border border-gray-300 !rounded-none' onChange={e => setSelectedMenu(e.target.value)}>
                            <option value="" disabled>Select a menu</option>
                            {menus.map(menu => (
                                <option key={menu._id} value={menu.name}>{menu.name}</option>
                            ))}
                        </select>
                    }
                </div>

                <div className='flex justify-end gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                        disabled={headerMenuSaving}
                        onClick={handleUpdateHeaderMenu}
                    >
                        {!headerMenuSaving ? 'Save Changes' : <>Saving <ButtonLoader /></>}
                    </button>
                </div>
            </div>
        </div>
    )
}