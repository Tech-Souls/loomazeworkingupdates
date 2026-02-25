import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FaWhatsapp, FaFacebookF, FaEnvelope, FaPhone, FaInstagram, FaTiktok, FaYoutube, FaSnapchat } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import dayjs from 'dayjs';
import axios from 'axios';

const icons = [
    { name: 'facebook', icon: FaFacebookF },
    { name: 'instagram', icon: FaInstagram, },
    { name: 'youtube', icon: FaYoutube, },
    { name: 'snapchat', icon: FaSnapchat, },
    { name: 'tiktok', icon: FaTiktok, },
    { name: 'x', icon: FaXTwitter, },
]

export default function ProductFooter({ settings, isCustomDomain }) {
    const [footerMenu1Items, setFooterMenu1Items] = useState([])
    const [footerMenu2Items, setFooterMenu2Items] = useState([])
    const [footerMenuLoading, setFooterMenuLoading] = useState(true)
    const [open, setOpen] = useState({ quick: false, sell: false, know: false, })

    useEffect(() => {
        if (!settings.sellerID) return
        fetchFooterMenuItems()
    }, [settings])

    const fetchFooterMenuItems = () => {
        const footerMenu1Name = settings?.content?.footerMenu1Name
        const footerMenu2Name = settings?.content?.footerMenu2Name

        setFooterMenuLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-footer-menu?sellerID=${settings?.sellerID}&footerMenu1Name=${footerMenu1Name}&footerMenu2Name=${footerMenu2Name}`)
            .then(res => {
                setFooterMenu1Items(res.data.footerMenu1Items.links)
                setFooterMenu2Items(res.data.footerMenu2Items.links)
            })
            .catch(err => console.error(err?.response?.data?.message || "Something went wrong while fetching footer menu items!"))
            .finally(() => setFooterMenuLoading(false))
    }

    const toggle = (section) => setOpen((prev) => ({ ...prev, [section]: !prev[section] }))

    const socials = settings?.socials || {};

    const socialIconsToDisplay = Object.entries(socials)
        .filter(([key, value]) => value?.show)
        .map(([key, value]) => ({ name: key, ...value }));

    return (
        <footer className="bg-[#f8f8f8] border-t border-gray-200">
            <div className="pt-10 pb-16 px-6 sm:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 justify-center">
                    <div className="space-y-4">
                        <a href="/" className="block">
                            {settings?.logo
                                ? <img src={`${import.meta.env.VITE_HOST}${settings.logo}`} alt="logo" className='w-42' />
                                : <h1 className='text-[var(--primary)] font-extrabold text-3xl'>{settings?.brandName}</h1>
                            }
                        </a>

                        <p className='pt-2.5 text-sm'>{settings?.footerDescription}</p>
                    </div>

                    <div>
                        <button
                            className="w-full flex justify-between items-center text-gray-900 font-semibold mb-4 md:mb-2 md:cursor-default"
                            onClick={() => toggle('quick')}
                        >
                            Quick Links
                            <ChevronDown
                                className={`h-5 w-5 md:hidden transition-transform ${open.quick ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <ul
                            className={`overflow-hidden transition-all duration-300 space-y-2 text-sm text-gray-600 ${open.quick ? 'max-h-96' : 'max-h-0'} md:max-h-none`}
                        >
                            {footerMenuLoading ?
                                <div className='flex flex-col gap-4'>
                                    <span className="w-20 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                    <span className="w-26 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                    <span className="w-18 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                </div>
                                :
                                footerMenu1Items.map((item, i) => (
                                    <li>
                                        <a key={i} href={item.url || "/"} target="_blank" className="hover:text-gray-900">
                                            {item.label}
                                        </a>
                                    </li>
                                ))
                            }
                            {/* <li><a href={isCustomDomain ? '/products' : `/brand/${settings?.brandSlug}/products`} className="hover:text-gray-900">Featured Products</a></li>
                            <li><a href={isCustomDomain ? '/products' : `/brand/${settings?.brandSlug}/products`} className="hover:text-gray-900">Trending Products</a></li>
                            <li><a href={isCustomDomain ? '/coupons' : `/brand/${settings?.brandSlug}/coupons`} className="hover:text-gray-900">Coupons</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <button
                            className="w-full flex justify-between items-center text-gray-900 font-semibold mb-4 md:mb-2 md:cursor-default"
                            onClick={() => toggle('know')}
                        >
                            Customer Support
                            <ChevronDown
                                className={`h-5 w-5 md:hidden transition-transform ${open.know ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <ul
                            className={`overflow-hidden transition-all duration-300 space-y-2 text-sm text-gray-600 ${open.know ? 'max-h-96' : 'max-h-0'} md:max-h-none`}
                        >
                            {footerMenuLoading ?
                                <div className='flex flex-col gap-4'>
                                    <span className="w-20 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                    <span className="w-26 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                    <span className="w-18 h-3 bg-neutral-200 animate-pulse rounded"></span>
                                </div>
                                :
                                footerMenu2Items.map((item, i) => (
                                    <li>
                                        <a key={i} href={item.url || "/"} target="_blank" className="hover:text-gray-900">
                                            {item.label}
                                        </a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <ul className="space-y-3 text-black">
                            {settings?.support?.phoneNumber &&
                                <li className="flex items-center gap-2">
                                    <FaPhone />
                                    <span className='text-sm'>{settings?.support?.phoneNumber}</span>
                                </li>
                            }
                            {settings?.support?.whatsappNumber &&
                                <li className="flex items-center gap-2">
                                    <FaWhatsapp />
                                    <span className='text-sm'>{settings?.support?.whatsappNumber}</span>
                                </li>
                            }
                            {settings?.support?.email &&
                                <li>
                                    <a href="mailto:sales@fatbit.com" className="hover:text-gray-600 flex items-center gap-2">
                                        <FaEnvelope />
                                        <span className='text-sm'>{settings?.support?.email}</span>
                                    </a>
                                </li>
                            }
                        </ul>

                        <div className="flex flex-wrap gap-3">
                            {socialIconsToDisplay.map((social, i) => {
                                const IconComponent = icons.find(icon => icon.name === social.name)?.icon;
                                const finalLink = social?.link?.startsWith("http") ? social.link : "https://" + social.link;

                                return (
                                    <a key={i} href={finalLink.includes("null") ? "#" : finalLink} target="_blank" className='flex gap-2 cursor-pointer hover:opacity-70'>
                                        <div className='flex justify-center items-center bg-black w-5 h-5 p-1 rounded-lg'>
                                            {IconComponent && <IconComponent size={12} color="white" />}
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center md:mt-5 mx-4 sm:mx-6 text-black border-t border-gray-300 p-4 sm:p-6 text-sm">
                <div>
                    Copyright &copy; {dayjs().year()} {settings?.brandName}. All rights reserved.
                </div>
            </div>
        </footer>
    )
}