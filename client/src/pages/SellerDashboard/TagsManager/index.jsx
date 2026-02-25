import { useEffect, useState } from 'react'
import { useSellerAuthContext } from '../../../contexts/SellerAuthContext'
import googleLogo from '../../../assets/images/google-logo.webp'
import facebookLogo from '../../../assets/images/facebook-logo.png'
import tiktokLogo from '../../../assets/images/tiktok-logo.png'
import pinterestLogo from '../../../assets/images/pinterest-logo.png'
import { BiX } from 'react-icons/bi'
import axios from 'axios'
import Loader from '../../../components/Loader'
import ButtonLoader from '../../../components/ButtonLoader'
import { useNavigate } from 'react-router-dom'

const tags = [
    {
        name: "Google Analytics",
        tag: "googleAnalytics",
        logo: googleLogo
    },
    {
        name: "Google Tag Manager",
        tag: "googleTagManager",
        logo: googleLogo
    },
    {
        name: "Google Search Console",
        tag: "googleSearchConsole",
        logo: googleLogo
    },
    {
        name: "Google Ads Conversion",
        tag: "googleAdsConversion",
        logo: googleLogo
    },
    {
        name: "Facebook Pixel",
        tag: "facebookPixel",
        logo: facebookLogo
    },
    {
        name: "Tiktok Pixel",
        tag: "tiktokPixel",
        logo: tiktokLogo
    },
    {
        name: "Pinterest Pixel",
        tag: "pinterestTag",
        logo: pinterestLogo
    },
]

