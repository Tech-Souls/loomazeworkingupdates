import React from 'react'

export default function OwnershipStatement() {
    return (
        <>
            <div className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-6">
                <h2 className="text-2xl sm:text-3xl text-center font-bold">Ownership Statement</h2>
            </div>
            <section className="bg-white py-12">
                <div className="w-full max-w-4xl mx-auto px-2">
                    <div className="space-y-6">
                        <div className="cms space-y-4 text-[var(--text)]">
                            <h3 className="!text-xl sm:!text-3xl font-medium">Ownership Statement for Loomaze</h3>

                            <div>
                                <p>Loomaze.com is owned and operated by <strong>Loomaze</strong></p>
                                <ul className='my-2 list-disc'>
                                    <li className='ml-4'>Loomaze owns the platform software, branding, and technology</li>
                                    <li className='ml-4'>Merchants retain ownership of their stores, content, and customer data</li>
                                    <li className='ml-4'>Loomaze does not claim ownership of any products sold via merchant stores</li>
                                </ul>
                            </div>

                            <h3 className="!text-xl sm:!text-3xl font-medium pt-2.5">Payment Gateway Disclosure</h3>

                            <div>
                                <p>Loomaze collects payments <strong>only for subscription services.</strong></p>
                                <p>Loomaze <strong>does not process or control end-customer payments</strong> on merchant websites.</p>
                                <p className='mt-2.5'>All product transactions are handled directly between merchants and their customers usingmerchant-chosen payment gateways.</p>
                            </div>

                            <h3 className="!text-xl sm:!text-3xl font-medium pt-2.5">Contact Information</h3>

                            <div>
                                <p><strong>Email:</strong> support@loomaze.com</p>
                                <p><strong>Website:</strong> www.loomaze.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}