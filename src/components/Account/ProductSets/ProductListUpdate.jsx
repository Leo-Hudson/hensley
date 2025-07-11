'use client'
import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { PrimaryImage } from '@/components/common/PrimaryImage';
import { toInteger } from 'lodash';
import { CustomDropdown } from '@/components/common/CustomDropdown';
import { deleteProductSet, updateProductSet } from '@/services/admin';
import { logError } from '@/utils';

const ProductCard = memo(({ item, onRemove, isLastOdd, handleQuantityChange }) => {
    const { product, quantity } = item;
    const [quantityValue, setQuantityValue] = useState(quantity);

    const handleQuantity = useCallback((e) => {
        const value = e.target.value;
        setQuantityValue(e.target.value);
        handleQuantityChange(product._id, value);
    }, []);

    const handleRemoveClick = useCallback(() => {
        onRemove(product._id);
    }, [onRemove, product._id]);

    return (
        <div className={`border text-left border-primary-border flex flex-col gap-y-[10px] p-[10px] ${isLastOdd ? 'mx-auto md:w-1/2' : ''}`}>
            <div className='flex justify-between'>
                <span className='font-haasRegular text-secondary-alt uppercase text-[16px] block'>
                    {product.name}
                </span>
                <button
                    onClick={handleRemoveClick}
                    className='flex items-center justify-center rounded-full w-[25px] h-[25px] border border-primary-border transform transition-all duration-300 group cursor-pointer hover:bg-secondary-alt flex-shrink-0 p-[2px]'
                    aria-label={`Remove ${product.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="18" width="18" className='group-hover:hidden' fill="black">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="18" width="18" className="hidden group-hover:block fill-white">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex gap-x-[10px] items-center'>
                <label className='font-haasRegular text-secondary-alt uppercase block text-[16px]'>
                    quantity
                </label>
                <input
                    type="number"
                    value={quantityValue}
                    onChange={handleQuantity}
                    className="w-[60px] h-[30px] p-2 bg-transparent border border-primary-border outline-none text-center"
                    min="1"
                    aria-label="Product quantity"
                />
            </div>
        </div>
    );
});

const BackButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-9 left-0 cursor-pointer"
        aria-label="Go back to product list"
    >
        <svg
            data-bbox="63 62.951 74.049 74.049"
            viewBox="0 0 200 200"
            height="57"
            width="57"
            xmlns="http://www.w3.org/2000/svg"
            data-type="shape"
            style={{ transform: "rotate(45deg)" }}
        >
            <g>
                <path d="M137 133a4 4 0 0 1-4 4H67c-.263 0-.525-.027-.783-.079-.117-.023-.225-.067-.339-.1-.137-.04-.275-.072-.408-.127-.133-.055-.253-.131-.379-.199-.103-.057-.211-.102-.309-.168a4.023 4.023 0 0 1-1.109-1.109c-.065-.097-.109-.203-.165-.304-.07-.127-.146-.25-.202-.384-.055-.132-.086-.271-.126-.407-.033-.113-.077-.222-.101-.339A4.056 4.056 0 0 1 63 133V67a4 4 0 0 1 8 0v56.344l59.172-59.172a4 4 0 1 1 5.656 5.656L76.656 129H133a4 4 0 0 1 4 4z"></path>
            </g>
        </svg>
    </button>
));

const ProductListUpdate = ({ toggleToList, activeProduct, productOptions, setProductSets }) => {
    const { product, setOfProduct } = activeProduct;
    const [productSetItems, setProductSetItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [removedItems, setRemovedItems] = useState([]);

    const handleRemove = useCallback((id) => {
        setRemovedItems(prev => prev.includes(id) ? prev : [...prev, id]);
        setProductSetItems(prev => prev.filter(({ product }) => product._id !== id));
    }, []);

    const handleQuantityChange = useCallback((id, quantity) => {
        setProductSetItems(prev => prev.map(item => item.product._id === id ? { ...item, quantity: toInteger(quantity) } : item));
    }, []);

    const handleDelete = useCallback(async () => {
        if (!activeProduct) return;
        setIsDeleting(true);
        try {
            const setData = { mainProduct: activeProduct, productSetItems };
            await deleteProductSet(setData);
            setProductSets(prev => prev.filter(item => item._id !== activeProduct._id));
            toggleToList();
        } catch (error) {
            logError(error);
        } finally {
            setIsDeleting(false);
        }
    }, [activeProduct, productSetItems]);

    const handleUpdate = useCallback(async () => {
        if (!activeProduct) return;
        try {
            setIsLoading(true);
            const setData = { mainProduct: activeProduct, productSetItems, removedItems };
            await updateProductSet(setData);
            setProductSets(prev => prev.map(item => item._id === activeProduct._id ? { ...item, setOfProduct: productSetItems } : item));
            toggleToList();
        } catch (error) {
            logError(error);
        } finally {
            setIsLoading(false);
        }
    }, [productSetItems, activeProduct]);

    const filteredProductOptions = useMemo(() => {
        return productOptions.filter(({ product }) => !productSetItems.some(set => set._id === product._id) && activeProduct._id !== product._id);
    }, [productSetItems, productOptions]);

    useEffect(() => {
        setProductSetItems(setOfProduct || []);
    }, [setOfProduct]);

    const { isEven, lastIndex } = useMemo(() => ({
        isEven: productSetItems.length % 2 === 0,
        lastIndex: productSetItems.length - 1
    }), [productSetItems.length]);

    const renderProductCards = useMemo(() => {
        return productSetItems.map((item, index) => {
            const { product } = item;
            const key = product._id || product.id || index;
            const isLastOdd = productSetItems.length % 2 !== 0 && index === productSetItems.length - 1;

            return <div className={`${isLastOdd ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
                <ProductCard
                    key={key}
                    item={item}
                    onRemove={handleRemove}
                    isLastOdd={isLastOdd}
                    handleQuantityChange={handleQuantityChange}
                />
            </div>;
        });
    }, [productSetItems, isEven, lastIndex, handleRemove]);

    const handleProductSelect = (product) => {
        setProductSetItems(prev => [...prev, { _id: product._id, product, quantity: 1 }]);
    };

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px] relative'>
            <BackButton onClick={toggleToList} />

            <h1 className='block font-haasRegular uppercase text-[25px] text-secondary-alt'>
                update your set
            </h1>

            <div className='w-full lg:max-w-[500px] flex gap-y-[10px] gap-x-[20px] py-[15px] px-[15px] cursor-pointer border border-primary-border transform transition-all duration-300'>
                <div className='bg-white w-[100px] h-[100px] p-2 flex-shrink-0'>
                    <PrimaryImage
                        url={product.mainMedia}
                        alt={`${product.name} product image`}
                        customClasses='h-full w-full object-cover'
                    />
                </div>
                <div className='w-full text-left flex flex-col gap-y-[10px] justify-center'>
                    <h2 className='font-haasRegular text-secondary-alt uppercase text-[20px] block'>
                        {product.name}
                    </h2>
                </div>
            </div>

            <h3 className='font-haasBold text-secondary-alt uppercase text-[20px] block'>
                set of products
            </h3>

            <div className='relative h-[60px]'>
                <CustomDropdown products={filteredProductOptions} onSelect={handleProductSelect} />
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[20px] items-center justify-center">
                {renderProductCards}
            </div>

            <div className='flex w-full gap-x-[10px] justify-center'>
                <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className='tracking-[3px] hover:tracking-[5px] hover:font-haasBold transform transition-all duration-300 border border-red-500 text-red-500 h-[58px] lg:w-[156px] w-full uppercase text-[14px] font-haasRegular'
                >
                    {isDeleting ? 'deleting...' : 'delete'}
                </button>
                <button
                    disabled={isLoading}
                    onClick={handleUpdate}
                    className='tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transform transition-all duration-300 h-[58px] lg:w-[280px] w-full text-secondary-alt uppercase text-[14px] font-haasRegular'
                >
                    {isLoading ? 'updating...' : 'update'}
                </button>
            </div>
        </div>
    );
};

export default ProductListUpdate;