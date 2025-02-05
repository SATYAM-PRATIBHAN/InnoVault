import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import BlurFade from "../ui/blur-fade";
import HeroButton from "../ui/hero-button";

export default function Hero() {
    return (
      <main className="min-h-screen bg-[#ffffff] w-full flex flex-col justify-center items-center px-4">
            <div className="text-black text-center flex gap-4 flex-col items-center max-w-2xl w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold">
                    <BlurFade>
                        Got a <RoughNotation animationDelay={500} type="highlight" color="#fcd34d" strokeWidth={1} show={true}>Project</RoughNotation> Idea?
                    </BlurFade>
                </h1>
                <h2 className="text-sm sm:text-xl md:text-2xl">Explore - Claim - Create - Showcase</h2>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <HeroButton text="Get Started" path="/projects" />
                    <HeroButton text="Learn More" path="/about" />
                </div>
            </div>
        </main>
    );
}