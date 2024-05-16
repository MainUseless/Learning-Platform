"use client"

import { useRouter  } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'; // Import the js-cookie library

export default function Page() {
  const router = useRouter()
  
  const [account, setAccount] = useState(JSON.parse(localStorage.getItem('data')));

  console.log(account)

  const handleSave = async () => {
    // account.is_locked = account.is_locked == 'true';
    account.years_of_experience = parseInt(account.years_of_experience);
    account.id = parseInt(account.id);
    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL + '/users/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('authToken')
        },
      body: JSON.stringify(account),
    }).then(response => {
      console.log(response.json())
      if(response.ok)
        alert('Account updated successfully');
      else
        alert('Error updating account');
      router.back();
    })
  }

  return (
    <div>
      <h1>Edit Account</h1>
      <h2>id: {account.id}</h2>
      <h2>name</h2>
      <input type="text" className='border-4' value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
      <br />
      <h2>bio</h2>
      <textarea className='border-4' value={account.bio} onChange={(e) => setAccount({ ...account, bio: e.target.value })} />
      <br />
      <h2>affiliation</h2>
      <textarea className='border-4' value={account.affiliation} onChange={(e) => setAccount({ ...account, affiliation: e.target.value })} />
      <br />
      <h2>password</h2>
      <input type="text" className='border-4' value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} />
      <br />
      <h2>years_of_experience</h2>
      <input type="number" className='border-4' value={account.years_of_experience} onChange={(e) => setAccount({ ...account, years_of_experience: e.target.value })} />
      <br />
      <h2>role</h2>
      <select className='border-4' value={account.role.toUpperCase()} onChange={(e) => setAccount({ ...account, role: e.target.value })}>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="STUDENT">Student</option>
        <option value="ADMIN">Admin</option>
      </select>
      <h2>is_locked</h2>
      <select className='border-4' value={account.is_locked} onChange={(e) => setAccount({ ...account, is_locked: e.target.value=='true' })}>
        <option value={true}>locked</option>
        <option value={false}>unlocked</option>
      </select>
      <br />
      <button className='border-4' onClick={handleSave} >Save</button>
      <button className='border-4' onClick={() => router.back()}>Cancel</button>
      {/* <button className='border-4' onClick={handleDelete}>Delete!!!</button> */}
    </div>
  )
}