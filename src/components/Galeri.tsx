import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { galleryImages } from "../data";

export default function Galeri() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === 0 ? galleryImages.length - 1 : activePhotoIndex - 1
      );
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === galleryImages.length - 1 ? 0 : activePhotoIndex + 1
      );
    }
  };

  return (
    <section 
      id="galeri" 
      className="relative py-24 px-6 bg-stone-50 text-stone-800 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-700 font-display">GALERI KAMI</p>
          <h2 className="text-4xl font-handwritten text-amber-900">Momen Indah Kebersamaan</h2>
          <div className="h-[1px] w-16 bg-amber-600/35 mx-auto mt-4" />
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => openLightbox(index)}
              className="group aspect-[4/3] relative overflow-hidden rounded-2xl bg-stone-200 border border-stone-100 shadow-sm cursor-pointer"
            >
              {/* Image with zoom on hover */}
              <img
                src={img.url}
                alt={img.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Luxury gold hover vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs sm:text-sm font-serif truncate tracking-wide font-medium mr-2">
                    {img.caption}
                  </span>
                  <div className="p-1.5 bg-amber-500 rounded-lg text-stone-950 shrink-0">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-stone-950/98 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          >
            {/* Top Close Bar */}
            <div className="absolute top-4 right-4 z-51 flex items-center justify-end w-full max-w-5xl px-4">
              <button
                onClick={closeLightbox}
                className="p-2 bg-stone-900/80 text-white rounded-full border border-stone-800 hover:bg-stone-800 transition-all cursor-pointer shadow-lg active:scale-90"
                title="Tutup Galeri"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Content */}
            <div 
              className="relative max-w-4xl w-full flex items-center justify-center h-[70vh] md:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Back button */}
              <button
                onClick={prevPhoto}
                className="absolute left-2 md:-left-16 z-51 p-3 bg-stone-900/60 hover:bg-stone-900/90 text-white rounded-full border border-stone-800 hover:border-stone-700 transition-all cursor-pointer shadow-xl active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slider image */}
              <motion.img
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[activePhotoIndex].url}
                alt={galleryImages[activePhotoIndex].caption}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-stone-900"
              />

              {/* Next button */}
              <button
                onClick={nextPhoto}
                className="absolute right-2 md:-right-16 z-51 p-3 bg-stone-900/60 hover:bg-stone-900/90 text-white rounded-full border border-stone-800 hover:border-stone-700 transition-all cursor-pointer shadow-xl active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div 
              className="mt-6 text-center max-w-xl px-4 flex flex-col items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-amber-400 font-serif font-semibold text-base tracking-wide">
                {galleryImages[activePhotoIndex].caption}
              </h4>
              <p className="text-stone-400 text-xs uppercase tracking-[0.2em] font-sans">
                Foto {activePhotoIndex + 1} dari {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
