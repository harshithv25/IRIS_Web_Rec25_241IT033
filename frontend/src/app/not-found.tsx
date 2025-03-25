/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Background from "@/components/Background";
import GradientText from "@/components/GradientText";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <main className="grid min-h-screen z-10 relative place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <GradientText>
            <p className="text-xl font-bold">404</p>
          </GradientText>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md border-3 border-[#3e3e3e] px-3.5 py-2.5 text-md font-bold shadow-sm"
            >
              <GradientText>Go back home</GradientText>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
