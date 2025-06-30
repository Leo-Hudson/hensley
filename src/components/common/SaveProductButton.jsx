import React, { useEffect, useState } from 'react'
import { PrimaryImage } from './PrimaryImage';
import { toast } from 'sonner';
import { saveProduct, unSaveProduct } from '@/services/products';
import { useCookies } from 'react-cookie';
import { lightboxActions } from '@/store/lightboxStore';
import { useSnapshot } from 'valtio';
import { actions, states } from '@/store';

export const SaveProductButton = ({ productData, type = "primary" }) => {
    const { savedProducts: savedProductsData } = useSnapshot(states);
    const [savedProducts, setSavedProducts] = useState(savedProductsData);
    const [isUpdating, setIsUpdating] = useState(false);
    const isProductSaved = savedProducts.some(savedProduct => savedProduct._id === productData._id);
    const [cookies, _setCookie] = useCookies(["authToken"]);

    const handleSaveToggle = async () => {
        if (!cookies.authToken) {
            lightboxActions.showLightBox("login");
            return;
        };
        if (isUpdating) return;

        setIsUpdating(true);
        const wasProductSaved = isProductSaved;

        if (wasProductSaved) {
            setSavedProducts(prevSaved => prevSaved.filter(savedProduct => savedProduct._id !== productData._id));
        } else {
            setSavedProducts(prevSaved => [...prevSaved, productData]);
        }

        try {
            const productId = productData.product._id;
            if (wasProductSaved) {
                await unSaveProduct(productId);
            } else {
                await saveProduct(productId);
            }
        } catch (error) {
            if (wasProductSaved) {
                setSavedProducts(prevSaved => [...prevSaved, productData]);
            } else {
                setSavedProducts(prevSaved => prevSaved.filter(savedProduct => savedProduct._id !== productData._id));
            }
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // Icon URLs
    const unSavedUrl = "https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg";
    const savedUrl = "https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg";

    useEffect(() => {
        actions.setSavedProducts(savedProducts);
    }, [savedProducts]);

    return (
        <div
            className={`flex group/cart absolute right-[24px] top-[23px] border border-secondary-alt rounded-full items-center justify-center shrink-0 cursor-pointer transition-colors w-[36px] h-[36px] ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${type === 'primary' ? 'lg:w-[56px] lg:h-[56px]' : ''}`}
            onClick={handleSaveToggle}
            role="button"
            aria-label={isProductSaved ? "Remove from saved products" : "Save product"}
            aria-disabled={isUpdating}
        >
            <PrimaryImage
                url={isProductSaved ? savedUrl : unSavedUrl}
                alt={isProductSaved ? "Saved Icon" : "Not Saved Icon"}
                customClasses={`block w-[8px] h-[12px] ${isUpdating ? '' : 'group-hover/cart:hidden'} ${type === 'primary' ? 'lg:w-[13px] lg:h-[20px]' : ''}`}
            />

            <PrimaryImage
                url={isProductSaved ? unSavedUrl : savedUrl}
                alt={isProductSaved ? "Not Saved Icon" : "Saved Icon"}
                customClasses={`hidden w-[8px] h-[12px] ${isUpdating ? '' : 'group-hover/cart:block'} ${type === 'primary' ? 'lg:w-[13px] lg:h-[20px]' : ''}`}
            />
        </div>
    );
};