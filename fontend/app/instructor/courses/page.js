"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Course from '../../../public/components/Course';
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
    };

    const handleSearch = () => {
        let filtered = courses.filter(course => {
            if (searchOption === 'name') {
                return course.name.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchOption === 'category') {
                return course.category.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });

        if (sortByRatings) {
            filtered.sort((a, b) => b.rating - a.rating);
        }

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

                    <button
                        className="mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={sortByRatings}
                            onChange={e => setSortByRatings(e.target.checked)}
                        />
                        Sort by Ratings
                    </label>
                </div>

                <div className="w-full">
                    <ul>
                        {filteredCourses.map(course => (
                            <li key={course.id} className="bg-white p-4 rounded shadow mb-4">
                                <Course key={course.id} course={course} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Courses;
