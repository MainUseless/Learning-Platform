import React from 'react';
import Link from 'next/link';

const Course = ({course}) => {

    const handleUpdate = async () => {

    }

    const onChangHandler = (e) => {
        console.log(e.target.value);
        course.console = e.target.value;
    }

    return (
        // <Link legacyBehavior href={`/course/${course.id}`}>
            <div className='border-solid border-2'>
                <h2>{course.name}</h2>
                <p>Id : {course.id}</p>
                <p>category: {course.category}</p>
                <p>capacity: {course.capacity}</p>
                <p>duration: {course.duration}</p>
                <input type="text" onChange={onChangHandler} value={course.content}/>
                <p>status: {course.status}</p>
                {
                    course.status == 'approved' ? (
                        <button  onClick={handleUpdate}>reject</button>
                    ) : (
                        <button  onClick={handleUpdate}>reject</button>
                    )
                }
            </div>
        // </Link>
    );
};

export default Course;