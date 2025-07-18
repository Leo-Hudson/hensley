import { Banner } from "../common/Banner";
import { HensleyNews } from "../common/HensleyNews";
import { MarketSection } from "../common/MarketSection";
import OurCategories from "../common/OurCategories";
import { Testimonials } from "../common/Testimonials";
import { BestSellers } from "./BestSellers";
import { HeroSection } from "./HeroSection"
import OurProjects from "./OurProjects";

export const HomePage = ({ data }) => {
    const { homePageDetails, heroSectionData, categoriesData, portfolioData, bannerData, bestSellers, testimonials, marketsData, blogsData } = data;

    return (
        <>
            <HeroSection data={heroSectionData} />
            <OurCategories data={categoriesData} pageDetails={homePageDetails} />
            <OurProjects data={portfolioData} pageDetails={homePageDetails} />
            <Banner data={bannerData} />
            <BestSellers data={bestSellers} pageDetails={homePageDetails} />
            <Testimonials cardClasses={'lg:hover:bg-primary'} data={testimonials} pageDetails={homePageDetails} />
            <MarketSection classes={"border !border-secondary"} data={marketsData} pageDetails={homePageDetails} />
            <HensleyNews data={blogsData} pageDetails={homePageDetails} />
        </>
    )
}
