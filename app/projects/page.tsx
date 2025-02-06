"use client"
import { LayoutGrid } from "@/components/ui/layout-grid"
import { projects } from '@/data/projects';
import { usePrefetchProjects } from '@/hooks/usePrefetchProjects';

const ProjectCard = ({ title, description, link, onClose }: { 
  title: string; 
  description: string; 
  link?: string;
  onClose?: () => void;
}) => {
  return (
    <article className="p-8">
      <h2 className="font-bold md:text-4xl text-xl text-white">
        {title}
      </h2>
      <div className="font-normal text-base my-4 max-w-lg text-neutral-200">
        {description}
      </div>
      <div className="flex gap-4">
        {link && (
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-block px-6 py-2 mt-4 text-sm text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            View Project
          </a>
        )}
        <button 
          onClick={onClose}
          className="inline-block px-6 py-2 mt-4 text-sm text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors"
        >
          Close
        </button>
      </div>
    </article>
  );
};

const cards = projects.map(project => ({
  id: project.id,
  content: <ProjectCard 
    title={project.title} 
    description={project.description} 
    link={project.link}
    onClose={() => document.dispatchEvent(new MouseEvent('mousedown'))} 
  />,
  className: project.className,
  thumbnail: project.thumbnail,
  video: project.video,
}));

export default function Projects() {
  usePrefetchProjects();
  
  return (
    <LayoutGrid cards={cards} />
  );
}

