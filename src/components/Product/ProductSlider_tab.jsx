"use client"

import React, { useMemo, useState, useCallback } from 'react'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { PrimaryImage } from '../common/PrimaryImage'

const ProductSlider_tab = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const mediaItems = useMemo(() => product?.mediaItems || [], [product?.mediaItems])

  const sliderConfig = useMemo(() => ({
    loop: true,
    slides: {
      perView: product.length >= 3 ? 2.4 : 2,
      spacing: 10,
      origin: product.length >= 3 ? 'center' : 'auto',
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1,
          spacing: 10,
          origin: 'center',
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  }), [])

  const [sliderRef, instanceRef] = useKeenSlider(sliderConfig)


  const handleDotClick = useCallback((idx) => {
    instanceRef.current?.moveToIdx(idx)
  }, [instanceRef])


  const slideItems = useMemo(() =>
    mediaItems.map((slide, idx) => {
      return (
        <div key={`slide-${idx}`} className="keen-slider__slide relative bg-white">
          <PrimaryImage
            min_h={200}
            min_w={200}
            fit='fit'
            url={slide.src}
            alt={`Product image ${idx + 1}`}
            customClasses="h-full w-full object-contain p-4"
          />
        </div>
      )
    }), [mediaItems, currentSlide]);

  const dots = useMemo(() => {
    if (!loaded || !mediaItems.length) return null

    return (
      <div className="sm:hidden flex justify-center mt-4 gap-2">
        {mediaItems.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx
              ? 'bg-black scale-110'
              : 'bg-white border border-black'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    )
  }, [loaded, mediaItems, currentSlide, handleDotClick]);

  return (
    <>
      <div ref={sliderRef} className="lg:!hidden block keen-slider h-[492px]">
        {slideItems}
      </div>
      {dots}
    </>
  )
}

export default ProductSlider_tab;