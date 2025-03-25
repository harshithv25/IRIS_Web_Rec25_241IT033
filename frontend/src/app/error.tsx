"use client"; // Error boundaries must be Client Components

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
      </div>
    </div>
  );
}
