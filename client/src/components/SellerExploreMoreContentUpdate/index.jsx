import React, { useState } from 'react'
import exploreImg from '../../assets/images/platformExplore.jpg'
import { Image } from 'antd'
import ButtonLoader from '../ButtonLoader'
import axios from 'axios'

export default function SellerExploreMoreContentUpdate({ user, settings }) {
    const secondExploreSectionFor = ["jewellery", "fashion"]

    const [title, setTitle] = useState(settings?.content?.exploreMore?.title || "Brand That You Can Trust")
    const [title2, setTitle2] = useState(settings?.content?.exploreMore2?.title || "Brand That You Can Trust")
    const [subtitle, setSubtitle] = useState(settings?.content?.exploreMore?.subtitle || "Explore our handpicked selection of products you loved and enjoy the best discounts here on your each purchase.")
    const [subtitle2, setSubtitle2] = useState(settings?.content?.exploreMore2?.subtitle || "Explore our handpicked selection of products you loved and enjoy the best discounts here on your each purchase.")
    const [ctaLink, setCtaLink] = useState(settings?.content?.exploreMore?.ctaLink || "")
    const [ctaLink2, setCtaLink2] = useState(settings?.content?.exploreMore2?.ctaLink || "")
    const [image, setImage] = useState(null)
    const [image2, setImage2] = useState(null)
    const [preview, setPreview] = useState(null)
    const [preview2, setPreview2] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        const validTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!validTypes.includes(file.type)) return window.toastify("Please select a valid image type (PNG, JPEG, WEBP)", "warning");
        if (file.size > 5 * 1024 * 1024) return window.toastify("Please select image within 5MB size", "warning")

        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleImageChange2 = (e) => {
        const file = e.target.files[0]

        const validTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!validTypes.includes(file.type)) return window.toastify("Please select a valid image type (PNG, JPEG, WEBP)", "warning");
        if (file.size > 5 * 1024 * 1024) return window.toastify("Please select image within 5MB size", "warning")

        setImage2(file)
        setPreview2(URL.createObjectURL(file))
    }

    const handleSaveChanges = () => {
        const formdata = new FormData()
        formdata.append("title", title.trim())
        formdata.append("subtitle", subtitle.trim())
        formdata.append("ctaLink", ctaLink.trim())
        image && formdata.append("image", image)

        setLoading(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/explore-more/update/${user._id}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading(false))
    }

    const handleSaveChanges2 = () => {
        const formdata = new FormData()
        formdata.append("title", title2.trim())
        formdata.append("subtitle", subtitle2.trim())
        formdata.append("ctaLink", ctaLink2.trim())
        image2 && formdata.append("image", image2)

        setLoading2(true)
        axios.post(`${import.meta.env.VITE_HOST}/seller/content/explore-more-2/update/${user._id}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                const { status, data } = res
                if (status === 202) {
                    window.toastify(data.message, "success")
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => setLoading2(false))
    }

    return (
        <div className='p-4 border border-gray-200 mt-6'>
            <p className='head text-base text-gray-900 font-bold mb-4'>Explore More Section</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-6 bg-white border border-gray-200'>
                    <div className='grid grid-cols-1 gap-4 mb-4'>
                        <div>
                            <label className='block mb-3 text-sm font-bold text-gray-900'>Title</label>
                            <input type="text" name="title" id="title" value={title} placeholder='Enter title of section' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className='block mb-3 text-sm font-bold text-gray-900'>Subtitle</label>
                            <input type="text" name="subtitle" id="subtitle" value={subtitle} placeholder='Enter subtitle of section' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setSubtitle(e.target.value)} />
                        </div>
                        <div>
                            <label className='block mb-3 text-sm font-bold text-gray-900'>CTA Link</label>
                            <input type="text" name="ctaLink" id="ctaLink" value={ctaLink} placeholder='Paste link where you want to redirect' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setCtaLink(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className='block mb-3 text-sm font-bold text-gray-900'>Image</label>
                        <input type="file" name="image" id="image" className='w-full text-sm !p-2.5 bg-white border border-gray-300 cursor-pointer !rounded-none' onChange={handleImageChange} />
                        <div className='w-[400px] mt-4'>
                            <Image
                                src={preview
                                    ? preview
                                    : settings?.content?.exploreMore?.imageURL
                                        ? `${settings.content.exploreMore.imageURL}`
                                        : exploreImg
                                }
                                alt="preview"
                            />
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <button className='w-fit px-4 py-2 text-xs bg-[var(--primary)] text-white rounded-md mt-4 transition-all duration-200 ease-out hover:opacity-70'
                            disabled={loading}
                            onClick={handleSaveChanges}
                        >
                            {!loading ? 'Save' : <ButtonLoader />}
                        </button>
                    </div>
                </div>

                {
                    secondExploreSectionFor.includes(settings?.layout?.homePageStyle) &&
                    <div className='p-6 bg-white border border-gray-200'>
                        <div className='grid grid-cols-1 gap-4 mb-4'>
                            <div>
                                <label className='block mb-3 text-sm font-bold text-gray-900'>Title</label>
                                <input type="text" name="title2" id="title2" value={title2} placeholder='Enter title of section' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setTitle2(e.target.value)} />
                            </div>
                            <div>
                                <label className='block mb-3 text-sm font-bold text-gray-900'>Subtitle</label>
                                <input type="text" name="subtitle2" id="subtitle2" value={subtitle2} placeholder='Enter subtitle of section' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setSubtitle2(e.target.value)} />
                            </div>
                            <div>
                                <label className='block mb-3 text-sm font-bold text-gray-900'>CTA Link</label>
                                <input type="text" name="ctaLink2" id="ctaLink2" value={ctaLink2} placeholder='Paste link where you want to redirect' className='w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none' onChange={(e) => setCtaLink2(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className='block mb-3 text-sm font-bold text-gray-900'>Image</label>
                            <input type="file" name="image" id="image" className='w-full text-sm !p-2.5 bg-white border border-gray-300 cursor-pointer !rounded-none' onChange={handleImageChange2} />
                            <div className='w-[400px] mt-4'>
                                <Image
                                    src={preview2
                                        ? preview2
                                        : settings?.content?.exploreMore2?.imageURL
                                            ? `${settings.content.exploreMore2.imageURL}`
                                            : exploreImg
                                    }
                                    alt="preview-2"
                                />
                            </div>
                        </div>

                        <div className='flex justify-end'>
                            <button className='w-fit px-4 py-2 text-xs bg-[var(--primary)] text-white rounded-md mt-4 transition-all duration-200 ease-out hover:opacity-70'
                                disabled={loading2}
                                onClick={handleSaveChanges2}
                            >
                                {!loading2 ? 'Save' : <ButtonLoader />}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}