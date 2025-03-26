"use client";

import Background from "@/components/Background";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />
      <Footer />
    </div>
  );
}

// we display all the possible functions a user can do. it varies based on the role
