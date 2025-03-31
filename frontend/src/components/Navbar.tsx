/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellDot, Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useDataContext } from "@/context/DataContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth()!;
  const { notifications, getNotifications } = useDataContext();
  const [err, setErr] = useState({
    isErr: false,
    errMessage: "",
  });
  const [result, setRes] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    const fetchData = async () => {
      if (!user) return;

      if (!notifications?.length && result === 0) {
        await getNotifications(user?._id).then((res) => {
          setRes(result + 1);
          setErr(res);
        });
      }
    };

    fetchData();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [getNotifications, notifications?.length, result, user]);

  const handleMouseEnter = () => {
    setHoverTimeout(setTimeout(() => setHovered(true), 300));
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHovered(false);
  };

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full transition-all duration-300 z-50",
        scrolled
          ? "h-24 backdrop-blur-md bg-black/30 shadow-md"
          : "h-30 bg-transparent"
      )}
    >
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between h-full">
        <Link
          href="/"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative h-full flex items-center"
        >
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={hovered ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <Image
              src="/media/noBgWhite.png"
              alt="Logo"
              width={200}
              height={70}
              className="h-full object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/media/noBgColor.png"
              alt="White Logo"
              width={200}
              height={70}
              className="h-full object-contain"
            />
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12">
          <Link
            href={!user ? "/login" : "/dashboard"}
            className="text-lg font-medium text-white transition-colors duration-300 hover:text-[#6770d2]"
          >
            {!user ? "Login" : "Dashboard"}
          </Link>
          <Link
            href={!user ? "/login" : "/book/equipment"}
            className="text-lg font-medium text-white transition-colors duration-300 hover:text-[#6770d2]"
          >
            Book Now!
          </Link>
          {user && (
            <>
              <Link
                href="/notifications"
                className="text-lg font-medium text-white transition-colors duration-300 hover:text-[#6770d2]"
              >
                {notifications?.length && !notifications[0].read ? (
                  <BellDot />
                ) : (
                  <Bell />
                )}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-22 left-0 w-full bg-black shadow-md p-6 flex flex-col space-y-4"
          >
            <Link
              href={!user ? "/login" : "/dashboard"}
              className="text-lg font-medium hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              {!user ? "Login" : "Dashboard"}
            </Link>
            {user && (
              <Link
                href="/notifications"
                className="text-lg font-medium hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Notifications
              </Link>
            )}

            <Link
              href="/book/equipment"
              className="text-lg font-medium hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Book Now!
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
