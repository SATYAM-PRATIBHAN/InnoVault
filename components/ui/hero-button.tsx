import Link from "next/link";
import React from 'react';

interface HeroButtonProps {
    text: string;
    path: string;
}

const HeroButton: React.FC<HeroButtonProps> = ({ text, path }) => {
    return (
        <Link href={path} className="relative inline-block text-base sm:text-lg group">
            <span className="relative z-10 block px-4 py-3 sm:px-6 sm:py-4 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-[#ffffff]"></span>
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-zinc-800 group-hover:-rotate-180 ease"></span>
                <span className="relative">{text}</span>
            </span>
            <span
                className="absolute bottom-0 right-0 w-full h-10 sm:h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
            ></span>
        </Link>
    );
};

export default HeroButton;