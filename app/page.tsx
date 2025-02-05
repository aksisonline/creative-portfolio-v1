import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-full max-w-2xl mx-auto p-4 md:p-0">
      <h1 className="text-[4rem] md:text-[8rem] leading-none font-bold tracking-tight">
        From Ideas
        <br />
        To Reality
      </h1>
      <p className="text-base md:text-lg text-black/60 mt-4">
        Hi, I’m Abhiram Kanna. I turn ideas into reality through design, code,
        and storytelling. Whether it’s building apps, crafting visuals, or
        automating workflows, I create with purpose—keeping things simple,
        effective, and impactful.
      </p>
    </div>
  );
}

