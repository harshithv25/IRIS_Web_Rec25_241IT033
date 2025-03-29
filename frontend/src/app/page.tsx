"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FadeInSection from "@/components/FadeIn";
import Counter from "@/components/Counter";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";
import { useAuth } from "@/context/AuthContext";
import Background from "@/components/Background";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToNextSection = () => {
    if (!isClient) return;

    const nextSection = document.getElementById("second-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* Background */}
      <Background />

      {/* Landing Page */}
      <div className="relative z-10 flex flex-col items-center w-full snap-y snap-mandatory px-6 mx-auto">
        <section className="w-full h-screen md:pt-0 lg:pt-25 pt-28 flex flex-col items-center justify-center md:grid md:grid-cols-1 md:grid-cols-6 md:grid-flow-col-reverse px-6 max-w-7xl snap-center relative sm:gap-10 gap-6">
          <div className="md:col-span-3 flex items-center justify-center order-1 md:order-2">
            <FadeInSection>
              <Image
                src="/media/Basketball2.svg"
                alt="Cyclist"
                width={800}
                height={800}
                className="w-[800px] lg:w-[800px] object-contain"
              />
            </FadeInSection>
          </div>

          <div className="md:col-span-3 text-center md:text-left order-2 md:order-1">
            <FadeInSection>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                Unlock Your Game, Play Anytime!
              </h1>

              <p className="text-lg md:text-xl opacity-70 mb-6">
                Easily book your favorite sports, courts, and equipment for your
                next game or practice sessions. Get rid of the hassle of
                physical bookings!
              </p>

              <button
                onClick={scrollToNextSection}
                className="relative px-6 py-2 cursor-pointer text-lg font-semibold rounded-lg border-3 border-[#3e3e3e]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                  Book Now
                </span>
              </button>
            </FadeInSection>
          </div>
        </section>

        <section
          id="second-section"
          className="w-full h-screen md:pt-0 lg:pt-25 pt-28 flex items-center justify-center text-white text-3xl snap-center relative gap-4"
        >
          <motion.div
            className="absolute right-50p bottom-50p md:relative md:right-auto md:bottom-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/media/basketball.svg"
              alt="Hovering Basketball"
              width={500}
              height={500}
              className="w-[200px] md:w-[400px] object-contain"
            />
          </motion.div>

          <div className="relative z-10 backdrop-blur-md md:text-left max-w-2xl px-6">
            <FadeInSection>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                Hassle-Free Booking
              </h2>
              <p className="text-lg md:text-xl opacity-70 mb-6">
                Say goodbye to the hassle of physical bookings! Our platform
                revolutionizes sports facility reservations, making it easier
                and more efficient than ever before.
              </p>
              <p className="text-lg md:text-xl opacity-70 mb-6">
                Manage all your bookings in one place! Enjoy sports with your
                friends and book equipment seamlessly.
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(user ? "/dashboard" : "/login");
                }}
                className="relative px-6 py-2 cursor-pointer text-lg font-semibold rounded-lg border-3 border-[#3e3e3e]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                  {user ? "Go to Dashboard" : "Login to Get Started"}
                </span>
              </button>
            </FadeInSection>
          </div>
        </section>

        <section
          id="second-section"
          className="w-full mb-10 md:mb-0 h-screen md:pt-0 lg:pt-15 pt-28 flex flex-col items-center justify-center text-white text-3xl snap-center relative gap-8"
        >
          <div className="absolute right-50p bottom-50p md:right-auto md:bottom-auto">
            <Image
              src="/media/numbers.svg"
              alt="Numbers vector"
              width={500}
              height={500}
              className="w-[800px] md:w-[800px] object-contain"
            />
          </div>
          <div className="z-10 p-55 backdrop-blur flex flex-col gap-5 justify-center items-center max-w-5xl text-center">
            <FadeInSection>
              <GradientText
                colors={["#4C55A4", "#FFBA08", "#D90429", "#4C55A4", "#FFBA08"]}
                animationSpeed={15}
                showBorder={false}
                className="font-bold text-5xl md:text-6xl"
              >
                <h2 className="text-5xl md:text-6xl font-bold">Our Numbers</h2>
              </GradientText>
            </FadeInSection>
            <div className="flex flex-col md:flex-row gap-0 sm:gap-10 justify-center items-center max-w-5xl text-center">
              <div className="p-6 rounded-lg shadow-lg">
                <FadeInSection>
                  <h2 className="text-5xl font-bold text-[#FFBA08]">
                    <Counter
                      from={0}
                      to={1000}
                      separator=","
                      direction="up"
                      duration={1}
                    />
                  </h2>
                  <p className="text-lg opacity-70">Total Bookings</p>
                </FadeInSection>
              </div>
              <div className="p-6 rounded-lg shadow-lg">
                <FadeInSection>
                  <h2 className="text-5xl font-bold text-[#D90429]">
                    <Counter
                      from={0}
                      to={100}
                      separator=","
                      direction="up"
                      duration={1}
                    />
                  </h2>
                  <p className="text-lg opacity-70">Total Users</p>
                </FadeInSection>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
