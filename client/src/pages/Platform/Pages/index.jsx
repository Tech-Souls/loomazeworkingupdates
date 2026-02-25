// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import Loader from '../../../components/Loader'

// export default function Pages({ settings }) {
//     const { page } = useParams()
//     const [pageData, setPageData] = useState({})
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!settings?.sellerID) return;

//         const fetchPageData = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(`${import.meta.env.VITE_HOST}/platform/pages/fetch-page?sellerID=${settings.sellerID}&page=${page}`);
//                 if (res.status === 200) {
//                     setPageData(res.data.pageData);
//                 }
//             } catch (err) {
//                 console.error("Fetch page error:", err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPageData();
//     }, [settings?.sellerID]);

//     const decodeHTML = (html) => {
//         const txt = document.createElement("textarea");
//         txt.innerHTML = html;
//         return txt.value;
//     };

//     if (loading) return <Loader />

//     console.log("Page Data: ", pageData)
//     return (
//         <div className='w-full max-w-5xl mx-auto min-h-[calc(100vh-100px)] px-2.5 sm:px-3 py-10 sm:py-16 md:py-20'>
//             {(!loading && !pageData?.title)
//                 ?
//                 <h2 className='text-3xl text-center'>Page Not Found</h2>
//                 :
//                 <>
//                     <h2 className='text-3xl text-center'>{pageData?.title}</h2>
//                     <div dangerouslySetInnerHTML={{ __html: pageData?.content }}></div>
//                 </>
//             }
//         </div>
//     )
// }

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../components/Loader';

export default function Pages({ settings }) {
    const { page } = useParams();
    const [pageData, setPageData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!settings?.sellerID) return;

        const fetchPageData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_HOST}/platform/pages/fetch-page?sellerID=${settings.sellerID}&page=${page}`);
                if (res.status === 200) {
                    const decodedContent = decodeHTML(res.data.pageData.content || '');
                    setPageData({ ...res.data.pageData, content: decodedContent });
                }
            } catch (err) {
                console.error("Fetch page error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [settings?.sellerID]);

    const decodeHTML = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    if (loading) return <Loader />;

    return (
        <div className='w-full max-w-5xl mx-auto min-h-[calc(100vh-100px)] px-2.5 sm:px-3 py-10 sm:py-16 md:py-20'>
            {(!loading && !pageData?.title)
                ? <h2 className='text-3xl text-center'>Page Not Found</h2>
                : <>
                    <h2 className='text-3xl text-center'>{pageData?.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: pageData?.content }}></div>
                </>
            }
        </div>
    );
}
