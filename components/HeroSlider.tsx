"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { urlFor } from "@/sanity/lib/image";

interface HeroSlide {
  backgroundImage: {
    asset: any;
    alt: string;
  };
  heading: {
    en: string;
    nl: string;
  };
  bodyText?: {
    en: string;
    nl: string;
  };
  buttonText?: {
    en: string;
    nl: string;
  };
  buttonLink?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  currentLang: string;
  autoPlayInterval?: number;
}

export default function HeroSlider({
  slides,
  currentLang = "en",
  autoPlayInterval = 5000,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="h-[60vh] bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground font-sans">
          No hero slides available
        </p>
      </div>
    );
  }

  return (
    <section
      className="relative h-[85vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {slide.backgroundImage?.asset ? (
                <Image
                  src={urlFor(slide.backgroundImage.asset)
                    .width(1920)
                    .height(800)
                    .url()}
                  alt={slide.backgroundImage.alt || "Hero slide"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="bg-background/20 backdrop-blur-sm rounded-2xl p-8">
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.heading[currentLang as keyof typeof slide.heading]}
                    </h1>

                    {slide.bodyText && (
                      <p className="font-sans text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                        {
                          slide.bodyText[
                            currentLang as keyof typeof slide.bodyText
                          ]
                        }
                      </p>
                    )}

                    {slide.buttonText && slide.buttonLink && (
                      <Link
                        href={slide.buttonLink}
                        className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-sans font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        {
                          slide.buttonText[
                            currentLang as keyof typeof slide.buttonText
                          ]
                        }
                        <ChevronRightIcon className="w-5 h-5 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6 text-foreground" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6 text-foreground" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide
                  ? "bg-primary shadow-lg scale-110"
                  : "bg-background/60 hover:bg-background/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-background/20">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  );
}
