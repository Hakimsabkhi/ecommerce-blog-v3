"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { pic4 } from '@/assets/image'; // Ensure path is correct
interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  repeatPassword?:string;
}
const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    lastname: ''
  });

  // Update the error state to allow 'general' errors
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    repeatPassword?: string;
    name?: string;
    lastname?: string;
    general?: string;  // Allow a general error message
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({}); // Reset errors before validating

    const newErrors: Errors  = {};

    // Check if fields are filled
    if (!credentials.name) newErrors.name = "Name is required.";
    if (!credentials.lastname) newErrors.lastname = "Last name is required.";
    if (!credentials.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (credentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(credentials.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(credentials.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(credentials.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(credentials.password)) {
      newErrors.password = "Password must contain at least one special character.";
    }
    
    if (credentials.password !== credentials.repeatPassword) newErrors.repeatPassword = "Passwords do not match.";

    // If there are any errors, set them and return early
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('lastname', credentials.lastname);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      formData.append('role', 'Visiteur'); // Default role

      const result = await fetch(`/api/auth/signup`, {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();

      if (result.ok) {
        router.push('/');
      } else {
        setError({ general: data.message || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      console.error("An error occurred. Please try again.", error);
      setError({ general: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-gray-100">
      <div className="bg-black/60 opacity-80 absolute h-full w-full"></div>
      <Image className="w-full h-screen object-cover" src={pic4} alt="Background Image" />
      <div className="bg-white absolute p-8 rounded shadow-md w-full max-md:w-3/4 max-w-md">
        <h1 className="text-2xl max-md:text-xl text-center font-bold mb-6">Sign Up for an Account</h1>
        
        {/* Displaying general error at the top */}
        {error.general && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={credentials.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline ${error.name ? 'border-red-500' : ''}`}
            />
            {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={credentials.lastname}
              onChange={handleChange}
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline ${error.lastname ? 'border-red-500' : ''}`}
            />
            {error.lastname && <p className="text-red-500 text-sm mt-1">{error.lastname}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={credentials.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline ${error.email ? 'border-red-500' : ''}`}
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="•••••••••"
              value={credentials.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline ${error.password ? 'border-red-500' : ''}`}
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="repeatPassword"
              placeholder="•••••••••"
              value={credentials.repeatPassword}
              onChange={handleChange}
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline ${error.repeatPassword ? 'border-red-500' : ''}`}
            />
            {error.repeatPassword && <p className="text-red-500 text-sm mt-1">{error.repeatPassword}</p>}
          </div>
          <div className="flex justify-between items-center max-md:text-xs mb-4">
            <div className="flex items-center h-5">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-5 h-5 rounded bg-gray-400"
                aria-label="Show Password"
              />
              <label htmlFor="showPassword" className="ms-2 font-bold text-gray-700">Show Password</label>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded-lg focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-blue-600 hover:text-blue-400 font-bold py-2 px-4 w-full focus:shadow-outline"
            >
              Have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
