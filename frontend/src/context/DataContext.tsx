/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DataContextType, Booking, Equipment, Court } from "@/schemas/schemas";
import { AuthContext } from "./AuthContext";
import { baseUrl } from "@/utils/api";

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { csrfToken } = useContext(AuthContext) ?? {};
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [equipments, setEquipments] = useState<Equipment[] | null>(null);
  const [courts, setCourts] = useState<Court[] | null>(null);

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": csrfToken || "",
    };

    return fetch(`${baseUrl}/${url}`, {
      ...options,
      headers,
      credentials: "include",
    }).then((res) => res.json());
  };

  const getBookings = async (
    field_type: string | null,
    field_value: string | null,
    getAll: boolean,
    getBy: string
  ) => {
    try {
      const data = await apiFetch(
        `bookings/?getAll=${getAll}&getBy=${field_type}&value=${field_value}`
      );

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setBookings(data.bookings);
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getEquipments = async (
    field_type: string | null,
    field_value: string | null
  ) => {
    try {
      const data = await apiFetch(
        `equipment/?getBy=${field_type}&value=${field_value}`
      );

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setEquipments(data.equipment);
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const getCourts = async (
    field_type: string | null,
    field_value: string | null
  ) => {
    try {
      const data = await apiFetch(
        `courts/?getBy=${field_type}&value=${field_value}`
      );

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setCourts(data.courts);
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const newBooking = async (booking: Booking) => {
    try {
      const data = await apiFetch("bookings/", {
        method: "POST",
        body: JSON.stringify(booking),
      });

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setBookings((prev) =>
          prev ? [...prev, data.bookings] : [data.bookings]
        );
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const newEquipment = async (equipment: Equipment) => {
    try {
      const data = await apiFetch("equipment/", {
        method: "POST",
        body: JSON.stringify(equipment),
      });

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setEquipments((prev) =>
          prev ? [...prev, data.equipment] : [data.equipment]
        );
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const newCourt = async (court: Court) => {
    try {
      const data = await apiFetch("courts/", {
        method: "POST",
        body: JSON.stringify(court),
      });

      if (!data.ok) {
        return { isErr: true, errMessage: data.error };
      } else {
        setCourts((prev) => (prev ? [...prev, data.courts] : [data.courts]));
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateBooking = async (booking_id: string, data: Booking | null) => {
    try {
      const updatedData = await apiFetch(`bookings/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!updatedData.ok) {
        return { isErr: true, errMessage: updatedData.error };
      } else {
        setBookings(
          (prev) =>
            prev?.map((b) =>
              b._id === booking_id ? updatedData.bookings : b
            ) || []
        );
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateEquipment = async (
    equipment_id: string,
    data: Equipment | null
  ) => {
    try {
      const updatedData = await apiFetch(`equipment/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!updatedData.ok) {
        return { isErr: true, errMessage: updatedData.error };
      } else {
        setEquipments(
          (prev) =>
            prev?.map((e) =>
              e._id === equipment_id ? updatedData.equipment : e
            ) || []
        );
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  const updateCourt = async (court_id: string, data: Court | null) => {
    try {
      const updatedData = await apiFetch(`courts/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!updatedData.ok) {
        return { isErr: true, errMessage: updatedData.error };
      } else {
        setCourts(
          (prev) =>
            prev?.map((c) => (c._id === court_id ? updatedData.courts : c)) ||
            []
        );
        return { isErr: false, errMessage: "" };
      }
    } catch (error: any) {
      return { isErr: true, errMessage: error.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        bookings,
        equipments,
        courts,
        newBooking,
        newEquipment,
        newCourt,
        getBookings,
        getEquipments,
        getCourts,
        updateBooking,
        updateEquipment,
        updateCourt,
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
