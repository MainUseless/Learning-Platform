"use client";

import {useState, useEffect } from 'react';
import Link from 'next/link';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Signin = () => {
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if(authToken){
            const decodedToken = jwtDecode(authToken);
            router.push('/'+decodedToken['role'].toLowerCase());
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await fetch('http://localhost:8081/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                const authToken = data.token;
                console.log(authToken);
                Cookies.set('authToken', authToken, { expires: 7 });
                router.push('/student');
            } else {
                const errorMessage = await res.json();
                setError(errorMessage.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-96 p-8 bg-white shadow-lg rounded-lg text-black">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={`mt-1 p-2 block w-full border rounded`}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={`mt-1 p-2 block w-full border rounded`}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Login
                    </button>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                </form>

                <p className="mt-4 text-center">
                    Don't have an account?
                    <Link href="/signup"
                        className="text-blue-500 hover:text-blue-600 ml-1"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signin;