"use client";

import { Equipment } from "@/schemas/schemas";
import { capitalize } from "@/utils/capitalize";
import { Box, Clock, FlagTriangleLeft, Heart, Pi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EquipmentList({
  equipment,
}: {
  equipment: Equipment[];
}) {
  const itemsPerPage = 3;
  const totalPages = Math.ceil(equipment?.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      const nextSection = document.getElementById(`section-${currentPage + 1}`);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center mt-25 lg:mt-5">
      {equipment?.length !== 0 ? (
        <>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <section
              key={pageIndex}
              id={`section-${pageIndex}`}
              className="w-full min-h-screen flex flex-col justify-center items-center snap-start"
            >
              <div className="p-6 md:p-8 rounded-xl backdrop-blur-xs flex flex-col lg:flex-row justify-center items-center gap-10 shadow-lg w-full max-w-full text-white">
                {equipment
                  ?.slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  )
                  ?.map((item) => (
                    <div
                      key={item._id}
                      className="p-5 rounded-xl backdrop-blur-xs shadow-lg w-100 max-h-90 overflow-y-scroll text-white border border-3 border-[#6770d2] flex flex-col gap-4"
                    >
                      <h2 className="text-2xl font-bold flex items-center gap-2 text-center">
                        <FlagTriangleLeft className="mt-1" /> {item?.name}
                      </h2>
                      <hr className="text-[#3e3e3e] border" />
                      <p className="flex items-center gap-2 text-lg">
                        <span className="text-gray-500 flex items-center justify-center gap-2 font-semibold">
                          <Pi /> Category:
                        </span>
                        <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                          {capitalize(item?.category)}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-lg">
                        <span className="text-gray-500 flex items-center justify-center gap-2 font-semibold">
                          <Box /> Quantity:
                        </span>
                        <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                          {capitalize(`${item?.quantity}`)}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-lg">
                        <span className="text-gray-500 flex items-center justify-center gap-2 font-semibold">
                          <Heart /> Condition:
                        </span>
                        <span className="text-gray-400 flex items-center justify-center gap-2 font-bold">
                          {capitalize(`${item?.condition}`)}
                        </span>
                      </p>
                      <div className="text-lg w-full">
                        <p className="text-gray-500 flex items-center gap-2 font-semibold">
                          <Clock /> Slots:
                        </p>
                        <ol className="list-decimal ml-5 text-sm h-30 overflow-y-scroll">
                          <hr className="h-2 mt-3 text-gray-500" />

                          {Object.entries(item?.operating_hours || {}).map(
                            ([day, slots]) => (
                              <li
                                key={day}
                                className="mt-1 font-semibold text-gray-400"
                              >
                                {capitalize(day)}
                                <ul className="list-disc text-xs font-semibold text-gray-300 flex flex-row gap-4 flex-wrap">
                                  {slots.map((slot: string, index: number) => (
                                    <li key={index} className="font-bold mr-2">
                                      {slot}
                                    </li>
                                  ))}
                                </ul>
                                <hr className="h-2 mt-3 text-gray-500" />
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                      <hr className="text-[#3e3e3e] border width-30" />
                      <button
                        onClick={() =>
                          router.push(`/edit/equipment/${item._id}`)
                        }
                        className="block transition-all cursor-pointer font-bold text-center text-white py-2 rounded-lg border-3 border-[#3e3e3e] backdrop-blur-xs"
                      >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                          Edit
                        </span>
                      </button>
                    </div>
                  ))}
              </div>
              {pageIndex < totalPages - 1 && (
                <button
                  onClick={handleNext}
                  className="block mt-6 transition-all cursor-pointer font-semibold text-center text-white py-2 rounded-lg border-3 border-[#3e3e3e] backdrop-blur-xs px-5 absolute md:relative bottom-0 opacity-0 md:opacity-100"
                >
                  View more
                </button>
              )}
            </section>
          ))}
        </>
      ) : (
        <div className="w-full min-h-screen flex flex-col gap-10 justify-center items-center snap-start">
          <h1 className="text-4xl font-bold">Oops! there are no courts!</h1>
          <button
            onClick={() => router.push("/create/equipment")}
            className="block transition-all cursor-pointer font-semibold text-center text-white py-2 rounded-lg border-3 border-[#3e3e3e] backdrop-blur-xs px-5 absolute md:relative bottom-0 opacity-0 md:opacity-100"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Create equipment!
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
