/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect, JSX, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
  video: string;  // Add video URL
  link?: string; // Add link property
};

// Add this outside of components (module scope)
const videoCache = new Map<number, boolean>();

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
        <div 
          key={i} 
          className={cn(card.className, "")}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
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
            {/* Preload video when hovering */}
            {hoveredCard === card.id && !videoCache.get(card.id) && (
              <link rel="preload" as="video" href={card.video} />
            )}
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
  const [isReady, setIsReady] = useState(!!videoCache.get(card.id));

  useEffect(() => {
    if (mainVideoRef.current && bgVideoRef.current) {
      let loadedCount = videoCache.get(card.id) ? 2 : 0;
      
      const handleVideoLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          videoCache.set(card.id, true);
          setIsReady(true);
        }
      };

      const loadVideo = (video: HTMLVideoElement) => {
        if (video.readyState >= 3) {
          handleVideoLoad();
        } else {
          video.addEventListener('loadeddata', handleVideoLoad, { once: true });
        }
      };

      loadVideo(mainVideoRef.current);
      loadVideo(bgVideoRef.current);
    }
  }, [card.id, selected]);

  return (
    <motion.div
      layoutId={`image-${card.id}-image`}
      className={cn(
        "absolute inset-0 h-full w-full transition-all duration-300",
        !selected && "group hover:scale-105"
      )}
    >
      {/* Always render videos but keep them hidden until selected */}
      <div className={cn("absolute inset-0", !selected && "hidden")}>
        <div className="absolute inset-0 scale-110 overflow-hidden hidden md:block">
          <video
            ref={bgVideoRef}
            playsInline
            muted
            loop
            autoPlay={isReady}
            className={cn(
              "w-full h-full object-cover blur-2xl opacity-80",
              !isReady && "opacity-0"
            )}
          >
            <source src={card.video} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black md:bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Edge gradients remain unchanged */}
            <video
              ref={mainVideoRef}
              playsInline
              muted
              loop
              autoPlay={isReady}
              className={cn(
                "relative z-20",
                "w-full h-full object-cover",
                "md:object-contain md:max-h-[95%] md:max-w-[95%] md:w-auto md:h-auto",
                !isReady && "opacity-0"
              )}
            >
              <source src={card.video} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Show thumbnail or loading state */}
      {(!selected || !isReady) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={card.thumbnail}
              layout="fill"
              objectFit="cover"
              className={cn(
                "transition duration-200",
                !selected && "grayscale group-hover:grayscale-0"
              )}
              alt="thumbnail"
            />
          </div>
        </div>
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
