"use client"

import { useRouter  } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie';


export default function Page() {
  const router = useRouter()
  
  const [course, setCourse] = useState(JSON.parse(localStorage.getItem('courseData')));
  console.log(process.env.NEXT_PUBLIC_LEARN_API_URL);
  const handleSubmit = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_LEARN_API_URL + '/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('authToken')
        },
      body: JSON.stringify(course),
    });

    if(!response.ok) {
      console.error('Network response was not ok', response.status, response.statusText);
      return;
    }

    router.back();
  }

  return (
    <div>
      <h1>Add Course</h1>
      <h2>name</h2>
      <input type="text" className='border-4'  onChange={(e) => setCourse({ ...course, name: e.target.value })} />
      <br />
      <h2>content</h2>
      <textarea className='border-4'  onChange={(e) => setCourse({ ...course, content: e.target.value })} />
      <br />
      <h2>category</h2>
      <input type="text" className='border-4'  onChange={(e) => setCourse({ ...course, category: e.target.value })} />
      <br />
      <h2>capacity</h2>
      <input type="number" className='border-4'  onChange={(e) => setCourse({ ...course, capacity: e.target.value })} />
      <br />
      <h2>duration</h2>
      <input type="number" className='border-4'  onChange={(e) => setCourse({ ...course, duration: e.target.value })} />
      <br />
      <button className='border-4' onClick={handleSubmit} >Save</button>
      <button className='border-4' onClick={() => router.back()}>Cancel</button>
    </div>
  )
}