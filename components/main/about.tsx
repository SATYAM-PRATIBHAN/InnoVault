"use client"
import { RoughNotation } from "react-rough-notation";
import { motion } from "framer-motion";
import BlurFade from "@/components/ui/blur-fade";

export default function About() {
  return (
    <section className="bg-[#ffffff] text-gray-200 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black">
          <BlurFade>
            About <span className="text-gray-600">
              <RoughNotation animationDelay={500} type="box" color="red"show={true}>InnoVault</RoughNotation>
            </span>
          </BlurFade>
        </h2>

        <h6 className="text-center text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          <BlurFade>A community-driven open-source hub where you can discover, claim, and build innovative projects.</BlurFade>
        </h6>

        {/* Features Section with Animation */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <FeatureCard title={feature.title} description={feature.description} />
            </motion.div>
          ))}
        </div>

        {/* Why InnoVault Section */}
        <motion.div 
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 bg-[#ffffff] p-6 rounded-xl border hover:drop-shadow-2xl border-gray-700 transition duration-300">
          <h3 className="text-2xl font-semibold text-black">Why InnoVault?</h3>
          <p className="text-gray-900 mt-4 leading-relaxed">
            InnoVault is designed for developers, creators, and innovators looking for inspiration and collaboration. 
            It serves as a dynamic repository of project ideas that anyone can claim, work on, and contribute back to the community. 
            Unlike traditional idea-sharing platforms, InnoVault allows multiple users to work on the same idea, ensuring that creativity 
            isn&apos;t restricted by exclusivity. With a built-in system to track individual progress and engagement, 
            you can explore trending projects, contribute meaningful discussions, and bring your ideas to life.
          </p>
          <p className="text-gray-900 mt-4 leading-relaxed">
            Whether you're a beginner looking for a first project or an experienced developer seeking fresh challenges, 
            InnoVault provides the right space to explore, build, and grow in an open-source environment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Feature Data
const features = [
  { title: "Explore Open-Source Ideas", description: "Find inspiring project ideas contributed by the community and bring them to life." },
  { title: "Claim & Build", description: "Work on any project idea at any time. No ownership restrictions—just innovation!" },
  { title: "Upvote & Engage", description: "Highlight the best ideas by upvoting and joining discussions to improve them." },
  { title: "Track Your Progress", description: "Each user's project status is unique. Start fresh and update as you build." }
];

// Feature Card Component
function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#ffffff] p-6 rounded-xl hover:drop-shadow-2xl flex flex-col items-start border border-gray-700 transition duration-300">
      <h3 className="text-xl font-bold text-black">{title}</h3>
      <p className="text-gray-900 mt-2">{description}</p>
    </div>
  );
}
