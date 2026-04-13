import React, { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../../../contexts/SellerAuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { FiPlusCircle } from 'react-icons/fi'
import { BiX } from 'react-icons/bi'
import { GoArrowDown, GoArrowUp } from 'react-icons/go'
import { MdOutlineEdit } from 'react-icons/md'
import { HiOutlineTrash } from 'react-icons/hi2'
import ButtonLoader from '../../../../../components/ButtonLoader'
import Loader from '../../../../../components/Loader'
import axios from 'axios'

const linkInitialState = { label: "", url: "" }

export default function UpdateMenu() {
    const { menuID } = useParams()
    const { user } = useSellerAuthContext()
    const [menuName, setMenuName] = useState("")
    const [linkState, setLinkState] = useState(linkInitialState)
    const [links, setLinks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleLinkChange = e => setLinkState(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        if (!user._id) return
        fetchMenu()
    }, [user])

    const fetchMenu = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/seller/menus/fetch-single-menu/${menuID}`,)
            .then(res => {
                if (res.status === 200) {
                    const { menu } = res.data
                    setMenuName(menu.name || "")
                    setLinks(menu.links || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleAddMenuItem = () => {
        const { label, url } = linkState
        if (!label || !url) return window.toastify("Label and URL is required!", "warning")

        setLinks(prev => [...prev, linkState])
        setLinkState(linkInitialState)
    };

    const handleUpdateMenuItem = () => {
        const { label, url } = linkState;
        if (!label || !url) return window.toastify("Label and URL are required!", "warning");

        setLinks(prev => prev.map((item, idx) =>
            idx === editItem ? { label, url } : item
        ));

        closeModal();
    };

    const handleMoveUp = (index) => {
        setLinks(prev => {
            if (index === 0) return prev;

            const updated = [...prev];

            const temp = updated[index - 1]
            updated[index - 1] = updated[index]
            updated[index] = temp

            return updated;
        })
    }

    const handleMoveDown = (index) => {
        setLinks(prev => {
            if (index === prev.length - 1) return prev;

            const updated = [...prev];

            const temp = updated[index + 1]
            updated[index + 1] = updated[index]
            updated[index] = temp

            return updated;
        })
    }

    const handleDeleteMenuItem = (index) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditItem(null);
        setLinkState(linkInitialState);
    };

    const handleUpdateMenu = () => {
        if (!menuName) return window.toastify("Menu name is required!", "warning")

        const updatedMenu = {
            name: menuName,
            links
        }

        setSaving(true);
        axios.patch(`${import.meta.env.VITE_HOST}/seller/menus/update-menu/${menuID}`, updatedMenu)
            .then(res => {
                if (res.status === 202) {
                    window.toastify(res.data.message, "success")
                    navigate(-1)
                }
            })
            .catch(err => {
                console.error("Frontend POST error", err.message)
                window.toastify(err.response?.data?.message || "Something went wrong! Please try again", "error")
            })
            .finally(() => setSaving(false));
    }

    if(loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Main Menu</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage your store main menu content.</p>
            </div>

            <div className='seller-container'>
                <div className='flex justify-between items-center gap-4'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Store / Main Menu</p>
                    <button className='text-xs bg-(--primary) text-white px-4 py-1.5 font-semibold rounded-lg transition-all duration-300 ease-out hover:opacity-70 disabled:opacity-70'
                        disabled={saving}
                        onClick={handleUpdateMenu}
                    >
                        {saving ? <ButtonLoader /> : "Save"}
                    </button>
                </div>

                <div className='w-full max-w-xl mx-auto p-6 bg-white light-shad mt-6'>
                    <p className='text-sm text-gray-800 font-semibold mb-4'>Menu Name</p>
                    <div>
                        <label className='text-sm'>Name</label>
                        <input type="text" name="name" id="name" placeholder='e.g., Main Menu' value={menuName} className='w-full text-sm mt-2 !p-2.5 border border-gray-300 rounded-none!' onChange={e => setMenuName(e.target.value)} />
                    </div>
                </div>

                <div className='w-full max-w-xl mx-auto p-6 bg-white light-shad mt-6'>
                    <p className='text-sm text-gray-800 font-semibold mb-4'>Menu Items</p>

                    <div className='flex flex-col gap-2'>
                        {links?.length > 0 &&
                            links.map((item, i) => (
                                <div key={i} className='flex justify-between items-center px-3 py-4 text-xs border border-gray-200 cursor-pointer hover:bg-gray-100'>
                                    <div className='flex items-center gap-2.5'>
                                        <div className='flex gap-1'>
                                            <button className='disabled:opacity-50 disabled:!cursor-not-allowed' disabled={i === 0}>
                                                <GoArrowUp size={16} className={`${i === 0 ? "" : "hover:text-[var(--secondary)]"} text-gray-800`}
                                                    onClick={() => handleMoveUp(i)}
                                                />
                                            </button>
                                            <button className='disabled:opacity-50 disabled:!cursor-not-allowed' disabled={i === links.length - 1}>
                                                <GoArrowDown size={16} className={`${i === links.length - 1 ? "" : "hover:text-[var(--secondary)]"} text-gray-800`}
                                                    onClick={() => handleMoveDown(i)}
                                                />
                                            </button>
                                        </div>
                                        <p>{item.label}</p>
                                    </div>

                                    <div className='flex gap-2.5'>
                                        <MdOutlineEdit size={16} className='text-gray-800 hover:opacity-50'
                                            onClick={() => {
                                                setEditItem(i);
                                                setLinkState({ label: item.label, url: item.url });
                                                setShowModal(true);
                                            }}
                                        />
                                        <HiOutlineTrash size={16} className='text-gray-800 hover:opacity-50' onClick={() => handleDeleteMenuItem(i)} />
                                    </div>
                                </div>
                            ))
                        }

                        <div role='button' className='px-3 py-4 border border-gray-200 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                                setEditItem(null);
                                setLinkState(linkInitialState);
                                setShowModal(true);
                            }}
                        >
                            <button className='flex items-center gap-2 text-xs text-[var(--secondary)]'><FiPlusCircle /> Add menu item</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal  */}
            <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                onClick={() => setShowModal(false)}
            >
                <div className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${showModal ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                        <p className='font-bold'>Add menu item</p>
                        <BiX className='text-2xl cursor-pointer' onClick={closeModal} />
                    </div>

                    <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                        <div>
                            <label className='font-bold text-sm'>Label</label>
                            <input type="text" name="label" id="label" value={linkState.label} placeholder='e.g., About Us' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleLinkChange} />
                        </div>
                        <div>
                            <label className='font-bold text-sm'>Link</label>
                            <input type="text" name="url" id="url" value={linkState.url} placeholder='Paste url or link' className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none' onChange={handleLinkChange} />
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 p-6'>
                        <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={closeModal}>Cancel</button>
                        <button
                            className='px-4 py-1.5 bg-[var(--secondary)] text-white disabled:opacity-80'
                            disabled={saving}
                            onClick={editItem ? handleUpdateMenuItem : handleAddMenuItem}
                        >
                            {editItem ? "Update" : "Add"}
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}