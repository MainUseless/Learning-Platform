"use client";

import { useState,useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation'

const RegistrationForm = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        affiliation: '',
        years_of_experience: '',
        bio: '',
        role: 'STUDENT',
    });
    const [errors, setErrors] = useState({});
    const [registrationError, setRegistrationError] = useState(null);
    const [yearsOfExperience, setYearsOfExperience] = useState(null);


    // const checkLogin = () => {
    //     console.log('checking login')
    //     if(document.cookie){
    //         console.log('redirecting')
    //         redirect('/')
    //     }
    // };

    // useEffect(() => {
    //     checkLogin();
    // })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
        ...formState,
        [name]: value,
        });

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
        !formState.yearsOfExperience ||
        isNaN(formState.yearsOfExperience) ||
        Number(formState.yearsOfExperience) <= 0
        ) {
        newErrors.yearsOfExperience = 'Years of experience must be a positive number';
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

            // Redirect to the login page
            redirect('/login');
            
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

                { formState.accountType === 'instructor' && (
                    <div className="mb-4">
                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                        </label>
                        <input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        max="50"
                        className={`mt-1 p-2 block w-full border rounded ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
                        value={formState.yearsOfExperience}
                        onChange={handleChange}
                        />
                        {errors.yearsOfExperience && <div className="text-red-500 text-sm">{errors.yearsOfExperience}</div>}
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
          <Link href="/login" className="text-blue-500 hover:text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
    );
};

export default RegistrationForm;