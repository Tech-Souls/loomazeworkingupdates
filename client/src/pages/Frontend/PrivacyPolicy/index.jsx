import React from 'react'

export default function PrivacyPolicy() {
    return (
        <>
            <div className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-6">
                <h2 className="text-2xl sm:text-3xl text-center font-bold">Privacy Policy</h2>
            </div>
            <section className="bg-white py-12">
                <div className="w-full max-w-4xl mx-auto px-2">
                    <div className="space-y-6">
                        <div className="cms space-y-4 text-[var(--text)]">
                            <h3 className="!text-xl sm:!text-3xl font-medium">Privacy Policy for Loomaze</h3>

                            <p>Welcome to Loomaze.com (“Loomaze”, “we”, “our”, “us”). Loomaze is a SaaS e-commerce platform that enables businesses to create, manage, and operate their own independent online stores.</p>

                            <div>
                                <h4>1. Information We Collect</h4>
                                <p className='py-2'>We may collect:</p>
                                <ul className='list-disc'>
                                    <li className='ml-4'>Account and business information (name, email, phone, business details)</li>
                                    <li className='ml-4'>Billing information for subscription plans</li>
                                    <li className='ml-4'>Platform usage data and logs</li>
                                    <li className='ml-4'>Technical data (IP address, device and browser information)</li>
                                </ul>
                                <p className='my-2 font-bold'>Loomaze does not collect, store, or process customer payment information related to product sales.</p>
                            </div>

                            <div>
                                <h4>2. How We Use Information</h4>
                                <p className='py-2'>Information is used to:</p>
                                <ul className='list-disc'>
                                    <li className='ml-4'>Create and manage user accounts</li>
                                    <li className='ml-4'>Provide platform features and support</li>
                                    <li className='ml-4'>Process subscription payments</li>
                                    <li className='ml-4'>Improve platform performance and security</li>
                                    <li className='ml-4'>Comply with legal obligations</li>
                                </ul>
                            </div>

                            <div>
                                <h4>3. Payments</h4>
                                <p className='py-2'>Subscription payments are processed through
                                    {" "}<strong>secure third-party payment gateways.</strong>{" "}
                                    Loomaze does not store card or banking details.
                                </p>
                            </div>
                            
                            <div>
                                <h4>4. Data Protection</h4>
                                <p className='py-2'>We apply industry-standard security measures to safeguard platform and user data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}