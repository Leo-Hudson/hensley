import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import { formatDate } from '@/utils';
import { MarketsStudiosTags } from './MarketsStudiosTags';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';

function BlogCard({ data, handleFilterChange, selectedTags }) {
    const { slug, author, blogRef, markets, studios, blogCategories } = data;

    const arrowImageUrl = "https://static.wixstatic.com/media/0e0ac5_87d58241be704c008a2500d6691fb318~mv2.png";
    const redirectWithLoader = useRedirectWithLoader();

    const handleRedirection = () => {
        redirectWithLoader(`/posts/${slug}`);
    }

    return (
        <div onClick={handleRedirection} className="relative group border border-primary-border pb-6 cursor-pointer">
            <PrimaryImage
                alt={blogRef.title}
                url={blogRef.coverImage}
                customClasses="h-full w-full object-cover min-h-[528px] max-h-[528px]"
            />


            <div className='w-full flex gap-1 p-6 pb-0'>
                <div className='grow'>
                    <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular mb-3">
                        {blogRef.title}
                    </h2>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <PrimaryImage
                        url={arrowImageUrl}
                        alt="Arrow"
                        customClasses="h-[20px] group-hover:lg:h-[44px] object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            <div className='px-6'>
                <p className='text-[12px] leading-[20px] text-secondary-alt font-haasRegular mb-3'>
                    {formatDate(blogRef.publishedDate)} - {author?.nickname || author?.firstName || author?.lastName}
                </p>

                <MarketsStudiosTags markets={markets} studios={studios} categories={blogCategories} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
            </div>
        </div>
    );
}

export default BlogCard;
