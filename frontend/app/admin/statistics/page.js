"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Statistics = () => {
    const router = useRouter();
    const [studentsCount, setStudentsCount] = useState(0);
    const [instructorsCount, setInstructorsCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [showCourses, setShowCourses] = useState(false);
    const [showEnrollments, setShowEnrollments] = useState(false);

    useEffect(() => {
        const authToken = Cookies.get('authToken');

        if (!authToken)
            router.push('/signin');
        else {
            fetchStatistics(authToken);
        }
    }, [router]);

    const fetchStatistics = async (authToken) => {
        try {
            await fetchUsers(authToken);
            await fetchCourses(authToken);
            await fetchEnrollments(authToken);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const fetchUsers = async (authToken) => {
        try {
            const response = await fetch('http://localhost:8081/users', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const usersData = await response.json();
            setUsers(usersData);
            countUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCourses = async (authToken) => {
        try {
            const response = await fetch('http://localhost:8080/learn/course', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const coursesData = await response.json();
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchEnrollments = async (authToken) => {
        try {
            const response = await fetch('http://localhost:8080/learn/enrollment', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch enrollments');
            }
            const enrollmentsData = await response.json();
            setEnrollments(enrollmentsData);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const countUsers = (users) => {
        let studentCount = 0;
        let instructorCount = 0;
        users.forEach(user => {
            if (user.role === 'student') {
                studentCount++;
            } else if (user.role === 'instructor') {
                instructorCount++;
            }
        });
        setStudentsCount(studentCount);
        setInstructorsCount(instructorCount);
    };

    return (
        <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-semibold mb-8">Statistics</h1>
            
            <div className="container mx-auto w-full">
                <div className="mt-8">
                    <Link legacyBehavior href="/instructor">
                        <a className="text-blue-500 hover:text-blue-600">Back to Home</a>
                    </Link>
                </div>

                <div className="my-4">
                    <p><strong>Number of Students in system:</strong> {studentsCount}</p>
                    <p><strong>Number of Instructors in system:</strong> {instructorsCount}</p>
                </div>

                <div className="my-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={() => setShowCourses(!showCourses)}
                    >
                        {showCourses ? 'Hide' : 'Show'} Most Popular Courses
                    </button>
                </div>

                {showCourses && (
                    <div className="my-4">
                        <ul>
                            {courses.map(course => (
                                <li key={course.id} className="bg-white p-4 rounded shadow mb-4">
                                    <p>Course: {course[0].name}</p>
                                    <p>Rating: {course[1]}</p>
                                    <p>Number of Enrollments: {course[2]}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="my-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={() => setShowEnrollments(!showEnrollments)}
                    >
                        {showEnrollments ? 'Hide' : 'Show'} All Enrollments
                    </button>
                </div>

                {showEnrollments && (
                    <div className="my-4">
                        <h2 className="text-xl font-semibold mb-4">All Enrollments</h2>
                        <ul>
                            {enrollments.map(enrollment => (
                                <li key={enrollment.id} className="bg-white p-4 rounded shadow mb-4">
                                    <p>Course Name: {enrollment.course.name}</p>
                                    <p>Student Id: {enrollment.id}</p>
                                    <p>Student Rating: {enrollment.rating}</p>
                                    <p>Review: {enrollment.review ? enrollment.review : "This student did not review yet"}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
