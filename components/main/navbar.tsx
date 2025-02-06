"use client"

import Link from "next/link";
import { jura } from "@/fonts/fonts";
import { usePathname } from "next/navigation";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <nav className="px-4 py-2 bg-[#ffffff] flex justify-between items-center relative z-50">
            {/* Logo Section */}
            <div className={`${jura.className} flex items-center gap-6 justify-center`}>
                <Link href={'/'} className={`${jura.className} hover:underline text-black text-2xl`}>
                    <span className='font-bold flex gap-2 items-center'>InnoVault</span>
                </Link>
            </div>

            {/* Desktop Links */}
            <div className={` ${jura.className} hidden md:flex gap-4 `}>
                <Link href="/about" className={`text-black hover:underline font-semibold ${pathname === '/about' ? 'underline' : ''}`}>
                    About
                </Link>
                <Link href="/projects" className={`text-black hover:underline font-semibold ${pathname === '/projects' ? 'underline' : ''}`}>
                    Projects
                </Link>
                <Link href="/claimed" className={`text-black hover:underline font-semibold ${pathname === '/claimed' ? 'underline' : ''}`}>
                    Claimed
                </Link>
                <Link href="/completedProjects" className={`text-black hover:underline font-semibold ${pathname === '/completedProjects' ? 'underline' : ''}`}>
                    Completed Projects
                </Link>
            </div>

            {/* GitHub Button & Mobile Menu Button */}
            <div className="flex items-center gap-4">
                <a href="https://github.com/SATYAM-PRATIBHAN/InnoVault" >
                    <button className="hidden md:flex justify-center items-center gap-2 px-6 py-2 rounded-xl border font-bold border-none text-black bg-white hover:bg-gray-300 hover:text-black transition duration-300">
                        <FaGithub size={18} color="black" /> <span>Star on Github</span>
                    </button>
                </a>
                
                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div ref={dropdownRef} className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 md:hidden">
                    <Link href="/about" className="text-black py-2 hover:underline w-full text-center" onClick={() => setMenuOpen(false)}>
                        About
                    </Link>
                    <Link href="/projects" className="text-black py-2 hover:underline w-full text-center" onClick={() => setMenuOpen(false)}>
                        Projects
                    </Link>
                    <Link href="/claimed" className="text-black py-2 hover:underline w-full text-center" onClick={() => setMenuOpen(false)}>
                        Claimed
                    </Link>
                    <Link href="/completedProjects" className="text-black py-2 hover:underline w-full text-center" onClick={() => setMenuOpen(false)}>
                        Completed Projects
                    </Link>
                    <a href="https://github.com/SATYAM-PRATIBHAN/InnoVault">
                        <button className="mt-2 px-6 py-2 rounded-xl border font-bold border-none text-black bg-white hover:bg-gray-300 hover:text-black transition duration-300 flex items-center gap-2">
                            <FaGithub size={18} color="black" /> <span>Star on Github</span>
                        </button>
                    </a>
                </div>
            )}
        </nav>
    );
}
