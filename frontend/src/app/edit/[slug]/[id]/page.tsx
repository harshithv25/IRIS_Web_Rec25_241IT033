/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Background from "@/components/Background";
import EditCourt from "@/components/EditCourt";
import EditEquipment from "@/components/EditEquipment";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useDataContext } from "@/context/DataContext";
import { Booking, Court } from "@/schemas/schemas";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage() {
  const { slug, id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<Booking | Court | any>();

  const { getCourts, getEquipment, adminCourts, adminEquipments } =
    useDataContext();

  useEffect(() => {
    const fetchData = async () => {
      let foundItem = null;
      switch (slug) {
        case "equipment":
          if (!adminEquipments?.length)
            await getEquipment("_id", id as string, true);
          foundItem = adminEquipments?.find(
            (equipment) => equipment._id === id
          );
          if (foundItem) setData(foundItem);
          break;

        case "court":
          if (!adminCourts?.length) await getCourts("_id", id as string, true);
          foundItem = adminCourts?.find((court) => court._id === id);
          if (foundItem) setData(foundItem);
          break;

        default:
          setData([]);
      }
    };

    fetchData();
  }, [slug, user, getCourts, getEquipment, adminCourts, adminEquipments, id]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      {slug === "court" && user?.role === "Admin" && <EditCourt court={data} />}
      {slug === "equipment" && user?.role === "Admin" && (
        <EditEquipment equipment={data} />
      )}
    </div>
  );
}
