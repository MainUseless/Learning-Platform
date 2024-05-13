"use client";

import { useState,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const RegistrationForm = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        affiliation: '',
        years_of_experience: '',
        bio: '',
        role: 'student',
    });
    const [errors, setErrors] = useState({});
    const [registrationError, setRegistrationError] = useState(null);
    const [years_of_experience, setyears_of_experience] = useState(null);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if(authToken){
            const decodedToken = jwtDecode(authToken);
            decodedToken['role'] == "student" ? router.push('/student') : decodedToken['role'] == "instructor" ? router.push('/instructorHome') : router.push('/adminHome');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
        ...formState,
        [name]: value,
        });

        if (name === 'accountType') {
            setFormState({
                ...formState,
                role: value === 'instructor' ? 'instructor' : 'student',
            });
        }

        if (errors[name]) {
        // Clear the error for this field if it changes
        setErrors({
            ...errors,
            [name]: null,
        });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
    
        if (!formState.name) {
        newErrors.name = 'Name is required';
        }
    
        if (!formState.email || !/\S+@\S+\.\S+/.test(formState.email)) {
        newErrors.email = 'Invalid email address';
        }
    
        if (!formState.password || formState.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        }
    
        if (!formState.affiliation) {
        newErrors.affiliation = 'Affiliation is required';
        }
        if (
        !formState.years_of_experience ||
        isNaN(formState.years_of_experience) ||
        Number(formState.years_of_experience) <= 0
        ) {
        newErrors.years_of_experience = 'Years of experience must be a positive number';
        }
    
        if (!formState.bio) {
        newErrors.bio = 'Bio is required';
        }
    
        return newErrors;
    };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
    
        try {
            setRegistrationError(null);
            console.log('Registering with:', formState);
            
            // Send the registration request
            const response = await fetch('http://localhost:8081/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            router.push('/signin');
            
        } catch (error) {
            setRegistrationError(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
            <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                Register
                </h2>
                <form onSubmit={handleSubmit}> 
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                    </label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    className={`mt-1 p-2 block w-full border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.name}
                    onChange={handleChange}
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                    </label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    className={`mt-1 p-2 block w-full border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.email}
                    onChange={handleChange}
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                    </label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    className={`mt-1 p-2 block w-full border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.password}
                    onChange={handleChange}
                    />
                    {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
                    Affiliation
                    </label>
                    <input
                    id="affiliation"
                    name="affiliation"
                    type="text"
                    className={`mt-1 p-2 block w-full border rounded ${errors.affiliation ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.affiliation}
                    onChange={handleChange}
                    />
                    {errors.affiliation && <div className="text-red-500 text-sm">{errors.affiliation}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                    Account Type
                    </label>
                    <select
                    id="accountType"
                    name="accountType"
                    className={`mt-1 p-2 block w-full border rounded ${errors.accountType ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.accountType}
                    onChange={handleChange}
                    >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    </select>
                    {errors.accountType && <div className="text-red-500 text-sm">{errors.accountType}</div>}
                </div>

                { formState.role === 'instructor' && (
                    <div className="mb-4">
                        <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                        </label>
                        <input
                        id="years_of_experience"
                        name="years_of_experience"
                        type="number"
                        min="0"
                        max="50"
                        className={`mt-1 p-2 block w-full border rounded ${errors.years_of_experience ? 'border-red-500' : 'border-gray-300'}`}
                        value={formState.years_of_experience}
                        onChange={handleChange}
                        />
                        {errors.years_of_experience && <div className="text-red-500 text-sm">{errors.years_of_experience}</div>}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                    </label>
                    <textarea
                    id="bio"
                    name="bio"
                    className={`mt-1 p-2 block w-full border rounded ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                    value={formState.bio}
                    onChange={handleChange}
                    />
                    {errors.bio && <div className="text-red-500 text-sm">{errors.bio}</div>}
                </div>

                {registrationError && (
                    <div className="text-red-500 text-sm mb-4">{registrationError}</div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Register
                </button>
                </form>

        <p className="mt-4 text-center">
          Already have an account?
          <Link href="/signin" className="text-blue-500 hover:text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
    );
};

export default RegistrationForm;