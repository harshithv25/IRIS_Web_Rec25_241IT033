/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { Booking, Court, Equipment } from "@/schemas/schemas";
import BookingList from "@/components/BookingList";
import CourtList from "@/components/CourtList";
import EquipmentList from "@/components/EquipmentList";
import AnalyticsGraph from "@/components/AnalyticsGraph";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import CheckIn from "@/components/CheckIn";

export default function DashboardPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const {
    bookings,
    courts,
    equipment,
    getBookings,
    getCourts,
    getEquipment,
    adminBookings,
    adminCourts,
    adminEquipments,
    analytics,
    getAnalytics,
  } = useDataContext();
  const [data, setData] = useState<Booking[] | Court[] | Equipment[] | any>([]);

  useEffect(() => {
    const fetchData = async () => {
      switch (slug) {
        case "mybookings":
          if (!bookings?.length)
            await getBookings("user_id", user?._id, true, "user_id", false);
          setData(user?.role !== "Admin" ? bookings : []);
          break;

        case "checkin":
          if (!adminBookings?.length)
            await getBookings("user_id", user?._id, true, "user_id", false);
          setData(user?.role === "Admin" ? adminBookings : []);
          break;

        case "mycourts":
          if (!adminCourts?.length)
            await getCourts("admin_id", user?._id, true);
          setData(user?.role === "Admin" ? adminCourts : []);
          break;

        case "myequipment":
          if (!adminEquipments?.length)
            await getEquipment("admin_id", user?._id, true);
          setData(user?.role === "Admin" ? adminEquipments : []);
          break;

        case "analytics":
          if (!analytics) await getAnalytics(user?._id);
          setData(user?.role === "Admin" ? analytics : []);
          break;

        default:
          setData([]);
      }
    };

    fetchData();
  }, [
    slug,
    user,
    bookings,
    courts,
    equipment,
    getBookings,
    getCourts,
    getEquipment,
    adminCourts,
    adminEquipments,
    adminBookings,
    analytics,
    getAnalytics,
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      {slug === "mybookings" && user?.role !== "Admin" && (
        <BookingList bookings={data} />
      )}
      {slug === "checkin" && user?.role === "Admin" && (
        <CheckIn bookings={data} />
      )}
      {slug === "mycourts" && user?.role === "Admin" && (
        <CourtList courts={data} />
      )}
      {slug === "myequipment" && user?.role === "Admin" && (
        <EquipmentList equipment={data} />
      )}
      {slug === "analytics" && user?.role === "Admin" && (
        <AnalyticsGraph analytics={data} />
      )}
    </div>
  );
}
