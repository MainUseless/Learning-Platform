"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Card from '../../../public/components/Card';

const Enrollments = () => {
    const router = useRouter();
    const [selectedView, setSelectedView] = useState(false);
    const [enrollments, setEnrollments] = useState([]);

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
            .then(data => setEnrollments(data))
            .catch(error => console.error('Error fetching enrollments:', error));

            // // Fetch current enrollments
            // fetch('http://localhost:8080/learn/enrollment', {
            //     headers: {
            //         Authorization: `Bearer ${authToken}`
            //     }
            // })
            // .then(response => response.json())
            // .then(data => setCurrentEnrollments(data))
            // .catch(error => console.error('Error fetching current enrollments:', error));
        }
    }, []);

    return (
        <div className="flex flex-col items-left justify-top min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-semibold mb-8">Enrollments</h1>

            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-4 py-2 bg-blue-500 text-black rounded ${
                        selectedView === 'past' ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                    onClick={() => setSelectedView(true)}
                >
                    View My Enrollments
                </button>
            </div>

            {selectedView === true && (
                <div>
                    <ul>
                        {enrollments.map((enrollment) => (
                            <div>
                                <Card data={enrollment} />
                                <Card data={enrollment.course} />
                            </div>
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
