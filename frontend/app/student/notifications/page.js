"use client";

import { useState, useEffect,useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Notifications = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const initialized = useRef(false);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (!initialized.current) {
            initialized.current = true
            fetchNotifications();
            console.log('i fire once');
            
          }
        if(!authToken)
            router.push('/signin');

    }, []);
    
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8082/notifications',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            console.log(data);
            setNotifications(data.reverse());
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 text-black">
            <div className="container mx-auto w-full">
                <h1 className="text-2xl font-semibold mb-8">Notifications</h1>
                <div className="mt-8">
                    <Link legacyBehavior href="/student">
                        <a className="text-blue-500 hover:text-blue-600">Back to Home</a>
                    </Link>
                </div>

                <div className="w-full">
                    <ul>
                        {notifications.map(notification => (
                            <li key={notification.id} className={notification.is_read==1 ? "bg-white p-4 rounded shadow mb-4" : "bg-red-500 p-4 rounded shadow mb-4" }>
                                <p>{notification.message}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
