"use client";
import React, { useEffect, useState } from 'react'
import OurMarkets from './OurMarkets'
import RelatedProducts from './RelatedProducts'
import TentTypes from './TentTypes'
import RelatedProjects from './RelatedProjects'
import { useSearchParams } from 'next/navigation'
import { searchMarkets, searchOtherData, searchProducts } from '@/services/search'
import { loaderActions } from '@/store/loaderStore';
import { HensleyNewsSearch } from '../common/HensleyNewsSearch';

const SearchResult = ({ pageDetails }) => {

    const { relatedPostTitle, tentsTypeTitle, ourMarketsTitle, relatedProductTitle, relatedProjectTitle } = pageDetails;

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 24;

    const searchParams = useSearchParams();

    const setInitialValues = async () => {
        const [markets, products] = await Promise.all([
            searchMarkets(searchTerm),
            searchProducts({ term: searchTerm, pageLimit: pageSize })
        ]);
        setMarketsData(markets);
        setProductsData(products);
        setLoading(false);
        setTimeout(() => {
            loaderActions.hide();
        }, 500);

        const otherData = await searchOtherData(searchTerm);
        const { tents, projects, blogs } = otherData;
        setBlogsData(blogs);
        setProjectsData(projects);
        setTentsData(tents);

        setTimeout(() => {
            fetchSavedProducts();
        }, 1000);
    };

    useEffect(() => {
        if (searchTerm) {
            setInitialValues();
        } else {
            setTimeout(() => {
                loaderActions.hide();
                setLoading(false);
            }, 5000);
        }
    }, [searchTerm]);

    useEffect(() => {
        const term = searchParams.get('query') || '';
        setSearchTerm(term);
    }, [searchParams]);

    return (
        <>
            {!productsData.length && !marketsData.length && !blogsData.length && !projectsData.length && !tentsData.length && (
                <div className='h-screen flex justify-center items-center'><span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>{loading ? `Searching for results...` : "No results found"}</span></div>
            )}
            {marketsData.length > 0 && <OurMarkets pageTitle={ourMarketsTitle} data={marketsData} />}
            {productsData.length > 0 && <RelatedProducts pageTitle={relatedProductTitle} data={productsData} term={searchTerm} pageSize={pageSize} />}
            {tentsData.length > 0 && <TentTypes pageTitle={tentsTypeTitle} data={tentsData} />}
            {blogsData.length > 0 && <HensleyNewsSearch data={blogsData} pageDetails={{ hensleyNewsTitle: relatedPostTitle }} />}
            {projectsData.length > 0 && <RelatedProjects pageTitle={relatedProjectTitle} data={projectsData} />}
        </>
    )
}

export default SearchResult