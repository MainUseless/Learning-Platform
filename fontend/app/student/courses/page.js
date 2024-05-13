"use client";

import { useState, useEffect } from 'react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOption, setSearchOption] = useState('name');
    const [sortByRatings, setSortByRatings] = useState(false);
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        // Fetch courses from the backend when the component mounts
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('https://example.com/api/courses');
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
                                <h2 className="text-xl font-semibold">{course.name}</h2>
                                <p className="text-gray-500">{course.category}</p>
                                <p className="text-blue-500">{course.rating}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Courses;
