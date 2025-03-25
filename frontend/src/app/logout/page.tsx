"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Logout({ params }: { params: { token: string } }) {
  const { logout } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (params.token === localStorage.getItem("token")) {
      logout();
      router.push("/login");
    } else {
      alert("Bad request");
      router.push("/");
    }
  }, [params.token]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <Navbar />
      <div className="flex flex-row justify-center items-center min-h-screen relative z-10 w-full snap-y snap-mandatory px-12 mx-auto gap-10">
        <form
          className="p-8 flex flex-col justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            logout();
            router.push("/login");
          }}
        >
          <button
            type="submit"
            className="w-55 cursor-pointer p-3 mt-4 rounded-lg text-white font-semibold border-3 border-[#3e3e3e]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Log Out
            </span>
          </button>
          <button
            type="button"
            className="w-55 cursor-pointer p-3 mt-4 rounded-lg text-white font-semibold border-3 border-[#3e3e3e]"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Login
            </span>
          </button>
        </form>
        <Footer />
      </div>
    </div>
  );
}
