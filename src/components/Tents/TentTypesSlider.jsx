"use client"

import React, { useState } from 'react'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./styles.css"
import image from '@/assets/tent-page-1.png'
import Image from "next/image"
import { PrimaryImage } from '../common/PrimaryImage'
import { generateImageURL } from '@/utils/generateImageURL'

const TentTypesSlider = ({ data }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const totalSlides = 6

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        rtl: true,
        slides: {
            perView: 1.5,
            spacing: 15,
            origin: 'center',
        },

        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        },
    })

    return (
        <>
            <div ref={sliderRef} className="lg:!hidden block keen-slider !h-[492px]">
                {data.map((item, idx) => {
                    const isActive = currentSlide % data.length === idx

                    const { tent } = item;
                    const imageURL = generateImageURL({ wix_url: tent?.mainMedia });


                    return (
                        <div key={idx} className="keen-slider__slide relative">
                            {/* <Image
                src={image}
                alt={`slide-${idx}`}
                className="h-full w-full object-contain"
              /> */}
                            <div className='w-full h-full border px-[12px] py-[12px]' >
                                <div className='w-full h-full bg-no-repeat bg-center px-[21px] py-[24px]' style={{ backgroundImage: `url(${imageURL})` }}>
                                    <div className='border-b  border-white pb-[17px] w-full'>
                                        <h3 className='w-full break-words 
                             text-[35px]
                             leading-[35px]
                            text-white font-recklessRegular uppercase'>TENSION
                                            TENTS</h3>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )
                })}

            </div>

        </>
    )
}

export default TentTypesSlider
