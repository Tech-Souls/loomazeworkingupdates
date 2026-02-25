import React from 'react'
import SellerTopNotificationsUpdate from '../../../../../components/SellerTopNotificationsUpdate'
import SellerCurrencyUpdate from '../../../../../components/SellerCurrencyUpdate'
import SellerHeroSectionContentUpdate from '../../../../../components/SellerHeroSectionContentUpdate'
import SellerHeroSection2ContentUpdate from '../../../../../components/SellerHeroSection2ContentUpdate'
import SellerExploreMoreContentUpdate from '../../../../../components/SellerExploreMoreContentUpdate'

export default function Content({ user, settings, setSettings }) {
    return (
        <div>
            <h1 className='text-[#333]'>Content Settings</h1>
            <p className='w-fit px-2 py-1 text-xs font-bold  bg-yellow-50 text-yellow-600 rounded-md mt-1'>All these settings will be applied on your home page content</p>

            <SellerCurrencyUpdate user={user} settings={settings} setSettings={setSettings} />
            <SellerTopNotificationsUpdate user={user} settings={settings} setSettings={setSettings} />
            <SellerHeroSectionContentUpdate user={user} settings={settings} />
            {settings?.layout?.homePageStyle == "jewellery" && <SellerHeroSection2ContentUpdate user={user} settings={settings} />}
            <SellerExploreMoreContentUpdate user={user} settings={settings} />
        </div>
    )
}