import React from 'react'
import serviceImg from '../../assets/images/seller-services.webp'

export default function JoinAsSellerServices() {
    return (
        <div className='flex flex-col md:flex-row justify-between items-center gap-10 w-full max-w-5xl mx-auto px-3 sm:px-8 py-12 sm:py-24'>
            <div className='flex-1'>
                <p className='font-bold text-3xl'>Sell on loomaze</p>
                <p className='text-sm text-gray-900 mt-2 mb-12'>Reach millions of buyers globally.</p>

                <div className='flex flex-col gap-10'>
                    <div className='flex gap-2'>
                        <div className='w-4 h-4 bg-[var(--primary)] rounded-full'></div>
                        <div>
                            <p className='text-gray-900 font-bold leading-none'>Grow your business</p>
                            <p className='text-gray-900 mt-1.5'>Sell to buyers anytime, anywhere</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div className='w-4 h-4 bg-[var(--primary)] rounded-full'></div>
                        <div>
                            <p className='text-gray-900 font-bold leading-none'>Zero cost</p>
                            <p className='text-gray-900 mt-1.5'>No commission or transaction fee</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div className='w-4 h-4 bg-[var(--primary)] rounded-full'></div>
                        <div>
                            <p className='text-gray-900 font-bold leading-none'>Manage your business better</p>
                            <p className='text-gray-900 mt-1.5'>Lead Management System & other features</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='relative w-full max-w-[450px]'>
                <img src={serviceImg} alt="seller-services" className='w-full rounded-2xl' />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
        </div>
    )
}