"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import the js-cookie library
import Course from '../../components/Course';

const Courses = () => {
    const router = useRouter();
    const [pendingCourses, setPendingCourses] = useState([]);
    const [approvedCourses, setApprovedCourses] = useState([]);

    const fetchCourses = async (status) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_LEARN_API_URL + '/course?status=' + status, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('authToken') || ''
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    useEffect(() => {
        fetchCourses('pending').then(data => {
            setPendingCourses(data);
            console.log(data);
            console.log("Pending Courses");
        });
        fetchCourses('approved').then(data => {
            setApprovedCourses(data);
            console.log(data);
            console.log("Approved Courses");
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">

            <nav className="mb-8">
                <div class="container flex flex-row space-x-7">
                    <div class="developer flex-grow-1">
                        <h1 className="text-2xl font-semibold mb-4">Approved Courses</h1>
                        {approvedCourses.map(course => (
                            <Course key={course.id} course={course} />
                        ))}
                    </div>
                    <div class="developer flex-grow-1"> 
                        <h1 className="text-2xl font-semibold mb-4">Pending Courses</h1>
                        {pendingCourses.map(course => (
                            <Course key={course.id} course={course} />
                        ))}
                    </div>
                </div>

                <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-600">Back</button>

            </nav>
        </div>
    );
};

export default Courses;