export default function TagsManager() {

     const seller = useSellerAuthContext();
      console.log("Seller Authenticated:", seller); // Debug log
    
      const isGrowPlan = seller?.user?.planDetails?.plan === "grow";
      const isLocked = !isGrowPlan; // basic or no plan
      console.log(isLocked, isGrowPlan);

    const { user } = useSellerAuthContext()
    const [state, setState] = useState(null)
    const [settings, setSettings] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedTag, setSelectedTag] = useState(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const navigate = useNavigate()
    const isBasicPlan = user?.planDetails?.plan === "Grow"


    useEffect(() => {
        if (!user._id) return
        fetchSettings()
    }, [user])

    useEffect(() => {
        if (!showModal) {
            setState(null)
            setSelectedTag(null)
        }
    }, [showModal])


    const fetchSettings = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/tags-manager/fetch-settings?sellerID=${user._id}`)
            .then(res => {
                setSettings(res.data.settings || null)
            })
            .catch(err => console.error(err.response.data.message || "Something went wrong. Please try again!"))
            .finally(() => setLoading(false))
    }

    const handleTagSelect = (tag) => {
        if (isBasicPlan) { return window.toastify("Upgrade to Pro plan to use Tags Manager", "warning"); }
        setSelectedTag(tag)
        setShowModal(true)

        const tagValue = settings?.trackingTags?.[tag.tag] || ""
        setState(tagValue);
    }

    const handleAddTag = async () => {
        if (!state?.trim()) return window.toastify("Please paste a valid tag before saving.", "warning")

        try {
            setAdding(true)

            if (!state?.includes("<script") && !state?.includes("<meta")) {
                return window.toastify("Please include a valid <script> or <meta> tag.", "warning");
            }

            await axios.put(`${import.meta.env.VITE_HOST}/seller/tags-manager/update`, {
                sellerID: user._id,
                tagKey: selectedTag.tag,
                tagValue: state
            });
            window.toastify(`${selectedTag.name} updated successfully!`, "success");
            setShowModal(false)
            fetchSettings()
        } catch (err) {
            window.toastify(err.response?.data?.message || "Something went wrong!");
        } finally {
            setAdding(false)
        }
    }

    const handleRemoveTag = async (tag) => {
        if (!window.confirm(`Are you sure you want to remove ${tag.name}?`)) return;

        try {
            setAdding(true);
            await axios.put(`${import.meta.env.VITE_HOST}/seller/tags-manager/remove`, {
                sellerID: user._id,
                tagKey: tag.tag
            });
            window.toastify(`${tag.name} removed successfully!`, "success");
            fetchSettings();
        } catch (err) {
            window.toastify(err.response?.data?.message || "Something went wrong!");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <Loader />

    return (
        !isLocked ? (<div>
            {isBasicPlan && (
                <div className="bg-purple-50 border border-purple-300 p-4 rounded mb-4 text-center">
                    <p className="text-sm font-bold text-purple-800">Upgrade Required</p>
                    <p className="text-sm text-purple-700 mt-1">Tags Manager is available on the <b>Grow</b> plan. Please upgrade your plan to unlock tracking and analytics tags.</p>
                    <button className="mt-3 bg-primary px-4 py-2 text-xs text-white font-bold hover:opacity-80" onClick={() => navigate("/seller/loomaze-plan/deposit")}>Upgrade to Grow</button>
                </div>
            )}

            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Tags Manager</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Manage and add a tags for your store seo here. Follow the instructions carefully.</p>
            </div>

            <div className='seller-container'>
                <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Tags Manager</p>

                <div className='w-full bg-white p-4 sm:p-6 mb-6 light-shad mt-6'>
                    <h2 className='head font-bold text-sm text-gray-900'>Select an option to add relevant tag</h2>
                    <p className='w-fit text-xs bg-amber-100 text-amber-600 px-2 py-0.5 mt-1.5 mb-6'>Do not add wrong tags, it may destroy your website.</p>

                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4'>
                        {tags.map((tag, i) => {
                            const isAdded = !!settings?.trackingTags?.[tag.tag]
                            return (
                                <div
                                    key={i}
                                    className={`relative bg-gray-50 border px-6 py-4 flex flex-col justify-center items-center gap-1.5 cursor-pointer transition-all duration-200 ease-out 
                                    ${isAdded ? 'border-green-400 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
                                    onClick={() => handleTagSelect(tag)}
                                >
                                    <img src={tag.logo} alt={tag.tag} className='w-8' />
                                    <p className='text-xs sm:text-sm text-gray-900 text-center'>{tag.name}</p>

                                    {isAdded && (
                                        <span className='absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded'>
                                            Added
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Modal */}
                <div className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${showModal ? 'visible opacity-100' : 'invisible opacity-0'}`}
                    onClick={() => setShowModal(false)}
                >
                    <div className={`flex flex-col justify-between w-full max-w-[500px] h-full bg-white transition-all duration-300 ease-linear ${showModal ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center p-6 border-b border-b-gray-200'>
                            <p className='font-bold'>Add Tag</p>
                            <BiX className='text-2xl cursor-pointer' onClick={() => setShowModal(false)} />
                        </div>

                        <div className='flex flex-col gap-4 flex-1 p-6 overflow-y-auto'>
                            <div>
                                <label className='font-bold text-sm'>Tag *</label>
                                <textarea name="state" id="state" rows={6} value={state || ""} placeholder={`Paste full ${selectedTag?.name} tag here`} className='w-full text-sm !p-2 mt-3 border border-gray-200 !rounded-none outline-none resize-none focus:border-secondary'onChange={e => setState(e.target.value)} disabled={isBasicPlan}></textarea>
                            </div>
                        </div>

                        <div className='flex justify-between items-center p-6 border-t border-gray-200'>
                            <div>
                                {settings?.trackingTags?.[selectedTag?.tag] && (
                                    <button className='px-4 py-1.5 bg-red-500 text-white disabled:opacity-70'
                                        disabled={isBasicPlan || adding}
                                        onClick={() => handleRemoveTag(selectedTag)}
                                    >
                                        {!adding ? 'Remove Tag' :
                                            <span className='flex items-center gap-2'>Removing... <ButtonLoader /></span>
                                        }
                                    </button>
                                )}
                            </div>

                            <div className='flex gap-3'>
                                <button className='px-4 py-1.5 bg-gray-100 text-gray-600' onClick={() => setShowModal(false)}>Cancel</button>

                                <button className='px-4 py-1.5 bg-secondary text-white disabled:opacity-70'
                                    disabled={isBasicPlan || adding}
                                    onClick={handleAddTag}
                                >
                                    {!adding ? (settings?.trackingTags?.[selectedTag?.tag] ? 'Update Tag' : 'Add Tag') :
                                        <span className='flex items-center gap-2'>{settings?.trackingTags?.[selectedTag?.tag] ? 'Updating...' : 'Adding...'} <ButtonLoader /></span>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>):(
            // use glass affect for locked view on the tags manager page for basic or no plan users             
            <div className="seller-container inset-0 w-full h-full bg-white/40 backdrop-blur-md flex flex-col justify-center items-center gap-4">
                <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-center">
                    <p className="text-sm font-bold text-yellow-800">Upgrade Required</p>
                    <p className="text-sm text-yellow-700 mt-1">Tags Manager is available on the <b>Grow</b> plan. Please upgrade your plan to unlock tracking and analytics tags.</p>
                    <button className="mt-3 bg-primary px-4 py-2 text-xs text-white font-bold hover:opacity-80" onClick={() => navigate("/seller/loomaze-plan/deposit")}>Upgrade to Grow</button>
                </div>
             </div>
             

        )
    )
}