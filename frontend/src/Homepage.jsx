import React, { memo } from 'react'


//New Componnet import
import Navbar from "./components/homePageComp/Navbar";
import HeroSection from "./components/homePageComp/HeroSection";
import ProductPortfolioSection from "./components/homePageComp/ProductPortfolioSection";
import ServicesSection from "./components/homePageComp/ServicesSection";
import WhyChooseUsSection from "./components/homePageComp/WhyChooseUsSection";
import DiscoverCategoriesSection from "./components/homePageComp/DiscoverCategoriesSection";
import ExtendedCategoryGrid from "./components/homePageComp/ExtendedCategoryGrid";
import PartnersSection from "./components/homePageComp/PartnersSection";
import StatsSection from "./components/homePageComp/StatsSection";
import WhyChooseUsCards from "./components/homePageComp/WhyChooseUsCards";
import FAQSection from "./components/homePageComp/FAQSection";
import CTABanner from "./components/homePageComp/CTABanner";
import Footer from "./components/homePageComp/Footer";
import Footer2 from "./components/homePageComp/Footer2";
import AboutUsSection from "./components/homePageComp/Aboutussection";
import ProductsSection from './components/homePageComp/Productssection';

const Homepage = memo(() => {
  return (<>
    <Navbar/>
    <HeroSection/>
    <ProductsSection/>
    <ServicesSection/>
    {/* <WhyChooseUsSection/> */}
    {/* <DiscoverCategoriesSection/>
    <ExtendedCategoryGrid/> */}
    {/* <PartnersSection/> */}
    <StatsSection/>
    {/* <WhyChooseUsCards/> */}
    <AboutUsSection/>
    {/* <CTABanner/> */}
    <Footer/>
    





   {/* <PropertyPortfolioSection/>
    <NextSections/>
    <FinalSections/> */}
   {/* <CategoryGrid/>
   <PartnersSection/>
   <StatsSection/>
   <WhyChooseUp/>
   <FAQSection/>
   <CTABanner/>
   <InquiryForm/>
   <Footer/> */}
    {/* <MasonrySection/>
    <LogoFaqSection/>
    <Footer/> */}
    </>
  )
})

export default Homepage