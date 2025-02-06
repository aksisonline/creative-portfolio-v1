import { useEffect } from 'react';
import { prefetchMedia } from '@/utils/prefetch';
import { projects } from '@/data/projects'; // You'll need to move projects data to a separate file

export const usePrefetchProjects = () => {
  useEffect(() => {
    const prefetchAllMedia = async () => {
      const mediaUrls = projects.flatMap(project => [
        project.thumbnail,
        project.video
      ]).filter(Boolean);

      await Promise.all(mediaUrls.map(url => prefetchMedia(url)));
    };

    prefetchAllMedia();
  }, []);
};
