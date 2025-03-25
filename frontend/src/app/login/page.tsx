"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/utils/formValidations";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    if (step === 1) {
      if (!validateEmail(form.email)) {
        setErr({ isErr: true, errMessage: "Enter a valid email address." });
        setForm({ ...form, email: "" });
      } else {
        setErr({ isErr: false, errMessage: "" });
        setStep(2);
      }
    }
    if (step === 2) {
      if (form.password.length < 6) {
        setErr({
          isErr: true,
          errMessage: "Password too short!",
        });
      } else {
        setErr({ isErr: false, errMessage: "" });
        login(form.email, form.password)
          .then(() => {
            router.push("/");
          })
          .catch(async (e: any) => {
            setErr({ isErr: true, errMessage: await e.json().message });
            setForm({ email: "", password: "" });
            setStep(1);
          });
      }
    }
  };

  console.log(user);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      <div className="flex flex-col justify-center items-center min-h-screen relative z-10 w-full snap-y snap-mandatory px-12 mx-auto">
        {!user ? (
          <>
            <div className="p-6 rounded-xl backdrop-blur shadow-lg w-96 text-white border-1 border-[#6770d2]">
              <div className="flex justify-center mb-4">
                <Image
                  src="/media/noBgColor.png"
                  alt="Logo"
                  width={200}
                  height={100}
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Log In
              </h2>

              {err.isErr ? (
                <>
                  <p className="text-sm text-red-400 mb-6 text-center">
                    {err.errMessage}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-6 text-center">
                    Login to manage your bookings!
                  </p>
                </>
              )}

              {/* Form */}
              <div className="overflow-hidden relative h-13">
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: step === 2 ? "-50%" : "0%" }}
                  transition={{ duration: 0.3 }}
                  className="flex w-[200%]"
                >
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                    />
                  </div>

                  <div className="w-full flex items-center relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                    />
                    <button
                      className="absolute right-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={handleClick}
                className="w-full cursor-pointer p-2 mt-4 rounded-lg text-white font-semibold border-3 border-[#3e3e3e]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  {step === 1 ? "Next" : "Log In"}
                </span>
              </button>

              <div className="flex justify-center mt-3 text-sm text-gray-400">
                <a
                  href="/register"
                  className="cursor-pointer hover:underline font-bold"
                >
                  Register Now
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 rounded-xl backdrop-blur shadow-lg w-96 text-white border-1 border-[#6770d2]">
            <h1>
              You are already logged in. {user?.name}
              <button
                onClick={() =>
                  router.push(`/logout?token=${localStorage.getItem("token")}`)
                }
                className="cursor-pointer flex items-center gap-1 hover:underline"
              >
                <LogOut size={16} /> Logout
              </button>
            </h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
