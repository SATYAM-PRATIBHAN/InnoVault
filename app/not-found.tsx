import HeroButton from "@/components/ui/hero-button";

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#ffffff] text-black text-center">
        <h1 className="text-6xl font-bold tracking-wide">404</h1>
        <p className="text-xl mt-4">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="mt-6">
            <HeroButton text="Go Home" path="/" />
        </div>
      </div>
    );
  }
  