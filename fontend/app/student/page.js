"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

const Homepage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);

    useEffect(() => {
        const authToken = Cookies.get('authToken');

        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUsername(decodedToken['name']);
                if(decodedToken['role']!='student'){
                    router.push('/'+decodedToken['role'].toLowerCase()) 
                }
                setRole(decodedToken['role']);
            } catch (error) {
                console.error('Error decoding auth token:', error);
            }
        }
        else{
            router.push('/signin');
        }
        
        fetch('http://localhost:8082/unreadnotification', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then(response => response.text())
        .then(data => {
            setPopupData(data);
            setShowPopup(true);
        })
        .catch(error => console.error('Error fetching pop-up data:', error));
    }, []);

    const handleLogout = () => {
        Cookies.remove('authToken');
        router.push('/signin');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <h1 className="text-2xl font-semibold mb-4">Welcome, {username} ({role})</h1>

            <nav className="mb-8">
                <ul className="flex flex-col space-y-2">
                    <li>
                        <Link legacyBehavior href="/student/enrollments">
                            <a className="text-blue-500 hover:text-blue-600">Enrollments</a>
                        </Link>
                    </li>
                    <li>
                        <Link legacyBehavior href="/student/courses" passHref>
                            <a className="text-blue-500 hover:text-blue-600">Courses</a>
                        </Link>
                    </li>
                    <li>
                        <Link legacyBehavior href="student/notifications" passHref>
                        <a className="text-blue-500 hover:text-blue-600">Notifications</a>
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="text-blue-500 hover:text-blue-600">Logout</button>
                    </li>
                </ul>
            </nav>

            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Pop-up Content</h2>
                        {/* Render pop-up data here */}
                        <button onClick={() => setShowPopup(false)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;