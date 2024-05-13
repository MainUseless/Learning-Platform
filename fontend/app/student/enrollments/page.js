"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Enrollments = () => {
    const router = useRouter();
    useEffect(() => {
        const authToken = Cookies.get('authToken');
    
        if(!authToken)
            router.push('/signin');
    }, []);

    const [selectedView, setSelectedView] = useState('');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100  text-black">
            <h1 className="text-2xl font-semibold mb-8">Enrollments</h1>

            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-4 py-2 bg-blue-500 text-black rounded ${
                        selectedView === 'past' ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                    onClick={() => setSelectedView('past')}
                >
                    View Past Enrollments
                </button>

                <button
                    className={`px-4 py-2 bg-blue-500 text-black rounded ${
                        selectedView === 'current' ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                    onClick={() => setSelectedView('current')}
                >
                    View Current Enrollments
                </button>
            </div>

            {selectedView === 'past' && (
                <div>
                    {/* Render past enrollments */}
                    <p>List of past enrollments...</p>
                </div>
            )}

            {selectedView === 'current' && (
                <div>
                    {/* Render current enrollments */}
                    <p>List of current enrollments...</p>
                </div>
            )}

            <div className="mt-8">
                <Link legacyBehavior href="/student">
                    <a className="text-blue-500 hover:text-blue-600">Back to Home</a>
                </Link>
            </div>
        </div>
    );
};

export default Enrollments;
