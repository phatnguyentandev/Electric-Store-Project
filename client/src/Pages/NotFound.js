// NotFound.js
import React from "react";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-9xl font-bold text-red-500">404</h1>
            <p className="text-2xl text-gray-700 mb-4">
                Oops! The page you're looking for doesn't exist.
            </p>
            <a
                href="/"
                className="px-6 py-3 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 transition duration-300"
            >
                Go Back Home
            </a>
        </div>
    );
}

export default NotFound;
