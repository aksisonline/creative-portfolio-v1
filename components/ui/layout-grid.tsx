/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect, JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { videoCache, preloadVideo } from "@/lib/videoCache";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
  video: string;  // Add video URL
  link?: string; // Add link property
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Add pre-caching effect
  useEffect(() => {
    // This will now act as a fallback in case videos weren't cached in layout
    const preCacheVideos = async () => {
      const preloadPromises = cards.map(card => 
        preloadVideo(card.video, card.id)
          .catch(err => console.warn(`Failed to preload video ${card.id}:`, err))
      );
      
      // Wait for all videos to be cached
      await Promise.allSettled(preloadPromises);
    };

    preCacheVideos();
  }, [cards]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (selected && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLastSelected(selected);
        setSelected(null);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [selected]);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div ref={containerRef} className="w-full h-full p-10 grid grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              handleClick(card);
            }}
            className={cn(
              card.className,
              "relative overflow-hidden",
              selected?.id === card.id
                ? "rounded-none cursor-pointer fixed inset-0 h-full w-full m-0 z-50"
                : lastSelected?.id === card.id
                ? "z-40 bg-white rounded-xl h-full w-full"
                : "bg-white rounded-xl h-full w-full"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && (
              <SelectedCard 
                selected={selected} 
                onClose={handleOutsideClick}
              />
            )}
            <ImageComponent 
              card={card} 
              selected={selected?.id === card.id}
              onClose={handleOutsideClick}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const ImageComponent = ({ card, selected, onClose }: { 
  card: Card; 
  selected?: boolean;
  onClose?: () => void;
}) => {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  // Add sync effect when videos are playing
  useEffect(() => {
    if (!selected) return;

    const syncInterval = setInterval(() => {
      if (mainVideoRef.current && bgVideoRef.current) {
        // Only sync if time difference is more than 0.1 seconds
        if (Math.abs(mainVideoRef.current.currentTime - bgVideoRef.current.currentTime) > 0.1) {
          bgVideoRef.current.currentTime = mainVideoRef.current.currentTime;
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(syncInterval);
  }, [selected]);

  useEffect(() => {
    if (mainVideoRef.current) {
      const handleLoadedMetadata = () => {
        if (mainVideoRef.current) {
          setIsPortrait(mainVideoRef.current.videoHeight > mainVideoRef.current.videoWidth);
        }
      };
      mainVideoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => mainVideoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, []);

  return (
    <motion.div
      layoutId={`image-${card.id}-image`}
      className={cn(
        "absolute inset-0 h-full w-full transition-all duration-300",
        !selected && "group hover:scale-105"
      )}
    >
      {selected && (
        <>
          {/* Blurred background video - hidden on mobile */}
          <div className="absolute inset-0 scale-110 overflow-hidden hidden md:block">
            <video
              ref={bgVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover blur-2xl opacity-80"
            >
              <source src={card.video} type="video/mp4" />
            </video>
          </div>
          {/* Main video container */}
          <div className="absolute inset-0 flex items-center justify-center bg-black md:bg-transparent">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Edge gradients - hidden on mobile */}
              <div className="absolute inset-0 z-10 hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
              </div>
              {/* Main video */}
              <video
                ref={mainVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "relative z-20",
                  "w-full h-full object-cover", // Mobile: cover entire screen
                  "md:object-contain md:max-h-[95%] md:max-w-[95%] md:w-auto md:h-auto" // Desktop: contain with max dimensions
                )}
              >
                <source src={card.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </>
      )}
      {!selected && (
        <>
          {/* Main thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={card.thumbnail}
                fill
                style={{ objectFit: "cover" }}
                className="transition duration-200 grayscale group-hover:grayscale-0"
                alt="thumbnail"
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const SelectedCard = ({ selected, onClose }: { selected: Card | null; onClose: () => void }) => {
  return (
    <div 
      className="bg-transparent h-full w-full flex flex-col justify-end relative z-[60]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="absolute inset-0 h-full w-full bg-black z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-[70]"
        onClick={(e) => e.stopPropagation()}
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
