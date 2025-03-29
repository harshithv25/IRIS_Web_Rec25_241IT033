"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid min-h-screen z-10 relative place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white-900 sm:text-7xl">
          Something went wrong!
        </h1>
        <div className="mt-8 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md border-3 border-[#3e3e3e] px-3.5 py-2.5 text-md font-bold shadow-sm"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Go back home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
