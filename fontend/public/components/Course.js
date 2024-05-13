'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Course = ({path,course}) => {

    const [courseData, setCourseData] = useState(course);
    const router = useRouter();
    const handleClick = (e) => {
        e.preventDefault();
        const data = JSON.stringify(courseData);
        localStorage.setItem('courseData', data);
        router.push(`${path}${course.id}`);
    }

    return (
        <a onClick={handleClick}>
        {/* <Link  legacyBehavior href={{ pathname: `${path}${course.id}`, query: { data: JSON.stringify(course) } }}> */}
            <div className='border-solid border-5'>
                <h2>{course.name}</h2>
                <p>Id : {course.id}</p>
                <p>category: {course.category}</p>
                <p>capacity: {course.capacity}</p>
                <p>duration: {course.duration}</p>
                <p>content: {course.content}</p>
            </div>
        {/* </Link> */}
        </a>
    );
};

export default Course;