"use client"

import { usePathname, useRouter } from "next/navigation"
import { RiHome4Line, RiProjectorLine, RiMailLine } from "react-icons/ri"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next";

const pages = [
  { path: "/", name: "HOME", icon: <RiHome4Line size={20} /> },
  { path: "/projects", name: "PROJECTS", icon: <RiProjectorLine size={20} /> },
  { path: "/contact", name: "CONTACT", icon: <RiMailLine size={20} /> }
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <html lang="en">
      <SpeedInsights />
      <body className="bg-white">
        <div className="fixed inset-0 grain" />
        <div className="fixed inset-0 flex flex-col md:flex-row">
          {/* Navigation - Bottom on mobile, Left on desktop */}
          <div className="order-last md:order-first h-16 md:h-auto md:w-16 border-t md:border-t-0 md:border-r border-black/5 bg-white/90 backdrop-blur-md">
            <nav className="h-full flex flex-row md:flex-col items-center justify-center gap-6">
              {pages.map(page => (
                <button
                  key={page.path}
                  onClick={() => router.push(page.path)}
                  className={`relative p-2.5 rounded-md transition-all duration-200 ease-in-out
                    ${pathname === page.path 
                      ? 'bg-black/5 text-black after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-black/10' 
                      : 'text-black/60 hover:text-black hover:bg-black/5'
                    }`}
                >
                  {page.icon}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 order-first md:order-last p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

