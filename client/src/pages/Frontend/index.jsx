import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Home from './Home'
import AboutUs from './AboutUs'
import ContactUs from './ContactUs'
import PrivacyPolicy from './PrivacyPolicy'
import Terms from './Terms'
import CancellationRefundPolicy from './CancellationRefundPolicy'
import OwnershipStatement from './OwnershipStatement'
import Brands from './Brands'
import JoinAsSeller from './JoinAsSeller'
import PricingPlans from '@/components/PricingPlans'
import Referral from './Referral'

export default function Frontend() {
    return (
        <>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path='home' element={<Home />} />
                <Route path='about-us' element={<AboutUs />} />
                <Route path='pricing' element={<PricingPlans />} />
                <Route path='contact-us' element={<ContactUs />} />
                <Route path='referral' element={<Referral />} />
                <Route path='privacy-policy' element={<PrivacyPolicy />} />
                <Route path='terms-and-conditions' element={<Terms />} />
                <Route path='cancellation-and-refund-policy' element={<CancellationRefundPolicy />} />
                <Route path='ownership-statement' element={<OwnershipStatement />} />
                <Route path='brands' element={<Brands />} />
                <Route path='join-as-seller' element={<JoinAsSeller />} />
            </Routes>
            <Footer />
        </>
    )
}