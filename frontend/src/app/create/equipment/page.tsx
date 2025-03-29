"use client";

import { useLayoutEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import {
  ChevronDown,
  HeartPulse,
  Home,
  Minus,
  Pi,
  Plus,
  Volleyball,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { validateEquipment } from "@/utils/formValidations";
import { useDataContext } from "@/context/DataContext";
import { useRouter } from "next/navigation";

const availableCategories = [
  "football",
  "cricket",
  "basketball",
  "chess",
  "billiards",
  "throwball",
  "kho-kho",
  "table-tennis",
  "tennis",
  "swimming",
  "hockey",
  "badminton",
  "kabaddi",
  "volleyball",
  "carrom",
  "misc",
];

const availableConditions = ["New", "Used", "Damaged"];

export default function CreateEquipment() {
  const { user } = useAuth();
  const { newEquipment } = useDataContext();

  const [form, setForm] = useState({
    admin_id: user?._id,
    name: "",
    category: "",
    quantity: 1,
    condition: "",
    available: true,
  });
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });
  const [dropdowns, setDropdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleQuantityChange = (delta: number) => {
    console.log("first");
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  useLayoutEffect(() => {
    if (user?.role !== "Admin") {
      throw Error("Something went wrong");
    }
  });

  const handleClick = () => {
    setLoading(true);
    setForm({ ...form, admin_id: user?._id });

    if (validateEquipment(form).isErr) {
      setErr({
        isErr: validateEquipment(form).isErr,
        errMessage: validateEquipment(form).errMessage,
      });
      setLoading(false);
      setForm({
        admin_id: user?._id,
        name: "",
        category: "",
        quantity: 1,
        condition: "",
        available: true,
      });
    } else {
      newEquipment(form)
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            setForm({
              admin_id: user?._id,
              name: "",
              category: "",
              quantity: 1,
              condition: "",
              available: true,
            });
            setLoading(false);
          } else {
            setErr(res);
            setLoading(false);
            router.push("/dashboard/courts");
          }
        })
        .catch(async (e) => {
          setErr(e);
          setForm({
            admin_id: user?._id,
            name: "",
            category: "",
            quantity: 1,
            condition: "",
            available: true,
          });
          setLoading(false);
        });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 md:px-12 mt-25 pb-25">
        <div className="p-6 md:p-8 rounded-xl backdrop-blur-xs shadow-lg w-full border-1 border-[#6770d2] max-w-2xl text-white">
          <h2 className="text-2xl font-bold text-center mb-4">New Equipment</h2>

          {err.isErr && (
            <>
              <p className="text-sm text-red-400 mb-6 text-center">
                {err.errMessage}
              </p>
            </>
          )}

          {/* Name Field */}
          <div className="flex items-center bg-[#06070E] border border-3 border-[#3e3e3e] text-white rounded-lg mb-4 p-2">
            <Home size={20} className="mr-3 text-gray-400" />
            <input
              type="text"
              placeholder="Equipment Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div
            className="flex relative items-center bg-[#06070E] border border-3 border-[#3e3e3e] text-white rounded-lg mb-4 p-2 cursor-pointer"
            onClick={() =>
              setDropdowns((prev) => ({ category: !prev.category }))
            }
          >
            <Volleyball size={20} className="mr-3 text-gray-400" />
            <span className="w-full">{form.category || "Category"}</span>
            <ChevronDown size={20} className="text-gray-400" />
            {dropdowns.category && (
              <div className="mt-1 z-11 flex overflow-y-scroll top-10 right-0 flex-col border border-3 border-[#3e3e3e] h-40 gap-2 bg-[#06070E] p-1 rounded-lg absolute">
                {availableCategories.map((category) => (
                  <div
                    key={category}
                    className="px-3 py-1 rounded-lg bg-[#3e3e3e] cursor-pointer font-semibold text-white hover:bg-black"
                    onClick={() => {
                      setForm({ ...form, category });
                      setDropdowns((prev) => ({ ...prev, condition: false }));
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex relative items-center bg-[#06070E] border border-3 border-[#3e3e3e] text-white rounded-lg mb-4 p-2 cursor-pointer"
            onClick={() =>
              setDropdowns((prev) => ({
                condition: !prev.condition,
              }))
            }
          >
            <HeartPulse size={20} className="mr-3 text-gray-400" />
            <span className="w-full">{form.condition || "Condition"}</span>
            <ChevronDown size={20} className="text-gray-400" />

            {dropdowns.condition && (
              <div className="mt-1 flex overflow-y-scroll top-10 right-0 flex-col border border-3 border-[#3e3e3e] h-31 gap-2 bg-[#06070E] p-1 rounded-lg absolute">
                {availableConditions.map((condition) => (
                  <div
                    key={condition}
                    className="px-3 py-1 rounded-lg bg-[#3e3e3e] cursor-pointer font-semibold text-white hover:bg-black"
                    onClick={() => {
                      setForm({ ...form, condition });
                      setDropdowns((prev) => ({ ...prev, category: false }));
                    }}
                  >
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border border-3 border-[#3e3e3e] w-full p-2 bg-[#06070E] text-white rounded-lg mb-4">
            <Pi size={20} className="mr-2 text-gray-400" />
            <span>Quantity: {form.quantity}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => handleQuantityChange(1)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="w-full cursor-pointer p-2 mt-2 rounded-lg text-white font-semibold border-3 border-[#3e3e3e]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              {loading ? "Creating..." : "Create"}
            </span>
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}
