import React from 'react'
import { PrimaryImage } from './PrimaryImage';
import { PrimaryButton } from './PrimaryButton';
import { CustomLink } from './CustomLink';

export const Banner = ({ data }) => {
    const { backgroundImage, title, subtitle, buttonLabel, mobileImage, buttonLink } = data;
    return (
        <div className='relative banner lg:h-[125vh] h-[100vh] lg:p-6 border border-primary-border'>
            <div className='absolute lg:inset-6 inset-0 bg-[#babab2]'>
                <PrimaryImage timeout={0} url={backgroundImage} alt={title} fit='fit' customClasses="hidden lg:block border border-primary-border h-full w-full object-cover" />
                <PrimaryImage timeout={0} url={mobileImage} alt={title} fit='fit' customClasses="lg:hidden border border-primary-border h-full w-full object-contain object-[center_250px]" />
            </div>
            <div className="absolute inset-0 lg:px-44 py-24 lg:py-20 flex justify-center lg:block">
                <div className='flex flex-col lg:justify-start justify-between max-w-xs lg:max-w-sm gap-4 lg:gap-6 items-center lg:items-start'>
                    <span className="text-center lg:block hidden lg:text-start  text-[14px] lg:text-[24px] leading-4 lg:leading-10 font-haasRegular text-white">{subtitle}</span>
                    <h2 className="text-center lg:block hidden  lg:text-start text-[55px] lg:text-[120px] xl:text-[140px] leading-[55px] lg:leading-[140px] font-recklessRegular text-white">{title}</h2>
                    <div className='lg:hidden flex flex-col gap-y-[20px]'>
                        <span className="text-center  lg:text-start block text-[14px] lg:text-[24px] leading-4 lg:leading-10 font-haasRegular text-primary-alt">{subtitle}</span>
                        <h2 className="text-center block lg:text-start text-[55px] lg:text-[120px] xl:text-[140px] leading-[55px] lg:leading-[140px] font-recklessRegular text-white">{title}</h2>
                    </div>
                    <CustomLink to={buttonLink}>
                        <PrimaryButton className=" font-haasRegular border border-white text-white hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">{buttonLabel}</PrimaryButton>
                    </CustomLink>
                </div>
            </div>
        </div>
    )
}
