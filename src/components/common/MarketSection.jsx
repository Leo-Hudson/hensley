import React from 'react'
import SectionTitle from './SectionTitle'
import { MarketCard } from './MarketCard'

export const MarketSection = ({ data, pageDetails, classes }) => {
  
  const { marketsTitle } = pageDetails
  return (
    <div className='w-full bg-secondary-alt'>
      <div className='sm:px-0 px-[12px] flex items-center flex-col'>
        <SectionTitle text={marketsTitle} classes="py-[40px] md:mt-6 lg:mt-0 !text-white" />
      </div>
      <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-6 p-6 pb-20'>
        {data.map((item, index) => (
          <MarketCard classes={classes} key={index} data={item} size={"large"} />
        ))}
      </div>
    </div>
  )
}
