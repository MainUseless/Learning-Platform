"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import the js-cookie library
import Card from '../../../public/components/Card';

const Courses = () => {
    const router = useRouter();
    const [accounts,setAccounts] = useState([])

    const fetchAccounts = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL + '/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('authToken') || ''
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    useEffect(() => {
        localStorage.clear();
        fetchAccounts().then(data => {
            setAccounts(data);
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">

            <nav className="mb-8">
                <div class="container flex flex-row space-x-7">
                    <div class="developer flex-grow-1">
                        <h1 className="text-2xl font-semibold mb-4">User Accounts</h1>
                        {accounts.map(account => (
                            <Card key={account.id} data={account} path={'/admin/accounts/'} />
                        ))}
                    </div>
                </div>

                <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-600">Back</button>

            </nav>
        </div>
    );
};

export default Courses;