import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';

// Components
import PlatformHeader from '../../components/PlatformHeader';
import ProductFooter from '../../components/ProductFooter';
import TopNotification from '../../components/TopNotification';
import Loader from '../../components/Loader';

// Pages
import Home from './Home';
import ProductPage from './ProductPage';
import ProductsPage from './Products';
import Cart from './Cart';
import Coupons from './Coupons';
import Pages from './Pages';

export default function Platform({ isCustomDomain }) {
    const { brandSlug } = useParams();
    const [settings, setSettings] = useState({});
    const [sellerDetails, setSellerDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // Dynamic variable to identify theme type
    const currentTheme = settings?.layout?.homePageStyle || 'default';

    useEffect(() => {
        fetchSellerSettings();
        return () => removeStoreTrackingTags();
    }, [brandSlug]);

    useEffect(() => {
        if (settings?.theme) {
            document.documentElement.style.setProperty("--pr", settings.theme.primary);
            document.documentElement.style.setProperty("--sec", settings.theme.secondary);
        }
    }, [settings]);

    useEffect(() => {
        if (!settings?.trackingTags) return;
        injectTrackingTags(settings.trackingTags);
        return () => removeStoreTrackingTags();
    }, [settings?.trackingTags]);

    const fetchSellerSettings = () => {
        setLoading(true);
        const currentDomain = window.location.hostname;
        let queryParams = '';

        if (isCustomDomain) {
            queryParams = `domain=${currentDomain}`;
        } else if (brandSlug) {
            queryParams = `brandSlug=${brandSlug}`;
        } else {
            return setLoading(false);
        }

        axios.get(`${import.meta.env.VITE_HOST}/platform/seller-settings/get?${queryParams}`)
            .then(res => {
                if (res.status === 200) {
                    setSettings(res.data?.settings || {});
                    setSellerDetails(res.data?.sellerDetails || {});
                }
            })
            .catch(err => {
                console.error('Frontend GET error', err.message);
                if (err.response?.status === 404) {
                    window.toastify?.('Store not found', 'error');
                }
            })
            .finally(() => setLoading(false));
    };

    const getInjectionTarget = (tagKey) => {
        const headTags = ['googleSearchConsole', 'googleAnalytics', 'googleTagManager'];
        const bodyTags = ['facebookPixel', 'tiktokPixel', 'pinterestTag', 'googleAdsConversion'];
        if (headTags.includes(tagKey)) return document.head;
        if (bodyTags.includes(tagKey)) return document.body;
        return document.head;
    };

    const injectTrackingTags = (tagsObj) => {
        if (!tagsObj || typeof tagsObj !== 'object') return;
        removeStoreTrackingTags();

        Object.entries(tagsObj).forEach(([key, tagCode]) => {
            if (!tagCode || typeof tagCode !== "string" || !tagCode.trim()) return;
            try {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = tagCode.trim();
                const target = getInjectionTarget(key);
                if (!target) return;

                Array.from(tempDiv.childNodes).forEach(node => {
                    if (node.nodeType === 1) {
                        const element = node.cloneNode(true);
                        element.setAttribute("data-store-tag", key);

                        if (element.tagName === "SCRIPT") {
                            const newScript = document.createElement("script");
                            Array.from(element.attributes).forEach(attr => {
                                if (attr.name !== 'data-store-tag') newScript.setAttribute(attr.name, attr.value);
                            });
                            if (element.textContent) newScript.textContent = element.textContent;
                            newScript.setAttribute("data-store-tag", key);
                            target.appendChild(newScript);
                        } else {
                            target.appendChild(element);
                        }
                    }
                });
            } catch (error) {
                console.error(`Error injecting ${key} tag:`, error);
            }
        });
    };

    const removeStoreTrackingTags = () => {
        const storeTags = document.querySelectorAll('[data-store-tag]');
        storeTags.forEach(tag => {
            try { tag.remove(); } catch {}
        });
    };

    if (loading) return <Loader />;

    if (!settings?._id) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
                    <p className="text-gray-600">This store doesn't exist or is not configured yet.</p>
                </div>
            </div>
        );
    }

    if (sellerDetails?.status !== "approved") {
        const status = sellerDetails?.status || "pending";
        return (
            <div className="flex items-center justify-center min-h-screen text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Store Status: {status}</h1>
                    <p className="text-gray-600">Please contact administration.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {settings?.visibility?.showTopNotification && (
                <TopNotification notifications={settings.content?.topNotifications} />
            )}

            {/* Passing themeType prop so PlatformHeader can change its look internally */}
            <PlatformHeader 
                settings={settings} 
                isCustomDomain={isCustomDomain} 
                themeType={currentTheme}
            />

            <Routes>
                <Route index element={<Home settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='home' element={<Home settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='pages/:page' element={<Pages settings={settings} />} />
                <Route path='product/:productSlug' element={<ProductPage settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='pages/products' element={<ProductsPage settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='pages/products/:category' element={<ProductsPage settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='cart' element={<Cart settings={settings} isCustomDomain={isCustomDomain} />} />
                <Route path='coupons' element={<Coupons settings={settings} />} />
            </Routes>
            
            {/* Passing themeType prop so ProductFooter can change its look internally */}
            <ProductFooter 
                settings={settings} 
                isCustomDomain={isCustomDomain} 
                themeType={currentTheme}
            />
        </>
    );
}