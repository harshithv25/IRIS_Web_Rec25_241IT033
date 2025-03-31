/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Hourglass, ShieldUser, Type } from "lucide-react";

export default function CheckIn({
  bookings: myBookings,
}: {
  bookings: Booking[];
}) {
  const { user } = useAuth();
  const { getBookings, updateBooking, adminBookings } = useDataContext();
  const router = useRouter();
  const [err, setErr] = useState({ isErr: false, errMessage: "" });
  const [result, setRes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!myBookings?.length && result == 0) {
        await getBookings("admin_id", user?._id, true, "user_id", true).then(
          (res) => {
            setRes(result + 1);
            setErr(res);
          }
        );
      }
    };

    fetchData();
  }, [myBookings?.length, getBookings, user?._id, result]);

  // Function to split bookings into chunks of 3
  const chunkBookings = (arr: any, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr?.length; i += chunkSize) {
      chunks.push(arr?.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const handleValidate = async (booking: any) => {
    const confirmValidate = window.confirm(
      "Are you sure you want to validate this booking?"
    );
    if (confirmValidate) {
      await updateBooking(
        booking._id,
        { ...booking, validated: true, _id: booking._id, type: "validate" },
        true,
        "validate"
      ).then((res) => {
        setErr(res);
        if (!res.isErr) {
          router.push("/dashbboard");
        }
      });
    }
  };

  const handleCancelWithReason = async (booking: any) => {
    const reason = window.prompt("Please enter the reason for cancellation:");
    if (!reason) return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) {
      await updateBooking(
        booking._id,
        {
          ...booking,
          _id: booking._id,
          type: "deny",
          cancel_status: { cancelled: true, reason: reason },
        },
        false,
        "deny"
      ).then((res) => {
        setErr(res);
        if (!res.isErr) {
          router.push("/dashbboard");
        }
      });
    }
  };

  const handleCheckIn = async (booking: any) => {
    const enteredPassword = window.prompt("Enter the password to check-in:");
    if (!enteredPassword) return; // If user cancels prompt, do nothing.

    await updateBooking(
      booking._id,
      {
        ...booking,
        type: "check-in",
        password: enteredPassword, // Send password to the backend
      },
      false,
      "checkin"
    ).then((res) => {
      setErr(res);
      if (!res.isErr) {
        alert("Check-in successful!");
        router.push("/dashboard");
      } else {
        alert("Incorrect password or check-in failed. Please try again.");
      }
    });
  };

  const bookingSections = chunkBookings(adminBookings, 3);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center mt-10 lg:mt-5 justify-center">
      {myBookings?.length === 0 ? (
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
                  infrastructure_id: Key | null | undefined;
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
                  user_id: any;
                  validated: any;
                  admin_id: string | undefined;
                }) => {
                  const formattedDate = moment(booking?.start_time)
                    .utc()
                    .format("DD/MM/YY dddd h A");
                  const duration = moment(booking?.end_time)
                    .utc()
                    .diff(moment(booking?.start_time), "hours");
                  const now = moment();
                  const startTime = moment(booking?.start_time);
                  const timeDiff = moment.duration(startTime.diff(now));

                  const timeLeft =
                    timeDiff.asMilliseconds() > 0
                      ? `${timeDiff.hours()} Hours and ${timeDiff.minutes()} Minutes`
                      : "Already Started";

                  return (
                    <div
                      key={booking?.infrastructure_id}
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
                      <hr className="border-gray-500 border border-2" />
                      {booking?.expired && (
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
                          User Id:
                        </span>{" "}
                        <span className="text-gray-400 flex items-center justify-center gap-2 font-semibold">
                          {booking?.user_id || "N/A"}
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
                            The booking is scheduled on {formattedDate}{" "}
                            <span className="text-gray-400 text-sm font-bold">
                              i.e. {timeLeft} from now
                            </span>
                          </>
                        ) : (
                          <>The booking was scheduled on {formattedDate} </>
                        )}
                      </p>

                      {!booking?.expired && !booking?.validated && (
                        <>
                          <button
                            className="mt-4 px-6 py-2 rounded-lg shadow-xl transition border border-3 border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                            onClick={() => handleValidate(booking)}
                          >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                              Validate
                            </span>
                          </button>
                          <button
                            className="mt-1 px-6 py-2 rounded-lg shadow-xl transition border border-3 border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                            onClick={() => handleCancelWithReason(booking)}
                          >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                              Cancel
                            </span>
                          </button>
                        </>
                      )}

                      {!booking?.expired &&
                        booking?.validated &&
                        user?._id === booking?.admin_id && (
                          <button
                            className="mt-4 px-6 py-2 rounded-lg shadow-xl transition border border-3 border-[#3e3e3e] cursor-pointer hover:border-[#B8B8B8]"
                            onClick={() => handleCheckIn(booking)}
                          >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429] font-semibold text-xl">
                              Check-in
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
