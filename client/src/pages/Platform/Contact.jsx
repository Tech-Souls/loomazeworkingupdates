// /*
// settings: {
//     _id: ObjectId('698de6c907250ba0d53d9381'),
//     sellerID: ObjectId('698de6c907250ba0d53d937e'),
//     brandName: 'Seller 4 Brand',
//     brandSlug: 'seller-4-brand',
//     domain: null,
//     logo: null,
//     favicon: null,
//     theme: { primary: '#0795E6', secondary: '#000000' },
//     layout: {
//       homePageStyle: 'style1',
//       categoriesSection: 'grid',
//       showCategoriesText: true,
//       productListing: 'grid'
//     },
//     content: {
//       exploreMore: { title: null, subtitle: null, ctaLink: null, imageURL: null },
//       exploreMore2: { title: null, subtitle: null, ctaLink: null, imageURL: null },
//       topNotifications: [
//         'Get 100% Free Shipping on order above 5000',
//         'Use our coupons to get extra discounts'
//       ],
//       headerMenuName: 'Main Menu',
//       currency: 'Rs',
//       footerMenu1Name: 'Footer Menu 1',
//       footerMenu2Name: 'Footer Menu 2',
//       heroSlider: [],
//       heroSlider2: []
//     },
//     visibility: {
//       showTopNotification: true,
//       showHeroSection: true,
//       showCategories: true,
//       autoplayCategories: false,
//       autoplayCategoriesSpeed: 1,
//       showFeaturedProducts: true,
//       showExploreMore: true,
//       showReviews: true,
//       showRatings: true
//     },
//     sale: {
//       saleEndTime: null,
//       saleBoxBgColor: '#000000',
//       saleHeading: 'Hurry Up! Sale ends in',
//       saleBoxTextColor: '#ffffff'
//     },
//     shippingGap: 1,
//     deliveryGap: 3,
//     productPageVisibility: {
//       showCountDown: true,
//       showPeopleViewing: true,
//       showDeliveryDateEstimate: true,
//       showStoreServices: true
//     },
//     support: { email: null, phoneNumber: null, whatsappNumber: null },
//     socials: {
//       facebook: { show: true, link: null },
//       instagram: { show: true, link: null },
//       tiktok: { show: true, link: null },
//       x: { show: false, link: null },
//       youtube: { show: false, link: null },
//       snapchat: { show: false, link: null }
//     },
//     footerDescription: 'Get exclusive deals and great quality products from here.',
//     paymentModes: { cod: true, online: [] },
//     deliveryCharges: { amount: null, freeDeliveryAbove: null, byWeight: null },
//     trackingTags: {
//       googleAnalytics: null,
//       googleTagManager: null,
//       googleSearchConsole: null,
//       googleAdsConversion: null,
//       facebookPixel: null,
//       tiktokPixel: null,
//       pinterestTag: null
//     },
//     createdAt: ISODate('2026-02-12T14:42:17.672Z'),
//     updatedAt: ISODate('2026-02-12T14:42:17.672Z'),
//     __v: 0
//   }
// */

// // create contact form page
// import React, { useState } from 'react'
// import axios from 'axios'
// export default function Contact({ settings }) {
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [message, setMessage] = useState('')
//     const [responseMessage, setResponseMessage] = useState('')

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             const response = await axios.post('/api/contact', {
//                 name,
//                 email,
//                 message
//             })
//             setResponseMessage(response.data.message)
//             setName('')
//             setEmail('')
//             setMessage('')
//         }
//         catch (err) {
//             setResponseMessage('An error occurred. Please try again later.')
//         }
//     }

//     return (
//         <div className='contact-page' style={{ padding: '20px' }}>
//             <h1>Contact Us</h1>
//             <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>Name:</label>
//                     <input type='text' value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
//                 </div>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>Email:</label>
//                     <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
//                 </div>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>Message:</label>
//                     <textarea value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%' }} />
//                 </div>
//                 <button type='submit'>Submit</button>
//             </form>
//             {responseMessage && <p>{responseMessage}</p>}
//         </div>
//     )
// }

