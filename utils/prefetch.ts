export const prefetchMedia = (url: string) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = url.endsWith('.mp4') || url.endsWith('.mov') ? 'video' : 'image';
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
};
