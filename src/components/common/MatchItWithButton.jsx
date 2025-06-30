import { lightboxActions } from "@/store/lightboxStore";

export const MatchItWithButton = ({ product }) => {

    const handleClick = () => {
        lightboxActions.setMatchProductsLightBoxDetails({ open: true, productData: product });
    };

    return (
        <div className="match-it-with-button w-full flex justify-end py-2">
            <button onClick={handleClick} className="uppercase bg-primary px-6 py-3 rounded-full font-haasLight text-sm tracking-widest hover:bg-secondary-alt hover:text-primary transition duration-300">Match it with</button>
        </div>
    );
};