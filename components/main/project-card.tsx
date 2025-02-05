import { Project } from "@/public/types";
import { useState, useEffect } from "react";

interface ProjectCardProps {
    data: Project;
}

export default function ProjectCard({ data }: ProjectCardProps) {
    const [project, setProject] = useState(data);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const upvotedProjects = JSON.parse(localStorage.getItem("upvotedProjects") || "[]");
        if (upvotedProjects.some((p: Project) => p.id === project.id)) {
            setHasUpvoted(true);
        }

        const claimedProjects = JSON.parse(localStorage.getItem("claimedProjects") || "[]");
        if (claimedProjects.some((p: Project) => p.id === project.id)) {
            setHasClaimed(true);
        }
    }, [project.id]);

    const handleAction = async (action: string) => {
        if (isProcessing) return; // Prevent multiple clicks during API request
        setIsProcessing(true);

        let upvotedProjects = JSON.parse(localStorage.getItem("upvotedProjects") || "[]");
        let claimedProjects = JSON.parse(localStorage.getItem("claimedProjects") || "[]");

        const isUpvoting = action === "upvote";
        const isClaiming = action === "claim";
        const shouldRemove = (isUpvoting && hasUpvoted) || (isClaiming && hasClaimed);

        const response = await fetch("/api/updateProject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: project.id, 
                action,
                remove: shouldRemove  
            }),
        });

        if (response.ok) {
            if (isUpvoting) {
                if (shouldRemove) {
                    setHasUpvoted(false);
                    upvotedProjects = upvotedProjects.filter((p: Project) => p.id !== project.id);
                    project.upvotes -= 1;
                } else {
                    setHasUpvoted(true);
                    upvotedProjects.push(project);
                    project.upvotes += 1;
                }
                localStorage.setItem("upvotedProjects", JSON.stringify(upvotedProjects));
            }

            if (isClaiming) {
                if (shouldRemove) {
                    setHasClaimed(false);
                    claimedProjects = claimedProjects.filter((p: Project) => p.id !== project.id);
                    project.claims -= 1;
                } else {
                    setHasClaimed(true);
                    claimedProjects.push(project);
                    project.claims += 1;
                }
                localStorage.setItem("claimedProjects", JSON.stringify(claimedProjects));
            }

            setProject({ ...project }); // Update state with modified project
        } else {
            alert("Failed to update project.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="bg-[#ffffff] text-black p-6 rounded-xl border border-gray-700 shadow-lg w-full max-w-2xl mx-auto h-fit hover:drop-shadow-2xl transition duration-300">
            {/* Idea Title */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl cursor-pointer font-bold">{project.title}</h3>
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-300 text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Idea Description */}
            <div className="bg-white text-black p-4 rounded-lg mb-4 border border-gray-700">
                <p className="text-sm sm:text-base leading-relaxed">{project.description}</p>
            </div>

            {/* Upvotes, Status, Claims */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-400 text-sm mb-4 gap-2">
                <div>
                    <span className="text-black">Upvotes:</span> <span className="text-black">{project.upvotes}</span>
                </div>
                <div>
                    <span className="text-black">Claims:</span> <span className="text-black">{project.claims}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <button
                    className={`py-2 rounded-lg border transition text-xs sm:text-sm ${
                        hasUpvoted ? "bg-blue-500 text-white" : "bg-white text-black border-gray-700 hover:bg-gray-600 hover:text-white"
                    }`}
                    onClick={() => handleAction("upvote")}
                    disabled={isProcessing}
                >
                    {hasUpvoted ? "Unvote" : "Upvote"}
                </button>

                <button
                    className={`py-2 rounded-lg border transition text-xs sm:text-sm ${
                        hasClaimed ? "bg-blue-500 text-white" : "bg-white text-black border-gray-700 hover:bg-gray-600 hover:text-white"
                    }`}
                    onClick={() => handleAction("claim")}
                    disabled={isProcessing}
                >
                    {hasClaimed ? "Unclaim" : "Claim"}
                </button>
            </div>
        </div>
    );
}
