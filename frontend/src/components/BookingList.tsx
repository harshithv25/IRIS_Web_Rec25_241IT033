/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Booking } from "@/schemas/schemas";
import { useAuth } from "@/context/AuthContext";
import { useDataContext } from "@/context/DataContext";
import moment from "moment";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Hourglass, ShieldUser, Type } from "lucide-react";

export default function BookingList({
  bookings: mybookings,
}: {
  bookings: Booking[];
}) {
  const { user } = useAuth();
  const { bookings, getBookings, updateBooking } = useDataContext();
  const router = useRouter();
  const [err, setErr] = useState({ isErr: false, errMessage: "" });
  const [showPassword, setShowPassword] = useState<string | null | undefined>(
    null
  );
  const [result, setRes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!mybookings?.length && result == 0) {
        await getBookings("user_id", user?._id, true, "user_id", false).then(
          (res) => {
            setRes(result + 1);
            setErr(res);
          }
        );
      }
    };

    fetchData();
  }, [mybookings?.length, getBookings, user?._id, result]);

  const handleCancel = async (booking: any) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) {
      await updateBooking(
        booking._id,
        {
          infrastructure_id: booking.infrastructure_id,
          booking_type: booking.booking_type,
          start_time: "",
          end_time: "",
          user_id: user?._id,
          type: "cancel",
          _id: booking._id,
          validated: booking.validated,
        },
        false,
        "cancel"
      ).then((res) => {
        setErr(res);
        if (!res.isErr) {
          router.push("/dashboard");
        }
      });
    }
  };

  // Function to split bookings into chunks of 3
  const chunkBookings = (arr: any, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr?.length; i += chunkSize) {
      chunks.push(arr?.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const bookingSections = chunkBookings(bookings, 3);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      {bookings?.length === 0 ? (
        <p className="text-white mt-10 text-lg">No bookings found</p>
      ) : (
        bookingSections.map((section, index) => (
          <div
            key={index}
            className="w-full h-screen flex justify-center items-center"
          >
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-10 p-6 mt-25 lg:mt-5">
              {section.map(
                (booking: {
                  start_time: moment.MomentInput;
                  end_time: moment.MomentInput;
                  _id: Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  expired: any;
                  cancel_status: {
                    cancelled: any;
                    reason:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  };
                  booking_type:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  admin_id: any;
                  validated: any;
                  user_id: string | undefined;
                  password: SetStateAction<string | null | undefined>;
                }) => {
                  const formattedDate = moment(booking?.start_time)
                    .utc()
                    .format("DD/MM/YY dddd h A");
                  const duration = moment(booking?.end_time)
                    .utc()
                    .diff(moment(booking?.start_time), "hours");
                  const now = moment();
                  const startTime = moment(booking?.start_time).utc();
                  const timeDiff = startTime.hour() - now.hour();

                  const timeLeft =
                    timeDiff > 0
                      ? `${timeDiff} hours from now`
                      : `Already started`;

                  return (
                    <div
                      key={booking?._id}
                      className="p-5 w-full max-w-md rounded-xl shadow-lg text-white border border-[#3e3e3e] flex flex-col gap-4 bg-gradient-to-br from-[#1F1F1F] to-[#3e3e3e]"
                    >
                      <h2 className="text-2xl font-bold text-white text-center">
                        {booking?.name}
                      </h2>
                      {err.isErr && (
                        <p className="text-red-500 text-sm font-bold">
                          {err.errMessage}
                        </p>
                      )}
                      <hr className="border-gray-500" />
                      {booking?.expired &&
                        !booking?.cancel_status?.cancelled && (
                          <p className="text-red-500 text-lg font-bold text-center">
                            Booking expired
                          </p>
                        )}
                      <p className="flex items-start gap-2 text-lg">
                        <span className="text-gray-200 font-semibold flex items-center gap-2">
                          <Type />
                          Type:
                        </span>{" "}
                        <span className="text-gray-400 font-semibold">
                          {booking?.booking_type}
                        </span>
                      </p>
                      <p className="flex items-start flex-wrap gap-2 text-lg">
                        <span className="text-gray-200 flex items-center justify-center gap-2 font-semibold">
                          <ShieldUser />
                          Admin Id:
                        </span>{" "}
                        <span className="text-gray-400 flex items-center justify-center gap-2 font-semibold">
                          {booking?.admin_id || "N/A"}
                        </span>
                      </p>
                      <p className="flex items-start gap-2 text-lg">
                        <span className="text-gray-200 font-semibold flex items-center gap-2">
                          <Hourglass />
                          Duration:
                        </span>{" "}
                        <span className="text-gray-400 font-semibold">
                          {duration} Hour(s)
                        </span>
                      </p>
                      <p className="text-gray-200 text-lg font-bold text-start flex flex-col">
                        {!booking?.expired ? (
                          <>
                            Your booking is scheduled on {formattedDate}{" "}
                            <span className="text-gray-400 text-sm font-bold">
                              i.e. {timeLeft}
                            </span>
                          </>
                        ) : (
                          <>Your booking was scheduled on {formattedDate} </>
                        )}
                      </p>

                      {!booking?.expired && !booking?.validated && (
                        <p className="text-red-500 text-sm font-bold text-center">
                          Booking yet to be validated
                        </p>
                      )}

                      {booking?.cancel_status?.cancelled && (
                        <p className="text-red-800 flex flex-col mt-2 text-md text-center font-semibold">
                          This booking was cancelled:
                          <span className="text-red-500">
                            {booking?.cancel_status?.reason}
                          </span>
                        </p>
                      )}

                      {!booking?.expired && showPassword && (
                        <p className="text-red-500 mt-2 text-lg text-center font-semibold">
                          Password: {showPassword}
                        </p>
                      )}

                      {!booking?.expired &&
                        booking?.validated &&
                        user?._id === booking?.user_id && (
                          <button
                            className="mt-4 px-6 py-2 rounded-lg shadow-xl transition border border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                            onClick={() => setShowPassword(booking?.password)}
                          >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                              Check-in
                            </span>
                          </button>
                        )}

                      {!booking?.expired && user?._id === booking?.user_id && (
                        <button
                          className="mt-1 px-6 py-2 rounded-lg shadow-xl transition border border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                          onClick={() => handleCancel(booking)}
                        >
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                            Cancel
                          </span>
                        </button>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
