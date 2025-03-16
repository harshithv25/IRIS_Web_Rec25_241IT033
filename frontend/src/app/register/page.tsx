"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";

export default function Register() {
  const { user, register } = useContext(AuthContext)!;

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: "",
    password: "",
    rollNumber: "",
    role: "user",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      {!user ? (
        <>
          <div className="flex justify-center items-center h-screen">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                register(
                  form.name,
                  form.email,
                  form.name,
                  form.rollNumber,
                  form.password,
                  "user"
                ).then(() => {
                  setLoading(false);
                  router.push("/login");
                });
              }}
              className="bg-gray p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-2xl font-bold mb-4">Register</h2>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={form.rollNumber}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="text-sm mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500">
                  Login
                </a>
              </p>
            </form>
          </div>
        </>
      ) : (
        router.push("/")
      )}
    </>
  );
}
