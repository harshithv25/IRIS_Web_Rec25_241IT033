import { Analytics } from "@/schemas/schemas";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsGraph({
  analytics,
}: {
  analytics: Analytics;
}) {
  console.log(analytics);

  if (!analytics || analytics?.bookingCount?.x?.length === 0) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center mt-25 lg:mt-5">
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
          <p className="text-2xl font-semibold text-gray-300">
            Create court/equipment to get insights
          </p>
          <div className="mt-4 flex space-x-4">
            <Link href="/create/court">
              <button className="relative px-6 py-2 text-lg font-semibold rounded-lg border-3 border-[#3e3e3e] shadow-md hover:shadow-xl transition-shadow duration-300">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                  Create Court
                </span>
              </button>
            </Link>
            <Link href="/create/equipment">
              <button className="relative px-6 py-2 text-lg font-semibold rounded-lg border-3 border-[#3e3e3e] shadow-md hover:shadow-xl transition-shadow duration-300">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4C55A4] via-[#FFBA08] to-[#D90429]">
                  Create Equipment
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const data = analytics?.bookingCount?.x?.map((name, index) => ({
    name,
    bookings: analytics?.bookingCount?.y[index],
  }));

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center mt-10 lg:mt-5">
      <div className="w-full flex flex-col items-center justify-center mt-5 p-5 gap-5">
        <h2 className="text-4xl text-gray-300 font-semibold mb-4">
          Booking Analytics
        </h2>
        <hr className="w-40 text-gray-300 border border-2" />
        <div className="w-full max-w-4xl">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <XAxis dataKey="name" tick={{ fill: "#E5E7EB" }} />
              <YAxis tick={{ fill: "#E5E7EB" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                  border: "none",
                }}
                itemStyle={{ color: "#F3F4F6" }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              <Legend
                wrapperStyle={{
                  color: "#F3F4F6",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
                iconSize={14}
                formatter={(value) => (
                  <span style={{ color: "#E5E7EB" }}>{value}</span>
                )}
              />
              <Bar dataKey="bookings" fill="url(#gradient)" barSize={50} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4C55A4" />
                  <stop offset="100%" stopColor="#D90429" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
