export const videoCache = new Map<number, boolean>();

export const preloadVideo = async (videoUrl: string, cardId: number) => {
  // Don't reload if already cached
  if (videoCache.get(cardId)) return Promise.resolve(true);
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    
    video.onloadeddata = () => {
      videoCache.set(cardId, true);
      resolve(true);
    };
    
    video.onerror = () => {
      console.error(`Failed to preload video ${cardId}`);
      reject();
    };

    video.src = videoUrl;
    video.load();
  });
};
