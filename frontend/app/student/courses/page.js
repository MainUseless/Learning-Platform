"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../../../public/components/Card';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Courses = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOption, setSearchOption] = useState('name');
    const [sortByRatings, setSortByRatings] = useState(false);
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
    
        if(!authToken)
            router.push('/signin');
        // Fetch courses from the backend when the component mounts
        fetchCourses();
    }, []);
    const fetchCourses = async () => {
        const authToken = Cookies.get('authToken');
        try {
            const response = await fetch('http://localhost:8080/learn/course', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const handleEnroll = async (event) => {
        try {
            const authToken = Cookies.get('authToken');
            const courseId = Number(event.target.id);
            const response = await fetch(`http://localhost:8080/learn/enrollment?course_id=${courseId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to enroll in the course');
            }else{
                alert('enrollment request sent');
            }

        } catch (error) {
            console.error('Error enrolling in the course:', error);
        }
    }

    const handleSearch = async () => {
        let filtered = courses.filter(course => {
            if (searchOption === 'name') {
                return course[0].name.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchOption === 'category') {
                return course[0].category.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
        setFilteredCourses(filtered);
    };

    return (
        <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 text-black">
            <div className="container mx-auto w-full">
                <h1 className="text-2xl font-semibold mb-8">Courses</h1>

                <div className="mt-8">
                <Link legacyBehavior href="/student">
                    <a className="text-blue-500 hover:text-blue-600">Back to Home</a>
                </Link>
                </div>

                <div className="flex items-center mb-4 w-full">
                    <input
                        type="text"
                        className="mr-2 p-2 border border-gray-300 rounded flex-grow"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="mr-2 p-2 border border-gray-300 rounded"
                        value={searchOption}
                        onChange={e => setSearchOption(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="category">Category</option>
                    </select>

                    <div className="mr-4"></div> {/* Add space between checkboxes */}
                    <button
                        className="mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                <div className="w-full">
                    <ul>
                        {
                        filteredCourses &&
                        filteredCourses.map(course => (
                            <li className="bg-white p-4 rounded shadow mb-4">
                                <div>
                                    <Card data={course[0]}  />
                                    <p>rating : {course[1] == null ? 0 : course[1]} </p>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-blue py-2 px-4 rounded" id={course[0].id} onClick={(event) => handleEnroll(event)}>Enroll</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Courses;
