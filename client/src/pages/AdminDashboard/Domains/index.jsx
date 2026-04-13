import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Domains() {
    const [domains, setDomains] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [activeSearch, setActiveSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (activeSearch) {
            fetchSearchedDomains(activeSearch, page)
        } else {
            fetchDomains(page)
        }
    }, [page, activeSearch])

    const fetchDomains = (page) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/admin/domains/all?page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setDomains(data?.domains || [])
                    setTotalPages(Math.ceil(data?.totalDomains / 20))
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const fetchSearchedDomains = (text, page) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/admin/domains/search?searchText=${text}&page=${page}`)
            .then(res => {
                if (res.status === 200) {
                    setDomains(res.data?.searchedDomains || [])
                    setTotalPages(Math.ceil(res.data?.totalSearchedDomains / 20))
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleSearch = () => {
        if (!searchText) {
            setActiveSearch("")
            setPage(1)
            return
        }
        setActiveSearch(searchText)
        setPage(1)
    }

    const renderPageNumbers = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`px-3 py-1 cursor-pointer hover:!bg-[#666] hover:!text-white ${page === i ? 'bg-[var(--secondary)]/75 text-white' : 'bg-white !text-gray-700'}`}
                    onClick={() => setPage(i)}
                >
                    {i}
                </button>
            )
        }
        return pages
    }

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Domains</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>See all the domains of sellers that are active on your platform.</p>
            </div>

            <div className='admin-container'>
                <div className='flex justify-between items-center gap-5'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Admin</span> / Domains</p>

                    <div className='flex flex-1 justify-end items-center gap-2.5'>
                        <input type="text" name="searchText" id="searchText" value={searchText} placeholder='Search domain' className='w-full max-w-[250px] text-sm bg-white !px-4 !py-2 !rounded-none' onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className='text-sm text-white bg-[var(--secondary)] px-6 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70' onClick={handleSearch}>Search</button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-xs text-left rtl:text-right text-gray-600">
                        <thead className="text-[10px] text-[var(--secondary)] bg-white uppercase border-b border-gray-200">
                            <tr>
                                <th scope="col" className="font-bold px-6 py-4">#</th>
                                <th scope="col" className="font-bold px-6 py-4">Brand</th>
                                <th scope="col" className="font-bold px-6 py-4">Domain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr className='bg-white'>
                                        <td colSpan={3} className='py-20'>
                                            <div className='flex justify-center'>
                                                <div className='flex flex-col items-center gap-5'>
                                                    <span className='w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin'></span>
                                                    <p>Loading...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    domains.length > 0 ?
                                        domains.map((domain, i) => (
                                            <tr className="bg-white border-b border-gray-200">
                                                <td className="px-6 py-4">{(page - 1) * 20 + i + 1}</td>
                                                <td scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap">
                                                    <p className='text-gray-900 font-bold'>{domain.brandName}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a href={`https://${domain.domain}`} target='_blank'>{domain.domain}</a>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr className='bg-white'>
                                            <td colSpan={3} className='px-6 py-4 text-center text-red-500'>No domain found!</td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {
                    !loading &&
                    totalPages > 1 &&
                    <div className='flex flex-wrap my-8 items-center justify-center gap-1'>
                        {renderPageNumbers()}
                    </div>
                }
            </div>
        </>
    )
}