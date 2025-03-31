/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import { Booking, Court, Equipment } from "@/schemas/schemas";
import { useAuth } from "@/context/AuthContext";
import { capitalize } from "@/utils/capitalize";
import { useDataContext } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import { Box, FunnelPlus, Heart, Pi } from "lucide-react";

export default function BookItemPage() {
  const { user } = useAuth();
  const {
    bookings,
    courts,
    equipment,
    getCourts,
    getEquipment,
    getBookings,
    newBooking,
    updateBooking,
  } = useDataContext();
  const { slug, id } = useParams();
  const router = useRouter();
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Court | Equipment | any>(null);
  const [todaySelectedSlot, setTodaySelectedSlot] = useState<string>("");
  const [nextSelectedSlot, setNextSelectedSlot] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean | null>(null);
  const [result, setRes] = useState(0);

  const [form, setForm] = useState<Booking>({
    _id: "",
    user_id: user?._id,
    admin_id: item?.admin_id,
    booking_type: capitalize(slug as string),
    infrastructure_id: item?._id,
    name: item?.name,
    start_time: "",
    end_time: "",
    validated: null,
    type: "create",
  });

  useEffect(() => {
    if (!id || !slug) return;

    const fetchData = async () => {
      let foundItem = null;

      if (!bookings?.length && result == 0) {
        await getBookings(
          "infrastructure_id",
          id as string,
          true,
          "infrastructure_id",
          false
        ).then((res) => {
          setRes(result + 1);
          setErr(res);
        });
      }

      switch (slug) {
        case "courts":
          if (!courts?.length) {
            await getCourts("available", `${true}`, false);
          }
          foundItem = courts?.find((court) => court._id === id);
          if (foundItem) setItem(foundItem);
          break;

        case "equipment":
          if (!equipment?.length) {
            await getEquipment("available", `${true}`, false);
          }

          foundItem = equipment?.find((eq) => eq._id === id);
          if (foundItem) setItem(foundItem);
          break;
      }

      if (foundItem) setItem(foundItem);
    };

    fetchData();
  }, [
    id,
    slug,
    courts,
    equipment,
    getCourts,
    getEquipment,
    bookings?.length,
    getBookings,
    item?._id,
    result,
  ]);

  const today = moment().format("dddd");
  const nextDay = moment().add(1, "days").format("dddd");

  const todaySlots = item?.operating_hours[today.toLowerCase()] || [];
  const nextDaySlots = item?.operating_hours[nextDay.toLowerCase()] || [];

  // Function to generate timestamps
  const getTimestamp = (slot: string, dayOffset: number) => {
    const [startHour] = slot.split("-").map(Number); // Extracts start time from "11-12"
    const startTime = moment()
      .utc()
      .add(dayOffset, "days")
      .hour(startHour)
      .minute(0)
      .second(0)
      .milliseconds(0);
    const endTime = startTime.clone().add(1, "hour"); // Adds 1 hour for end time

    return {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    };
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (form.type === "waitlist") {
      await updateBooking(form?._id, form, false, "waitlist")
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            setForm({
              user_id: "",
              admin_id: item?.admin_id,
              infrastructure_id: item?._id,
              booking_type: capitalize(slug as string),
              start_time: "",
              end_time: "",
              validated: null,
              type: "create",
            });
          } else {
            router.push(`/dashboard`);
          }
        })
        .catch((e) => console.log(e.message));
    } else {
      await newBooking(form)
        .then((res) => {
          if (res.isErr) {
            setErr(res);
            console.log(res);
            setForm({
              _id: "",
              user_id: "",
              admin_id: item?.admin_id,
              infrastructure_id: item?._id,
              booking_type: capitalize(slug as string),
              start_time: "",
              end_time: "",
              validated: null,
              type: "create",
              name: capitalize(item?.name),
            });
          } else {
            router.push(`/dashboard`);
          }
        })
        .catch((e) => console.log(e.message));
    }
  };

  const handleSlotSelect = async (slot: any, day: any) => {
    if (day == "today") {
      setNextSelectedSlot("");
      setTodaySelectedSlot(slot);
      setSelectedSlot(slot);
    } else {
      setTodaySelectedSlot("");
      setNextSelectedSlot(slot);
      setSelectedSlot(slot);
    }
    // Get timestamp for selected slot
    const dayOffset = day === "today" ? 1 : 2;
    const { start_time, end_time } = getTimestamp(slot, dayOffset);

    // Check if the selected slot is already booked

    let existingBooking = null;

    if (bookings) {
      existingBooking = bookings?.find(
        (booking: Booking) => start_time === booking.start_time
      );
    }

    if (existingBooking) {
      // Slot is already booked, user should join the waitlist
      setIsSlotAvailable(false);
      setForm((prevForm) => ({
        ...prevForm,
        user_id: user?._id,
        admin_id: existingBooking?.admin_id,
        infrastructure_id: existingBooking?.infrastructure_id,
        name: existingBooking?.name,
        _id: existingBooking?._id,
        start_time,
        end_time,
        validated: null,
        booking_type: capitalize(slug as string),
        type: "waitlist",
      }));

      alert(
        `That slot already booked. You can join the waitlist (Booking ID: ${existingBooking._id})`
      );
    } else {
      setIsSlotAvailable(true);
      setForm((prevForm) => ({
        ...prevForm,
        user_id: user?._id,
        admin_id: item?.admin_id,
        infrastructure_id: item?._id,
        name: capitalize(item?.name),
        start_time,
        end_time,
        validated: null,
        booking_type: capitalize(slug as string),
        type: "create",
      }));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      <div className="relative w-full min-h-screen flex flex-col items-center mt-10 lg:mt-5 justify-center">
        <div className="p-6 md:p-8 rounded-xl backdrop-blur-xs shadow-lg max-w-full text-white flex flex-col items-center justify-center gap-5">
          {err.isErr && (
            <>
              <p className="text-md font-bold text-red-400 text-center">
                {err.errMessage}
              </p>
            </>
          )}
          <h1 className="text-xl font-bold text-gray-400">
            Book{" "}
            <span className="text-4xl text-white">
              {capitalize(item?.name)}
            </span>
          </h1>

          <hr className="text-gray-500 border w-30 font-bold text-lg" />

          <div className="p-5 rounded-xl shadow-lg w-full text-white border border-3 border-[#3e3e3e] flex flex-col gap-4 bg-gradient-to-br from-[#1F1F1F] to-[#3e3e3e]">
            <p className="flex items-start gap-2 text-lg">
              <span className="text-gray-200 flex items-center justify-center gap-2 font-semibold">
                <Pi />
                {slug === "equipment" ? "Category:" : "Location:"}
              </span>
              <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                {capitalize(item?.category || item?.location)}
              </span>
            </p>
            <p className="flex items-start gap-2 text-lg">
              <span className="text-gray-200 flex items-center justify-center gap-2 font-semibold">
                <Box />
                {slug === "equipment" ? "Quantity:" : "Capacity: "}
              </span>
              <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                {capitalize(`${item?.quantity || item?.capacity}`)}
              </span>
            </p>
            {slug === "equipment" && (
              <>
                <p className="flex items-center gap-2 text-lg">
                  <span className="text-gray-200 flex items-center justify-center gap-2 font-semibold">
                    <Heart /> Condition:
                  </span>
                  <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                    {capitalize(`${item?.condition}`)}
                  </span>
                </p>
              </>
            )}
            <p className="flex items-start gap-2 text-lg">
              <span className="text-gray-200 flex items-center justify-center gap-2 font-semibold">
                <FunnelPlus />
                Availability:
              </span>
              <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                {item?.available ? "Available!" : "Unavailable"}
              </span>
            </p>

            <h3 className="font-bold mt-1 text-lg text-gray-200">
              Select a Time Slot:{" "}
            </h3>
            <p className="text-md text-gray-300 ml-2 font-semibold">
              Today&apos;s Slots ({today}):
            </p>
            <div className="flex gap-2 flex-wrap ml-3">
              {todaySlots.length ? (
                todaySlots.map((slot: any) => (
                  <button
                    key={slot}
                    onClick={() => handleSlotSelect(slot, "today")}
                    className={`px-4 py-2 rounded-md shadow-lg transition bg-transparent border border-3 cursor-pointer ${
                      todaySelectedSlot === slot
                        ? "border-[#b8b8b8] hover:border-[#gray]"
                        : "border-[#3e3e3e] hover:[#b8b8b8]"
                    }`}
                  >
                    <span
                      className={`font-semibold ${
                        todaySelectedSlot === slot
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]"
                          : "text-gray-100"
                      }`}
                    >
                      {slot}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm ml-3 font-bold">No slots for today!</p>
              )}
            </div>

            <p className="text-md text-gray-300 mt-1 ml-2 font-bold">
              Tomorrow&apos;s Slots ({nextDay}):
            </p>
            <div className="flex gap-2 flex-wrap ml-4">
              {nextDaySlots.length ? (
                nextDaySlots.map((slot: any) => (
                  <button
                    key={slot}
                    onClick={() => handleSlotSelect(slot, "tomorrow")}
                    className={`px-4 py-2 rounded-md shadow-lg transition bg-transparent border border-3 cursor-pointer ${
                      nextSelectedSlot === slot
                        ? "border-[#b8b8b8] hover:border-[#gray]"
                        : "border-[#3e3e3e] hover:[#b8b8b8]"
                    }`}
                  >
                    <span
                      className={`font-semibold ${
                        nextSelectedSlot === slot
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]"
                          : "text-gray-100"
                      }`}
                    >
                      {slot}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm ml-3 font-bold">No slots for Tomorrow!</p>
              )}
            </div>

            {user?.penalty?.isPenalty ? (
              <p className="text-red-500 mt-4">
                You have a penalty and cannot book.
              </p>
            ) : (
              selectedSlot && (
                <button
                  disabled={isSlotAvailable === null}
                  className="mt-3 px-6 py-2 rounded-lg shadow-lg transition border border-3 border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                  onClick={handleBooking}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                    {isSlotAvailable === null
                      ? "Checking..."
                      : isSlotAvailable
                      ? "Book Now!"
                      : "Join Waitlist"}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
