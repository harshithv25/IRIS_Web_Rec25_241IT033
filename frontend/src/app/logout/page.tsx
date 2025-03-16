"use client";

import { useContext } from "react";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { logout } = useContext(AuthContext)!;
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen gap-2">
      <form
        className="p-8"
        onSubmit={(e) => {
          e.preventDefault();
          logout();
          router.push("/login");
        }}
      >
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Logout
        </button>
        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/login");
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
