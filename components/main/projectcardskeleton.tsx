export default function Skeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit w-full">
            <div className="flex bg-gray-200 justify-between items-center mb-4">
                <h3 className="text-xl bg-gray-200 font-bold text-black"></h3>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full"></span>
                <span className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full"></span>
                <span className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full"></span>
            </div>

            {/* Project Description */}
            <div className="bg-gray-50 p-4 rounded-lg h-28 mb-4">
                <p className="text-sm text-gray-700"></p>
            </div>

            {/* Upvotes and Status */}
            <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <div>
                <span className="font-semibold text-black"></span> 
                </div>
                <div>
                <span className="font-semibold text-black"></span> 
                </div>
                <div>
                <span className="font-semibold text-black"></span> 
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <button className="px-4 py-2 bg-gray-200 text-white rounded-md  transition">
                
                </button>
                <button className="px-4 py-2 bg-gray-200 text-white rounded-md transition">
                
                </button>
            </div>
        </div>
    );
};
    
