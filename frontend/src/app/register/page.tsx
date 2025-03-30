"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { validateRegister } from "@/utils/formValidations";
import { capitalize } from "@/utils/capitalize";

export default function Register() {
  const { user, register } = useContext(AuthContext)!;

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: "",
    roll_number: "",
    password: "",
    role: "",
  });
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setErr({
      ...err,
      isErr: validateRegister(form).isErr,
      errMessage: validateRegister(form).errMessage,
    });
    console.log(err, validateRegister(form));
    if (validateRegister(form).isErr) {
      setForm({
        name: "",
        email: "",
        branch: "",
        roll_number: "",
        password: "",
        role: "",
      });
      setLoading(false);
    } else {
      setErr({ isErr: false, errMessage: "" });
      register(
        capitalize(form.name),
        form.email,
        (form.branch),
        form.roll_number,
        form.password,
        capitalize(form.role)
      )
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            setForm({
              name: "",
              email: "",
              branch: "",
              roll_number: "",
              password: "",
              role: "",
            });
            setLoading(false);
          } else {
            setErr(res);
            router.push("/");
          }
        })
        .catch((e) => {
          setErr(e);
          setForm({
            name: "",
            email: "",
            branch: "",
            roll_number: "",
            password: "",
            role: "",
          });
          setLoading(false);
        });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />

      {!user && (
        <>
          <div className="flex flex-col justify-center items-center min-h-screen relative z-10 w-full snap-y snap-mandatory px-12 mx-auto">
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-xl backdrop-blur shadow-lg w-96 text-white border-1 border-[#6770d2]"
            >
              <div className="flex justify-center mb-5">
                <Image
                  src="/media/noBgColor.png"
                  alt="Logo"
                  width={200}
                  height={100}
                />
              </div>
              <h2 className="text-2xl text-center font-bold text-white mb-5">
                Register
              </h2>

              {err.isErr && (
                <p className="text-sm text-red-400 mb-3 text-center">
                  {err.errMessage}
                </p>
              )}

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-3 p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full mb-3 p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full mb-3 p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                required
              />
              <input
                type="text"
                name="roll_number"
                placeholder="Roll Number"
                value={form.roll_number}
                onChange={handleChange}
                className="w-full mb-3 p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                required
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={form.role}
                onChange={handleChange}
                className="w-full mb-3 p-3 bg-[#06070E] text-white rounded-lg border-3 border-[#3e3e3e] focus:outline-none"
                required
              />
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

              <button
                type="submit"
                className="w-full cursor-pointer p-2 mt-4 rounded-lg text-white font-semibold border-3 border-[#3e3e3e]"
                disabled={loading}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  {loading ? "Registering..." : "Register"}
                </span>
              </button>

              <p className="flex justify-center mt-3 mb-2 text-sm text-gray-400">
                Already have an account?
                <a
                  href="/login"
                  className="pl-1 cursor-pointer hover:underline font-bold text-gray-100"
                >
                  Login
                </a>
              </p>
            </form>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
