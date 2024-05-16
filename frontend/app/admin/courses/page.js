"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import the js-cookie library
import Card from '../../../public/components/Card';

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
        localStorage.clear();
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
                        {approvedCourses && approvedCourses.map(course => (
                            <p>
                                <Card data={course[0]} path={'/admin/courses/'} />
                                <p>rating : {course[1] == null ? 0 : course[1]} </p>
                            </p>
                        ))}
                    </div>
                    <div class="developer flex-grow-1"> 
                        <h1 className="text-2xl font-semibold mb-4">Pending Courses</h1>
                        {pendingCourses && pendingCourses.map(course => (
                            <p>
                                <Card data={course[0]} path={'/admin/courses/'} />
                                <p>rating : {course[1] == null ? 0 : course[1]} </p>
                            </p>
                        ))}
                    </div>
                </div>

                <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-600">Back</button>

            </nav>
        </div>
    );
};

export default Courses;