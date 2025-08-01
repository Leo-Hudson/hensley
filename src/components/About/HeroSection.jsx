'use client'
import React from "react";
import Image from "next/image";
import { PrimaryButton } from "../common/PrimaryButton";
import arrow from "@/assets/icons/arrow.svg";
import { PrimaryImage } from "../common/PrimaryImage";
import AboutSection from "./AboutSection";
import { CustomLink } from "../common/CustomLink";

function HeroSection({ heroSectionData }) {

  const { title, subtitle, image, buttonLabel, buttonLink, richcontent } = heroSectionData;

  const data = {
    title: title,
    tagline: subtitle,
    buttonLabel,
  };

  return (
    <>
      <div className="flex w-full lg:h-screen lg:flex-row md:justify-center md:items-center flex-col">
        <div className="lg:w-1/2 flex items-center justify-center md:pl-11 lg:mb-0 mb-[59px]">
          <div className="lg:w-min lg:text-left text-center w-[492px]">
            <h1
              className="font-recklessRegular 
              text-[55px] lg:text-[114px] xl:text-[140px] lg:leading-[120px] 
              leading-[50px] 
              text-secondary-alt  
              lg:pt-0 pt-[60px]"
            >
              {data.title.split(" ").slice(0, 2).join(" ")} <br />{" "}
              {data.title.split(" ").slice(2).join(" ")}
            </h1>
            <p className="lg:text-[24px] font-haasRegular text-[14px] mt-[14px]">
              {data.tagline}
            </p>
            <CustomLink to={buttonLink}>
              <PrimaryButton
                className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
              max-h-[60px] max-w-[280px]
              p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
              >
                {data.buttonLabel}
              </PrimaryButton>
            </CustomLink>
          </div>
        </div>

        <div className="lg:w-1/2 p-5 md:h-screen sm:h-[500px] md:w-full relative">
          <PrimaryImage timeout={0} url={image} customClasses={"h-full w-full object-cover "} />
          <Image
            src={arrow}
            alt="Scroll Arrow"
            className="lg:block hidden absolute bottom-[50px] left-[50px] black h-[25px] w-[25px]"
          />
        </div>
      </div>
      <AboutSection richcontent={richcontent} />
    </>
  );
}

export default HeroSection;
