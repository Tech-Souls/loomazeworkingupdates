import React from 'react'
import ProductBox from '../ProductBox';
import ProductBoxTwo from '../ProductBoxTwo';
import ProductBoxThree from '../ProductBoxThree';
import ProductBoxJewellery from '../ProductBoxJewellery';
import ProductBoxFashion from '../ProductBoxFashion';

export default function ProductBoughtTogether({ settings, products }) {
    const style = settings?.layout?.homePageStyle

    const productBoxComponents = {
        style1: ProductBox,
        style2: ProductBoxTwo,
        style3: ProductBoxThree,
        jewellery: ProductBoxJewellery,
        fashion: ProductBoxFashion,
    };

    const ProductBoxComponent = productBoxComponents[style] || null;

    return (
        <div>
            <section className=' py-12 '>
                <div className="main-container realtive px-4">
                    <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-4 '>
                        <h1 className="head font-bold text-xl sm:text-2xl md:text-3xl text-[var(--text)] ">
                            Frequently Bought Together
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products?.map((item, idx) => (
                            ProductBoxComponent && <ProductBoxComponent item={item} idx={idx} settings={settings} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}