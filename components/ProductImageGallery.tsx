'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { urlFor } from '@/sanity/lib/image';

interface ProductImageGalleryProps {
  images: any[];
  productName: string;
  currentLang: string;
}

export default function ProductImageGallery({ images, productName, currentLang }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (imageIndex: number) => {
    setSelectedImage(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-secondary/30 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-serif font-bold text-primary">
              {productName.charAt(0)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {currentLang === "en"
              ? "No image available"
              : "Geen afbeelding beschikbaar"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30 shadow-lg group cursor-pointer"
          onClick={() => openModal(selectedImage)}
        >
          <Image
            src={urlFor(images[selectedImage].asset)
              .width(800)
              .height(600)
              .url()}
            alt={images[selectedImage].alt || productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          
          {/* View larger overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-foreground">
                {currentLang === "en" ? "Click to view larger" : "Klik voor groter beeld"}
              </span>
            </div>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {images.slice(0, 5).map((image: any, index: number) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                  index === selectedImage
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:ring-2 hover:ring-primary/50 hover:shadow-md bg-secondary/30'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={urlFor(image.asset)
                    .width(120)
                    .height(120)
                    .url()}
                  alt={image.alt || `${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Modal Image */}
          <div 
            className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-3xl max-h-[80vh]">
              <Image
                src={urlFor(images[selectedImage].asset)
                  .width(1200)
                  .height(900)
                  .url()}
                alt={images[selectedImage].alt || productName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={95}
              />
            </div>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}