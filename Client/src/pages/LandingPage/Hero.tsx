import React from "react";
import heroImg from "@/assets/landing/hero.jpg";
import { Link } from "react-router-dom";
import { useUser } from "@/context/authContext";

const HeroSection: React.FC = () => {
    const {user} = useUser();

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
            <img
                src={heroImg}
                alt="Hero Background"
                className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                LeadFlow – Lead Management Platform
            </h1>
            <p className="text-lg md:text-xl mb-6">
                Manage your leads efficiently with powerful tools for tracking, filtering, and growth.
            </p>

            {
                user ? (
                    <Link to="/features">
                        <button className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-blue-900 transition">
                            Explore Features
                        </button>
                    </Link>
                ) 
                :
                <Link to="/sign-up">
                    <button className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-blue-900 transition">
                        Get Started
                    </button>
                </Link>
            }
        </div>


        {/* Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
            className="relative block w-full h-24 md:h-32"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
        >
            <path
            fill="#fff"
            d="M0,0 
                C480,180 960,180 1440,0 
                L1440,320 
                L0,320 
                Z"
            />
        </svg>
        </div>
    </section>
  );
};

export default HeroSection;
