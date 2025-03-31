"use client";

import Image from "next/image";

export default function DashboardCard({
  image_url,
  desc,
  button_text,
  redirect_url,
}: {
  image_url: string;
  desc: string;
  button_text: string;
  redirect_url: string;
}) {
  return (
    <div className="p-6 rounded-xl backdrop-blur shadow-lg w-80 md:w-80 text-white border border-[#6770d2]">
      <Image
        src={image_url}
        alt="Placeholder"
        width={60}
        height={40}
        className="w-full h-40 object-contain"
      />

      <div className="w-24 h-0.5 bg-[#3e3e3e] mx-auto my-5 rounded-full"></div>

      <p className="text-center text-sm font-semibold opacity-80">{desc}</p>

      <a
        href={redirect_url}
        className="block mt-4 transition-all font-semibold text-center text-white py-2 rounded-lg border-3 border-[#3e3e3e]"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          {button_text}
        </span>
      </a>
    </div>
  );
}
