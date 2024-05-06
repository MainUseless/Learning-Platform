"use client";

import { useState } from 'react';
import Link from 'next/link';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    const checkLogin = () => {
        console.log('checking login')
        if(document.cookie){
            console.log('redirecting')
            redirect('/')
        }
    };

    checkLogin();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-96 p-8 bg-white shadow-lg rounded-lg text-black">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                    Login
                </h2>
                <form>
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
                </form>

                <p className="mt-4 text-center">
                    Don't have an account?
                    <Link href="/register"
                        className="text-blue-500 hover:text-blue-600 ml-1"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;