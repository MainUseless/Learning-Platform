"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Enrollments = () => {
    const router = useRouter();
    const [selectedView, setSelectedView] = useState(''); // Initialize selectedView state
    const [pastEnrollments, setPastEnrollments] = useState([]);
    const [currentEnrollments, setCurrentEnrollments] = useState([]);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
    
        if(!authToken)
            router.push('/signin');
        else {
            // Fetch past enrollments
            fetch('http://localhost:8080/learn/enrollment', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then(response => response.json())
            .then(data => setPastEnrollments(data))
            .catch(error => console.error('Error fetching past enrollments:', error));

            // Fetch current enrollments
            fetch('http://localhost:8080/learn/enrollment', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then(response => response.json())
            .then(data => setCurrentEnrollments(data))
            .catch(error => console.error('Error fetching current enrollments:', error));
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
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
                    <h2 className="text-xl font-semibold mb-4">Past Enrollments</h2>
                    <ul>
                        {pastEnrollments.map((enrollment, index) => (
                            <li key={index}>{enrollment.courseName}</li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedView === 'current' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Current Enrollments</h2>
                    <ul>
                        {currentEnrollments.map((enrollment, index) => (
                            <li key={index}>{enrollment.courseName}</li>
                        ))}
                    </ul>
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
