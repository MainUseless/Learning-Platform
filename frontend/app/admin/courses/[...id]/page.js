"use client"

import { useRouter  } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'; // Import the js-cookie library

export default function Page() {
  const router = useRouter()
  
  const [course, setCourse] = useState(JSON.parse(localStorage.getItem('courseData')));

  const handleSave = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_LEARN_API_URL + '/course/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('authToken')
        },
      body: JSON.stringify(course),
    });
    if(response.ok)
      alert('Course updated successfully');
    else
      alert('Error updating course');
    router.back();
  }

  const handleDelete = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_LEARN_API_URL + '/course/' + course.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application',
        'Authorization': 'Bearer ' + Cookies.get('authToken')
      }
    });
    if(response.ok)
      alert('Course deleted successfully');
    else
      alert('Error deleting course');
    router.back();
  }
  return (
    <div>
      <h1>Edit Course</h1>
      <h2>id: {course.id}</h2>
      <h2>name</h2>
      <input type="text" className='border-4' value={course.name} onChange={(e) => setCourse({ ...course, name: e.target.value })} />
      <br />
      <h2>content</h2>
      <textarea className='border-4' value={course.content} onChange={(e) => setCourse({ ...course, content: e.target.value })} />
      <br />
      <h2>category</h2>
      <input type="text" className='border-4' value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })} />
      <br />
      <h2>capacity</h2>
      <input type="number" className='border-4' value={course.capacity} onChange={(e) => setCourse({ ...course, capacity: e.target.value })} />
      <br />
      <h2>duration</h2>
      <input type="number" className='border-4' value={course.duration} onChange={(e) => setCourse({ ...course, duration: e.target.value })} />
      <br />
      <h2>status</h2>
      <select className='border-4' value={course.status} onChange={(e) => setCourse({ ...course, status: e.target.value })}>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
      </select>
      <br />
      <button className='border-4' onClick={handleSave} >Save</button>
      <button className='border-4' onClick={() => router.back()}>Cancel</button>
      <button className='border-4' onClick={handleDelete}>Delete!!!</button>
    </div>
  )
}