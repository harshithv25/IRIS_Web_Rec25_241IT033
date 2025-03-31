/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Calendar,
  ChevronDown,
  Home,
  MapPin,
  Minus,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { validateCourt } from "@/utils/formValidations";
import { useDataContext } from "@/context/DataContext";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/capitalize";
import { Court } from "@/schemas/schemas";

const availableSlots = [
  "11-12",
  "12-13",
  "13-14",
  "14-15",
  "15-16",
  "16-17",
  "17-18",
  "18-19",
  "19-20",
  "20-21",
  "21-22",
  "22-23",
];

const availablity = ["Available", "Unavailable"];

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type WeekDay = (typeof daysOfWeek)[number];

export default function EditCourt({ court }: { court: Court }) {
  const { user } = useAuth();
  const { updateCourt } = useDataContext();
  const router = useRouter();

  // Initialize form with existing court data
  const [form, setForm] = useState<Court | any>({
    _id: "",
    admin_id: user?._id,
    name: court?.name || "",
    location: court?.location || "",
    capacity: court?.capacity || 1,
    operating_hours: court?.operating_hours || {
      monday: [] as string[],
      tuesday: [] as string[],
      wednesday: [] as string[],
      thursday: [] as string[],
      friday: [] as string[],
      saturday: [] as string[],
    },
    available: court?.available ?? true,
  });

  const [err, setErr] = useState({ isErr: false, errMessage: "" });
  const [loading, setLoading] = useState(false);
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});

  // Ensure form loads existing court data
  useEffect(() => {
    setForm({
      _id: court?._id,
      admin_id: user?._id || "",
      name: court?.name || "",
      location: court?.location || "",
      capacity: court?.capacity || 1,
      operating_hours: court?.operating_hours || {
        monday: [] as string[],
        tuesday: [] as string[],
        wednesday: [] as string[],
        thursday: [] as string[],
        friday: [] as string[],
        saturday: [] as string[],
      },
      available: court?.available ?? true,
    });
  }, [court, user?._id]);

  const toggleDropdown = (day: string) => {
    setDropdowns((prev) => ({ [day]: !prev[day] }));
  };

  const addSlot = (day: WeekDay, slot: string) => {
    setForm((prev: { operating_hours: any }) => {
      const updatedHours = { ...prev.operating_hours };
      if (!updatedHours[day].includes(slot)) {
        updatedHours[day] = [...updatedHours[day], slot];
      }
      return { ...prev, operating_hours: updatedHours };
    });
  };

  const removeSlot = (day: WeekDay, slot: string) => {
    setForm((prev: { operating_hours: any }) => {
      const updatedHours = { ...prev.operating_hours };
      updatedHours[day] = updatedHours[day].filter((s: string) => s !== slot);
      return { ...prev, operating_hours: updatedHours };
    });
  };

  const handleCapacityChange = (delta: number) => {
    setForm((prev: { capacity: number }) => ({
      ...prev,
      capacity: Math.max(1, prev.capacity + delta),
    }));
  };

  const handleUpdate = () => {
    setLoading(true);
    setForm({ ...form, admin_id: user?._id });

    const validation = validateCourt(form);
    if (validation.isErr) {
      setErr(validation);
      setLoading(false);
      return;
    } else {
      updateCourt(court?._id, form, true)
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            setLoading(false);
          } else {
            setErr({ isErr: false, errMessage: "" });
            setLoading(false);
            router.push("/dashboard/");
          }
        })
        .catch((e) => {
          setErr({ isErr: true, errMessage: e.message });
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 md:px-12 mt-25 pb-25">
      <div className="p-6 md:p-8 rounded-xl backdrop-blur-xs shadow-lg w-full border-1 border-[#6770d2] max-w-2xl text-white">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Court</h2>

        {err.isErr && (
          <p className="text-sm text-red-400 mb-6 text-center">
            {err.errMessage}
          </p>
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

        <div
          className="flex relative items-center bg-[#06070E] border border-3 border-[#3e3e3e] text-white rounded-lg mb-4 p-2 cursor-pointer"
          onClick={() =>
            setDropdowns((prev) => ({
              availablity: !prev.availablity,
            }))
          }
        >
          <Box size={20} className="mr-3 text-gray-400" />
          <span className="w-full">
            {form?.available ? "Available" : "Unavailable"}
          </span>
          <ChevronDown size={20} className="text-gray-400" />

          {dropdowns.availablity && (
            <div className="mt-1 flex overflow-y-scroll top-10 right-0 flex-col border border-3 border-[#3e3e3e] h-21 gap-2 bg-[#06070E] p-1 rounded-lg absolute">
              {availablity.map((status) => (
                <div
                  key={status}
                  className="px-3 py-1 rounded-lg bg-[#3e3e3e] cursor-pointer font-semibold text-white hover:bg-black"
                  onClick={() => {
                    setForm({
                      ...form,
                      available: status === "Available" ? true : false,
                    });
                    setDropdowns((prev) => ({ ...prev, category: false }));
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capacity Field */}
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
                <span>{capitalize(day)}</span>
                <Plus size={18} className={dropdowns[day] ? "rotate-45" : ""} />
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
                {form?.operating_hours[day]?.map((slot: any) => (
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
          onClick={handleUpdate}
          className="w-full p-2 mt-2 rounded-lg text-white font-semibold border-3 border-[#3e3e3e] cursor-pointer"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            {loading ? "Updating..." : "Update"}
          </span>
        </button>
      </div>
    </div>
  );
}
