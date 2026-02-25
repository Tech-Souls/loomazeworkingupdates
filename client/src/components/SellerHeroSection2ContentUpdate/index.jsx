import React, { useState } from 'react'
import ButtonLoader from '../ButtonLoader'
import { Image } from 'antd'
import { Trash2 } from "lucide-react"
import axios from 'axios'

export default function SellerHeroSection2ContentUpdate({ user, settings }) {
    const [heroSlider, setHeroSlider] = useState(settings?.content?.heroSlider2 || [])
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [cta, setCTA] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        const validTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!validTypes.includes(file.type)) return window.toastify("Please select a valid image type (PNG, JPEG, WEBP)", "warning");
        if (file.size > 5 * 1024 * 1024) return window.toastify("Please select image within 5MB size", "warning")

        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleAddSlide = () => {
        if (!image) return window.toastify("Select an image to add", "info")

        const formdata = new FormData()
        formdata.append("title", title.trim())
        formdata.append("subtitle", subtitle.trim())
        formdata.append("ctaLink", cta.trim())
        formdata.append("image", image)

        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/hero-slider-2/add/${user._id}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    setTitle("")
                    setSubtitle("")
                    setCTA("")
                    setImage(null)
                    setPreview(null)
                    setHeroSlider(data.heroSlider)
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    const handleDeleteSlide = (index) => {
        if (!window.confirm("Are you sure you want to delete this slide?")) return

        setDeleting(index)
        axios.delete(`${import.meta.env.VITE_HOST}/seller/content/hero-slider-2/delete/${user._id}/${index}`)
            .then(res => {
                if (res.status === 202) {
                    setHeroSlider(res.data.heroSlider)
                    window.toastify(res.data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Failed to delete slide", "error")
            })
            .finally(() => setDeleting(null))
    }

    return (
        <div className='p-4 border border-gray-200 mt-6'>
            {settings?.layout?.homePageStyle == "jewellery"
                ? <p className='head text-base text-gray-900 font-bold mb-4'>Hero Section 2 Slides</p>
                : <p className='head text-base text-gray-900 font-bold mb-4'>Hero Section Slides</p>
            }

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='mb-4'>
                    <label className='block mb-3 text-sm font-bold text-gray-900'>Title <span className='text-xs text-gray-700'>(Optional)</span></label>
                    <input type="text" name="title" id="title" value={title} placeholder='Type main heading to display' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={e => setTitle(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label className='block mb-3 text-sm font-bold text-gray-900'>Subtitle <span className='text-xs text-gray-700'>(Optional)</span></label>
                    <input type="text" name="subtitle" id="subtitle" value={subtitle} placeholder='Type subtitle to display' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={e => setSubtitle(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label className='block mb-3 text-sm font-bold text-gray-900'>CTA Link <span className='text-xs text-gray-700'>(Optional)</span></label>
                    <input type="text" name="cta" id="cta" value={cta} placeholder='Paste link where you want to redirect' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={e => setCTA(e.target.value)} />
                </div>
                <div>
                    <label className='block mb-3 text-sm font-bold text-gray-900'>Image *</label>
                    <input type="file" name="image" id="image" className='w-full text-sm !p-2.5 bg-white border border-gray-300 cursor-pointer !rounded-none' onChange={handleImageChange} />
                    {
                        preview &&
                        <img src={preview} alt="preview" className='w-[200px] h-[200px] object-contain mt-4' />
                    }
                </div>

                <button className='w-fit px-4 py-2 text-xs bg-[var(--primary)] text-white rounded-md mt-4 transition-all duration-200 ease-out hover:opacity-70'
                    disabled={loading}
                    onClick={handleAddSlide}
                >
                    {!loading ? 'Add Slide' : <ButtonLoader />}
                </button>
            </div>

            <div className='overflow-x-auto mt-6'>
                <table className='min-w-full text-sm border border-gray-200'>
                    <thead className='text-xs text-[var(--secondary)] bg-[var(--secondary)]/10'>
                        <tr>
                            <th className='px-4 py-2 border-b border-gray-200 text-left'>#</th>
                            <th className='px-4 py-2 border-b border-gray-200'>Image</th>
                            <th className='px-4 py-2 border-b border-gray-200'>Title</th>
                            <th className='px-4 py-2 border-b border-gray-200'>Subtitle</th>
                            <th className='px-4 py-2 border-b border-gray-200 whitespace-nowrap'>CTA Link</th>
                            <th className='px-4 py-2 border-b border-gray-200 text-end'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {heroSlider.length > 0 ? (
                            heroSlider.map((slide, index) => (
                                <tr key={index} className='text-xs'>
                                    <td className='px-4 py-2 border-b border-gray-200 text-left'>{index + 1}</td>
                                    <td className='px-4 py-2 border-b border-gray-200 text-center'>
                                        <Image
                                            src={`${slide.image}`}
                                            alt={"slide" + index}
                                            style={{ width: 50, height: 50, objectFit: 'contain', margin: '0 auto' }}
                                        />
                                    </td>
                                    <td className='px-4 py-2 border-b border-gray-200 text-gray-700 text-center'>
                                        {slide.title ? <p>{slide.title}</p> : '_'}
                                    </td>
                                    <td className='px-4 py-2 border-b border-gray-200 text-gray-700 text-center'>
                                        {slide.subtitle ? <p>{slide.subtitle}</p> : '_'}
                                    </td>
                                    <td className='px-4 py-2 border-b border-gray-200 text-blue-600 underline text-center'>
                                        {slide.ctaLink ? <a href={slide.ctaLink} target="_blank" rel="noreferrer">{slide.ctaLink}</a> : '_'}
                                    </td>
                                    <td className='px-4 py-2 border-b border-gray-200 text-center'>
                                        <div className='flex justify-end'>
                                            {deleting === index ?
                                                <div className='w-6 h-6 border-t border-[var(--primary)] rounded-full animate-spin'></div>
                                                :
                                                <Trash2 size={16} className='text-red-500 cursor-pointer hover:opacity-80' onClick={() => handleDeleteSlide(index)} />}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className='p-3 text-center text-gray-500'>
                                    No slides added yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}