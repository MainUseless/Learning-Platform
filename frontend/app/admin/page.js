"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Homepage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = () => {
        const authToken = Cookies.get('authToken');

        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                router.push('/'+decodedToken['role'].toLowerCase()) 
                setUsername(decodedToken['name']);
                setRole(decodedToken['role']);
            } catch (error) {
                console.error('Error decoding auth token:', error);
            }
        }
        else{
            router.push('/signin');
        }
    }
    
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
                        <Link legacyBehavior href="admin/courses" passHref>
                            <a className="text-blue-500 hover:text-blue-600">Courses</a>
                        </Link>
                    </li>
                    <li>
                        <Link legacyBehavior href="admin/accounts" passHref>
                            <a className="text-blue-500 hover:text-blue-600">Accounts</a>
                        </Link>
                    </li>
                    <li>
                        <Link legacyBehavior href="admin/statistics" passHref>
                            <a className="text-blue-500 hover:text-blue-600">Statistics</a>
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="text-blue-500 hover:text-blue-600">Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Homepage;