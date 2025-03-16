"use client";
import { useContext, useState } from "react";
import { AuthContext, useAuth } from "../../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  return (
    <>
      {!user ? (
        <div className="flex justify-center items-center min-h-screen">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email, password);
            }}
            className="bg-gray p-8 rounded-lg shadow-md w-96"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <div className="mb-4">
              <label className="block text-white-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Login
            </button>

            <p className="mt-4 text-center text-gray-600">
              Dont have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
            <p className="text-center text-gray-600">
              <a href="/logout" className="text-blue-500 hover:underline">
                Logout
              </a>
            </p>
          </form>
        </div>
      ) : (
        <>
          <h1>You are already logged in. {user?.name}</h1>
        </>
      )}
    </>
  );
}
