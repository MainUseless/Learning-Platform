"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ManageEnrollments = () => {
    const router = useRouter();
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        
        if(!authToken)
            router.push('/signin');
        else {
            // Fetch student enrollments
            fetch('https://example.com/api/studentEnrollments', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then(response => response.json())
            .then(data => setEnrollments(data))
            .catch(error => console.error('Error fetching student enrollments:', error));
        }
    }, []);

    const handleAccept = (enrollmentId) => {
        // Logic to accept enrollment with ID 'enrollmentId'
    };

    const handleReject = (enrollmentId) => {
        // Logic to reject enrollment with ID 'enrollmentId'
    };

    return (
        <div className="flex flex-col items-left justify-top min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-semibold mb-8">Manage Enrollments</h1>

            <ul>
                {enrollments.map(enrollment => (
                    <li key={enrollment.id}>
                        <p>{enrollment.studentName} - {enrollment.courseName}</p>
                        <button onClick={() => setSelectedEnrollment(enrollment)}>View Details</button>
                    </li>
                ))}
            </ul>

            {selectedEnrollment && (
                <div>
                    <h2>Enrollment Details</h2>
                    <p>Student: {selectedEnrollment.studentName}</p>
                    <p>Course: {selectedEnrollment.courseName}</p>
                    <button onClick={() => handleAccept(selectedEnrollment.id)}>Accept</button>
                    <button onClick={() => handleReject(selectedEnrollment.id)}>Reject</button>
                </div>
            )}

            <div className="mt-8">
                <Link legacyBehavior href="/instructor">
                    <a className="text-blue-500 hover:text-blue-600">Back to Home</a>
                </Link>
            </div>
        </div>
    );
};

export default ManageEnrollments;
