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

    const handleUnenroll = async (event) => {
        try {
            const authToken = Cookies.get('authToken');
            const enrollmentId = Number(event.target.id);
            const response = await fetch(`http://localhost:8080/learn/enrollment?course_id=${enrollmentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to unenroll from the course');
            } else {
                alert('Unenrollment request sent');
            }
        } catch (error) {
            console.error('Error unenrolling from the course:', error);
        }
    }

    const handleReview = async (event) => {
        try {
            const authToken = Cookies.get('authToken');
            const course_id = Number(event.target.id);
            const rating = event.target.previousSibling.value;
            const review = event.target.previousSibling.previousSibling.previousSibling.value;
            const response = await fetch(`http://localhost:8080/learn/enrollment/review`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    course_id: course_id.toString(),
                    rating: rating,
                    review: review
                })
            });
            if (!response.ok) {
                throw new Error('Failed to review the course');
            } else {
                alert('Review submitted');
            }
        } catch (error) {
            console.error('Error reviewing the course:', error);
        }

    }  

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
                            <div className="border-cyan-300 border-spacing-7 border-7">
                                <Card data={enrollment} />
                                <div className="border-cyan-600 border-spacing-7 border-4">
                                    <h2>course name :{enrollment.course.name}</h2>
                                    <h2>course id :{enrollment.course.id}</h2>
                                    <h2>course rating :{enrollment.course.rating}</h2>
                                </div>
                                {(enrollment.status == "ACCEPTED")&&
                                    <div>
                                        <h2>review</h2>
                                        <textarea placeholder={enrollment.review}></textarea>
                                        <h2>rating</h2>
                                        <input type="number" min="1" max="5" placeholder={enrollment.rating}></input>
                                        <button className="px-4 py-2 bg-blue-500 text-black rounded" id={enrollment.course.id} onClick={handleReview}>submit</button>
                                        <button className="px-4 py-2 bg-blue-500 text-black rounded" id={enrollment.course.id} onClick={handleUnenroll}> Unenroll</button>
                                    </div>
                                }
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
