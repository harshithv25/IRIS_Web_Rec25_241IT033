/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useDataContext } from "@/context/DataContext";
import { useEffect, useState } from "react";

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, getNotifications, updateNotifications } =
    useDataContext();
  const [result, setRes] = useState(0);
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (!notifications?.length && result === 0) {
        await getNotifications(user?._id).then((res) => {
          setRes(result + 1);
          setErr(res);
        });
        await updateNotifications(user?._id).then((res) => {
          setErr(res);
        });
      }
    };

    fetchData();
  }, [
    getNotifications,
    notifications?.length,
    result,
    updateNotifications,
    user,
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      <div className="relative w-full min-h-screen flex flex-col items-center mt-10 lg:mt-5 justify-center">
        <div className="w-full max-w-2xl flex items-center flex-col gap-4 px-4">
          <hr className="w-30" />

          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex flex-col gap-4 px-4 items-center"
              >
                <div
                  key={notification._id}
                  className={`p-5 rounded-xl backdrop-blur-xs shadow-lg w-full max-h-90 overflow-y-scroll text-white border border-3 border-[#6770d2] flex flex-col gap-4`}
                >
                  <p className="text-lg">{notification.text}</p>
                </div>
                <hr className="w-30" />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
