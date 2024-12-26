import React from "react";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-bounce delay-0"></div>
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-full animate-bounce delay-500"></div>
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full animate-bounce delay-1000"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700">
        Loading your shopping experience...
      </p>
    </div>
  );
};

export default Loader;
