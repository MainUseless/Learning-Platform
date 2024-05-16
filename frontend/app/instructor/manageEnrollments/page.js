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
        
        if (!authToken)
            router.push('/signin');
        else {
            // Fetch student enrollments
            fetch('http://localhost:8080/learn/enrollment', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}, ${response.statusText}`);
                }
                return response.json();
            })
            .then(enrollmentsData => {
                setEnrollments(enrollmentsData);
                enrollmentsData.forEach(enrollment => {
                    fetchStudentName(authToken, enrollment.student_id)
                        .then(studentName => {
                            const updatedEnrollments = enrollments.map(enrollmentItem => {
                                if (enrollmentItem.id === enrollment.id) {
                                    return { ...enrollmentItem, studentName };
                                }
                                return enrollmentItem;
                            });
                            setEnrollments(updatedEnrollments);
                        })
                        .catch(error => {
                            console.error('Error fetching student name:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching student enrollments:', error);
            });
        }
    }, [router]);

    const fetchStudentName = async (authToken, studentId) => {
        const response = await fetch(`http://localhost:8081/user?id=${studentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching student name: ${response.status}, ${response.statusText}`);
        }
        const userData = await response.json();
        return userData.name;
    };

    const handleAccept = (courseId) => {
        updateEnrollmentStatus(courseId, 'ACCEPTED');
    };
    
    const handleReject = (courseId) => {
        updateEnrollmentStatus(courseId, 'REJECTED');
    };

    const updateEnrollmentStatus = (courseId, status) => {
        const authToken = Cookies.get('authToken');
        
        fetch(`http://localhost:8080/learn/enrollment/updateEnrollment?course_id=${courseId}&status=${status}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, ${response.statusText}`);
            }
            window.location.reload();
        })
        .catch(error => {
            console.error('Error updating enrollment:', error);
        });
    };

    return (
        <div className="flex flex-col items-left justify-top min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-semibold mb-8">Manage Enrollments</h1>

            <ul>
                {enrollments.map(enrollment => (
                    <li key={enrollment.id}>
                        <p>{enrollment.studentName ? enrollment.studentName : "Loading..."} - {enrollment.courseName}</p>
                        <button onClick={() => setSelectedEnrollment(enrollment)}>View Details</button>
                    </li>
                ))}
            </ul>

            {selectedEnrollment && (
                <div>
                    <h2>Enrollment Details</h2>
                    <p>Student: {selectedEnrollment.studentName ? selectedEnrollment.studentName : "Loading..."}</p>
                    <p>Course: {selectedEnrollment.courseName}</p>
                    <button onClick={() => handleAccept(selectedEnrollment.course_id)}>Accept</button>
                    <button onClick={() => handleReject(selectedEnrollment.course_id)}>Reject</button>
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
