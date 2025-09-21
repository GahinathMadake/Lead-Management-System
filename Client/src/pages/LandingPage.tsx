import LandingPageLayout from '@/components/common/LandingPageLayout';
import React from 'react';
import HeroSection from './LandingPage/Hero';

const LandingPage:React.FC = () => {

  return (
    <LandingPageLayout>
      <HeroSection />


      <div className='h-20'>

      </div>
    </LandingPageLayout>
  )
}

export default LandingPage;
    