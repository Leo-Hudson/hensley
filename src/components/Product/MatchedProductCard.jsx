import React from 'react';
import { copyToClipboard } from '@/utils';
import { CopyIcon } from '../common/helpers/CopyIcon';
import { PrimaryImage } from '../common/PrimaryImage';
import { CustomLink } from '../common/CustomLink';
import { lightboxActions } from '@/store/lightboxStore';
import { SaveProductButton } from '../common/SaveProductButton';
import { actions } from '@/store';

function MatchedProductCard({ data, type = 'listing' }) {
    const { product } = data;
    const { mainMedia, name, slug, sku, additionalInfoSections } = product;

    const handleAddToCart = () => {
        const isTent = actions.isTentProduct(product._id);
        lightboxActions.setAddToCartModal({ open: true, type: isTent ? 'tent' : 'product', productData: data });
    }
    return (
        <div className={`relative w-full max-w-[436px] group transition-all duration-300 ease-in-out border border-primary-border flex flex-col p-2 justify-between h-full ${type !== 'listing' ? 'bg-white col-span-1.5 md:col-span-2' : ''}`}>
            <CustomLink to={`/product/${slug}`} className={`h-full overflow-hidden flex justify-center items-center p-10 ${type === 'listing' ? 'bg-white' : ''}`}>
                <PrimaryImage timeout={50} alt={name} url={mainMedia} fit='fit' customClasses={"min-h-[217px] md:min-h-[263px] 2xl:min-h-[515px] max-h-[550px] h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"} />
            </CustomLink>

            <div className="max-w-full flex-wrap pt-2 lg:pt-6 lg:pb-2">
                <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular">
                    {name}
                </h2>

                <div className="mt-1 w-full flex flex-col 2xl:flex-row justify-between items-center gap-4">
                    <div className='2xl:w-2/3 w-full grow flex lg:flex-row justify-start flex-wrap items-center gap-2'>
                        {sku && (
                            <div onClick={() => copyToClipboard(sku)} className="flex justify-center items-center">
                                <span className="text-[12px] text-secondary-alt mr-[8px] word-break">{sku}</span>
                                <CopyIcon />
                            </div>
                        )}
                        {additionalInfoSections?.map((data, index) => {
                            const { title, description } = data;
                            if (title == "Size") {
                                return (
                                    <div
                                        className="text-[12px] grow text-center text-secondary-alt"
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    ></div>
                                );
                            }
                        })}
                    </div>

                    <button
                        className="w-full 2xl:w-auto min-w-[151px] border border-secondary-alt flex items-center justify-between 2xl:justify-center bg-primary px-4 py-3 gap-x-7"
                        onClick={handleAddToCart}
                    >
                        <span className="uppercase font-haasRegular text-[12px]">add to cart</span>
                        <svg className='rotate-45 size-3 group-hover:scale-125 transition-all duration-300 ease-in-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            <SaveProductButton productData={data} />
        </div>
    );
}

export default MatchedProductCard;
