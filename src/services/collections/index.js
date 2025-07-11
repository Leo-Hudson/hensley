"use server";
import { findSortIndexByCategory, logError } from "@/utils";
import { fetchCategoriesData } from "../products";
import { fetchOurCategoriesData } from "..";
import queryCollection from "@/utils/fetchFunction";


export const fetchCategoryPageDetails = async () => {
    try {
        const pageDetails = await queryCollection({ dataCollectionId: "categoryPageDetails" });

        if (!Array.isArray(pageDetails.items)) {
            throw new Error(`PrivacyPolicy response does not contain items array`);
        }

        return pageDetails.items[0]

    } catch (error) {
        logError(`Error fetching contact page data: ${error.message}`, error);
    }
};


export const fetchSelectedCollectionData = async (slug) => {
    try {
        const [ourCategoriesData, categoriesData, categoriesSortData, productBannersData, pageDetails] = await Promise.all([
            fetchOurCategoriesData(),
            fetchCategoriesData(),
            fetchCategoriesSortStructure(),
            fetchProductBannersData(),
            fetchCategoryPageDetails()
        ]);

        const selectedCategory = categoriesData.find(category => category.slug === slug);
        if (!selectedCategory) {
            throw new Error(`Category with slug "${slug}" not found`);
        }

        const subCategoriesData = await fetchSubcategoriesData(selectedCategory._id);
        const subCategories = subCategoriesData?.subcategories || [];
        const collectionIds = [selectedCategory._id, ...subCategories.map(item => item._id)];
        const sortIndex = findSortIndexByCategory(categoriesSortData, selectedCategory._id);

        const sortedProducts = await fetchSortedProducts({
            collectionIds,
            limit: 12,
            skip: 0,
            sortIndex
        });

        const data = {
            selectedCategory,
            ourCategoriesData,
            subCategories,
            categoriesSortData,
            productBannersData,
            collectionIds,
            sortIndex,
            sortedProducts,
            pageDetails
        }

        return data;
    } catch (error) {
        logError(`Error fetching selected collection data: ${error.message}`, error);
    }
}

export const fetchSubcategoriesData = async (categoryId) => {
    try {
        const response = await queryCollection({
            dataCollectionId: "CategoriesStructure",
            includeReferencedItems: ["subcategories"],
            eq: [
                {
                    key: "category",
                    value: categoryId
                }
            ]
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items[0];
    } catch (error) {
        logError(`Error fetching subcategories data: ${error.message}`, error);
    }
}

export const fetchCategoriesSortStructure = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "CategorySortStructure",
            limit: 1000,
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items;
    } catch (error) {
        logError(`Error fetching category sort structure: ${error.message}`, error);
    }
}

export const fetchProductBannersData = async () => {
    try {
        const response = await queryCollection({
            dataCollectionId: "PRODUCTSUBCATEGORYBANNERS",
        });
        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return response.items;
    } catch (error) {
        logError(`Error fetching product banners data: ${error.message}`, error);
    }
}

export const fetchSortedProducts = async ({ collectionIds = [], limit = 12, skip = 0, sortIndex }) => {
    try {
        const payload = {
            dataCollectionId: "FullProductData",
            includeReferencedItems: ["product", "mainCategory"],
            limit,
            skip
        };

        if(collectionIds.length > 0) {
            payload.hasSome = [
                {
                    key: "categories",
                    values: collectionIds
                }
            ];
        }

        if (sortIndex) {
            payload.sortKey = sortIndex;
        }

        const response = await queryCollection(payload);

        if (!Array.isArray(response.items)) {
            throw new Error(`Response does not contain items array`);
        }
        return {
            items: response.items,
            hasNext: response.paging.hasNext
        };

    } catch (error) {
        logError(`Error fetching sorted products data: ${error.message}`, error);
    }
};

export const fetchCollectionPagePaths = async () => {
    try {
        const tentId = "d27f504d-05a2-ec30-c018-cc403e815bfa";

        const [collectionsData, customCollectionsData] = await Promise.all([
            queryCollection({
                dataCollectionId: "OurCategories",
                includeReferencedItems: ["categories"],
                ne: [{ key: "categories", value: tentId }]
            }),
            queryCollection({
                dataCollectionId: "HeaderMegaMenu",
                includeReferencedItems: ["category"],
                eq: [{ key: "redirection", value: "/collections" }]
            }),
        ]);

        // Extract slugs with a single helper function
        const extractSlug = (item, property) => {
            const slug = item[property]?.slug;
            return slug ? { slug: slug.trim().replace("/", "") } : null;
        };

        // Process both collections in one pass and filter out nulls
        const params = [
            ...customCollectionsData.items.map(item => extractSlug(item, 'category')),
            ...collectionsData.items.map(item => extractSlug(item, 'categories'))
        ].filter(Boolean);

        return params;
    } catch (error) {
        logError(`Error fetching collection page params: ${error.message}`, error);
        return []; // Return empty array on error instead of undefined
    }
};