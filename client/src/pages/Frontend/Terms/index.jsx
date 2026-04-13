import React from 'react'

export default function Terms() {
    return (
        <>
            <div className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-6">
                <h2 className="text-2xl sm:text-3xl text-center font-bold">Terms and Conditions</h2>
            </div>
            <section className="bg-white py-12">
                <div className="w-full max-w-4xl mx-auto px-2">
                    <div className="space-y-6">
                        <div className="cms space-y-4 text-[var(--text)]">
                            <h3 className="!text-xl sm:!text-3xl font-medium">Terms and Conditions for Loomaze</h3>

                            <p>By using <strong>Loomaze.com</strong>, you agree to the following terms:</p>

                            <div>
                                <h4>1. Platform Description</h4>
                                <p className='py-2'>Loomaze is a <strong>technology platform</strong> that provides tools for building and running online stores.
                                    Loomaze is <strong>not a marketplace</strong> and <strong>does not participate in product sales.</strong>
                                </p>
                            </div>

                            <div>
                                <h4>2. Merchant Responsibilities</h4>
                                <p className='py-2'>Merchants using Loomaze:</p>
                                <ul className='list-disc'>
                                    <li className='ml-4'>Own and operate their stores independently</li>
                                    <li className='ml-4'>Are responsible for products, pricing, content, and legal compliance</li>
                                    <li className='ml-4'>Handle customer payments, shipping, refunds, and disputes</li>
                                    <li className='ml-4'>Must integrate their own payment gateway</li>
                                </ul>
                            </div>

                            <div>
                                <h4>3. Subscription & Fees</h4>
                                <ul className='mt-2 list-disc'>
                                    <li className='ml-4'>Loomaze charges recurring subscription fees for platform access</li>
                                    <li className='ml-4'>Fees are billed monthly or annually</li>
                                    <li className='ml-4'>Non-payment may result in account suspension</li>
                                </ul>
                            </div>

                            <div>
                                <h4>4. Prohibited Activities</h4>
                                <p className='py-2'>Merchants may not use Loomaze for:</p>
                                <ul className='mt-2 list-disc'>
                                    <li className='ml-4'>Illegal or restricted products</li>
                                    <li className='ml-4'>Fraudulent activities</li>
                                    <li className='ml-4'>Intellectual property violations</li>
                                </ul>
                            </div>

                            <div>
                                <h4>5. Limitation of Liability</h4>
                                <p className='py-2'>Loomaze is not liable for merchant-customer disputes, product quality, or transaction failures on merchant stores</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}