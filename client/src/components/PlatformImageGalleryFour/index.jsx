import React, { useEffect, useState } from 'react'
import { Image } from 'antd'
import { LiaPlusSolid } from "react-icons/lia";
import axios from 'axios';

export default function PlatformImageGalleryFour({ settings }) {

    const demoGallery = [
  {
    _id: "img1",
    imageURL: "https://cdn.loomaze.com/uploads/headphones.jpg"
  },
  {
    _id: "img2",
    imageURL: "https://cdn.loomaze.com/uploads/smartwatch.jpg"
  },
  {
    _id: "img3",
    imageURL: "https://cdn.loomaze.com/uploads/running-shoes.jpg"
  },
  {
    _id: "img4",
    imageURL: "https://cdn.loomaze.com/uploads/wallet.jpg"
  },
  {
    _id: "img5",
    imageURL: "https://cdn.loomaze.com/uploads/coffee-maker.jpg"
  },
  {
    _id: "img6",
    imageURL: "https://cdn.loomaze.com/uploads/toy-car.jpg"
  },
  {
    _id: "img7",
    imageURL: "https://cdn.loomaze.com/uploads/yoga-mat.jpg"
  },
  {
    _id: "img8",
    imageURL: "https://cdn.loomaze.com/uploads/cookbook.jpg"
  },
  {
    _id: "img9",
    imageURL: "https://cdn.loomaze.com/uploads/phone-case.jpg"
  },
  {
    _id: "img10",
    imageURL: "https://cdn.loomaze.com/uploads/sunglasses.jpg"
  }
];

    const [gallery, setGallery] = useState(demoGallery)
    const [filteredGallery, setFilteredGallery] = useState(gallery)
    // const [showPlus, setShowPlus] = useState(true)
    const [showPlus, setShowPlus] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if (!settings.sellerID) return
        fetchPlatformHomeImageGallery()
    }, [settings])

    const fetchPlatformHomeImageGallery = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-image-gallery?sellerID=${settings?.sellerID}`)
            .then(res => {
                if (res.status === 200 && res.data?.gallery?.length > 0) {
                    setGallery(res.data?.gallery)
                    setFilteredGallery(res.data?.gallery?.slice(0, 5))
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    return (
        <div className='px-3'>
            <h2 className='text-2xl text-center'>#Image Gallery</h2>
            <p className='text-sm text-gray-700 text-center my-3'>Look at the collections we got for you</p>

            {loading ?
                <p className='text-center'>Loading...</p>
                :
                <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mt-8'>
                    {filteredGallery.map((img, i) => (
                        <Image key={img._id} src={`${img.imageURL}`} alt={`galler-image-${i}`} loading='lazy' className='aspect-4/4 object-cover' />
                    ))
                    }
                </div>
            }

            {(gallery.length > 5 && showPlus) &&
                <div className='flex justify-center mt-8'>
                    <LiaPlusSolid className='text-5xl cursor-pointer'
                        onClick={() => {
                            setShowPlus(false)
                            setFilteredGallery(gallery)
                        }}
                    />
                </div>
            }
        </div>
    )
}