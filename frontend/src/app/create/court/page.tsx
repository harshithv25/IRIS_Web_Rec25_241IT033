"use client";

import { useLayoutEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import { Calendar, Home, MapPin, Minus, Plus, Users, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { validateCourt } from "@/utils/formValidations";
import { useDataContext } from "@/context/DataContext";
import { useRouter } from "next/navigation";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const availableSlots = [
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
  "22:00-23:00",
];

export default function CreateCourt() {
  const { user } = useAuth();
  const { newCourt } = useDataContext();
  const [form, setForm] = useState({
    admin_id: user?._id,
    name: "",
    location: "",
    capacity: 1,
    operating_hours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    },
    available: true,
  });
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const router = useRouter();

  const toggleDropdown = (day: string) => {
    setDropdowns((prev) => ({ [day]: !prev[day] }));
  };

  const addSlot = (day: string, slot: string) => {
    setForm((prev) => {
      const updatedHours = { ...prev.operating_hours };
      if (!updatedHours[day]) updatedHours[day] = [];
      if (!updatedHours[day].includes(slot)) updatedHours[day].push(slot);
      return { ...prev, operating_hours: updatedHours };
    });
  };

  const removeSlot = (day: string, slot: any) => {
    setForm((prev) => {
      const updatedHours = { ...prev.operating_hours };
      updatedHours[day] = updatedHours[day].filter((s) => s !== slot);
      if (updatedHours[day].length === 0) delete updatedHours[day];
      return { ...prev, operating_hours: updatedHours };
    });
  };

  const handleCapacityChange = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      capacity: Math.max(1, prev.capacity + delta),
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

    if (validateCourt(form).isErr) {
      setErr({
        isErr: validateCourt(form).isErr,
        errMessage: validateCourt(form).errMessage,
      });
      setLoading(false);
      setForm({
        admin_id: user?._id,
        name: "",
        location: "",
        capacity: 1,
        operating_hours: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
        },
        available: true,
      });
    } else {
      newCourt(form)
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            setForm({
              admin_id: user?._id,
              name: "",
              location: "",
              capacity: 1,
              operating_hours: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
              },
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
            location: "",
            capacity: 1,
            operating_hours: {
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
              saturday: [],
            },
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
          <h2 className="text-2xl font-bold text-center mb-4">New Court</h2>

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
              placeholder="Court Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          {/* Location Field */}
          <div className="flex items-center bg-[#06070E] border border-3 border-[#3e3e3e] text-white rounded-lg mb-4 p-2">
            <MapPin size={20} className="mr-3 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between border border-3 border-[#3e3e3e] w-full p-2 bg-[#06070E] text-white rounded-lg mb-4">
            <Users size={20} className="mr-2 text-gray-400" />
            <span>Capacity: {form.capacity}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCapacityChange(-1)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => handleCapacityChange(1)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Time Slots</h3>
            {daysOfWeek.map((day) => (
              <div key={day} className="mb-4">
                <div
                  className="flex items-center justify-between bg-[#06070E] border border-3 border-[#3e3e3e] p-2 rounded-lg cursor-pointer"
                  onClick={() => toggleDropdown(day)}
                >
                  <Calendar size={18} className="mr-2 text-gray-400" />
                  <span>{day}</span>
                  <Plus
                    size={18}
                    className={dropdowns[day] ? "rotate-45" : ""}
                  />
                </div>
                {dropdowns[day] && (
                  <div className="mt-1 flex overflow-y-scroll right-8 flex-col border border-3 border-[#3e3e3e] h-40 gap-2 bg-[#06070E] p-2 rounded-lg absolute">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => addSlot(day, slot)}
                        className="px-3 py-1 rounded-lg bg-[#3e3e3e] cursor-pointer font-semibold text-white hover:bg-black"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-center flex flex-wrap gap-2">
                  {form.operating_hours[day]?.map((slot) => (
                    <div
                      key={slot}
                      className="flex items-center gap-3 bg-black border border-1 border-[#3e3e3e] px-3 py-1 rounded-lg"
                    >
                      <span>{slot}</span>
                      <button
                        onClick={() => removeSlot(day, slot)}
                        className="text-[#D90429] hover:text-[#FB4B68] cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
