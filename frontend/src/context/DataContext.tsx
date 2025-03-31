/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  DataContextType,
  Booking,
  Equipment,
  Court,
  Analytics,
  Notification,
} from "@/schemas/schemas";
import { AuthContext } from "./AuthContext";
import { baseUrl } from "@/utils/api";

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { csrfToken } = useContext(AuthContext) ?? {};
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [equipment, setEquipment] = useState<Equipment[] | null>(null);
  const [courts, setCourts] = useState<Court[] | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [adminCourts, setAdminCourts] = useState<Court[] | null>(null);
  const [adminEquipments, setAdminEquipments] = useState<Equipment[] | null>(
    null
  );
  const [adminBookings, setAdminBookings] = useState<Booking[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": csrfToken || "",
    };

    try {
      const response = await fetch(`${baseUrl}/${url}`, {
        ...options,
        headers,
        credentials: "include",
      });

      return response;
    } catch (error: any) {
      console.error("API Fetch failed:", error);
      throw new Error(error.message || "Something went wrong");
    }
  };

  const getBookings = async (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    getAll: boolean,
    getBy: string,
    admin: boolean
  ) => {
    try {
      const response = await apiFetch(
        `bookings/?getAll=${getAll}&getBy=${field_type}&value=${field_value}`
      );

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();
      if (admin) {
        setAdminBookings(data.bookings);
      } else {
        setBookings(data.bookings);
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getEquipment = async (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    admin: boolean
  ) => {
    try {
      const response = await apiFetch(
        `equipment/?getBy=${field_type}&value=${field_value}`
      );

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();
      if (admin) {
        setAdminEquipments(data.equipment);
      } else {
        setEquipment(data.equipment);
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getCourts = async (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    admin: boolean
  ) => {
    try {
      const response = await apiFetch(
        `courts/?getBy=${field_type}&value=${field_value}`
      );

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();

      if (admin) {
        setAdminCourts(data.courts);
      } else {
        setCourts(data.courts);
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getAnalytics = async (admin_id: string | undefined) => {
    try {
      const response = await apiFetch(`analytics/?admin_id=${admin_id}`);

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }
      const data = await response?.json();
      setAnalytics(data.analytics);
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getNotifications = async (user_id: string | undefined) => {
    try {
      const response = await apiFetch(`notifications/?user_id=${user_id}`);

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }
      const data = await response?.json();
      setNotifications(data.notifications);
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const newBooking = async (booking: Booking) => {
    try {
      const response = await apiFetch("bookings/", {
        method: "POST",
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();

      setBookings((prev) =>
        prev ? [...prev, data.bookings] : [data.bookings]
      );
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.error };
    }
  };

  const newEquipment = async (equipment: Equipment) => {
    try {
      const response = await apiFetch("equipment/", {
        method: "POST",
        body: JSON.stringify(equipment),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();

      setEquipment((prev) =>
        prev ? [...prev, data.equipment] : [data.equipment]
      );
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const newCourt = async (court: Court) => {
    try {
      const response = await apiFetch("courts/", {
        method: "POST",
        body: JSON.stringify(court),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await response?.json();

      setCourts((prev) => (prev ? [...prev, data.courts] : [data.courts]));
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateBooking = async (
    booking_id: string | undefined,
    data: Booking | null,
    admin: boolean,
    type?: string
  ) => {
    try {
      const response = await apiFetch(`bookings/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const updatedData = await response?.json();

      if (admin) {
        setAdminBookings(
          (prev) =>
            prev?.map((b) =>
              b._id === booking_id ? updatedData.bookings : b
            ) || []
        );
      } else {
        setBookings(
          (prev) =>
            prev?.map((b) =>
              b._id === booking_id ? updatedData.bookings : b
            ) || []
        );
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateEquipment = async (
    equipment_id: string | undefined,
    data: Equipment | null,
    admin: boolean
  ) => {
    try {
      const response = await apiFetch(`equipment/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const updatedData = await response?.json();

      if (admin) {
        setAdminEquipments(
          (prev) =>
            prev?.map((e) =>
              e._id === equipment_id ? updatedData.equipment : e
            ) || []
        );
      } else {
        setEquipment(
          (prev) =>
            prev?.map((e) =>
              e._id === equipment_id ? updatedData.equipment : e
            ) || []
        );
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateCourt = async (
    court_id: string | undefined,
    data: Court | null,
    admin: boolean
  ) => {
    try {
      const response = await apiFetch(`courts/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }

      const updatedData = await response?.json();

      if (admin) {
        setAdminCourts(
          (prev) =>
            prev?.map((c) => (c._id === court_id ? updatedData.courts : c)) ||
            []
        );
      } else {
        setCourts(
          (prev) =>
            prev?.map((c) => (c._id === court_id ? updatedData.courts : c)) ||
            []
        );
      }

      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateNotifications = async (user_id: string | undefined) => {
    try {
      const response = await apiFetch(`notifications/?user_id=${user_id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const err = await response?.json();
        return { isErr: true, errMessage: err.error };
      }
      const data = await response?.json();
      // setNotifications(data.notifications);
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        bookings,
        equipment,
        courts,
        analytics,
        notifications,
        adminBookings,
        adminCourts,
        adminEquipments,
        newBooking,
        newEquipment,
        newCourt,
        getBookings,
        getEquipment,
        getCourts,
        getAnalytics,
        getNotifications,
        updateBooking,
        updateEquipment,
        updateCourt,
        updateNotifications,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// access data anywhere in this project
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
