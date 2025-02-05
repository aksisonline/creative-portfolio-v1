"use client"
import { LayoutGrid } from "@/components/ui/layout-grid"

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

const projects = [
  {
    id: 1,
    title: "Project One",
    description:
      "A stunning project that showcases modern web development techniques and creative design solutions. Built with React and Next.js.",
    className: "row-span-2",
    thumbnail:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media/img/3am.png",
    video:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media//3AM%20Spotify%20BG.mp4", // Add video URL
    link: "https://project-one.com",
  },
  {
    id: 2,
    title: "Project Two",
    description:
      "An innovative application that pushes the boundaries of web technology while maintaining excellent user experience and performance.",
    className: "col-span-1",
    thumbnail:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media/img/euphoria.png",
    video:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media//iamrento_bit.mov", // Add video URL
    link: "https://project-one.com",
  },
  {
    id: 3,
    title: "Project Two",
    description:
      "An innovative application that pushes the boundaries of web technology while maintaining excellent user experience and performance.",
    className: "col-span-1",
    thumbnail:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media/img/euphoria.png",
    video:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media//iamrento_bit.mov", // Add video URL
    link: "https://project-one.com",
  },
  {
    id: 4,
    title: "Project Two",
    description:
      "An innovative application that pushes the boundaries of web technology while maintaining excellent user experience and performance.",
    className: "col-span-1",
    thumbnail:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media/img/euphoria.png",
    video:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media//iamrento_bit.mov", // Add video URL
    link: "https://project-one.com",
  },
  {
    id: 5,
    title: "Project Two",
    description:
      "An innovative application that pushes the boundaries of web technology while maintaining excellent user experience and performance.",
    className: "row-span-2",
    thumbnail:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media/img/euphoria.png",
    video:
      "https://ucfjczwjjbycuglmmbay.supabase.co/storage/v1/object/public/Media//iamrento_bit.mov", // Add video URL
    link: "https://project-one.com",
  },
  // Add more projects as needed
];

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
  return (
      <LayoutGrid cards={cards} />
  );
}

