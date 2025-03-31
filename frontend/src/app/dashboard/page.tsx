"use client";

import Background from "@/components/Background";
import DashboardCard from "@/components/DashboardCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const commonCards = [
    {
      image_url: "/media/logout_dashboard.svg",
      desc: "Sign out of your account",
      button_text: "Logout",
      redirect_url: "/logout",
    },
  ];

  // User-Specific Cards
  const userCards =
    user?.role === "User"
      ? [
          {
            image_url: "/media/equipment_dashboard.svg",
            desc: "Explore more equipments and go book 'em!",
            button_text: "Equipments",
            redirect_url: "/book/equipment",
          },
          {
            image_url: "/media/courts_dashboard.svg",
            desc: "Book courts and play with your friends!",
            button_text: "Courts",
            redirect_url: "/book/courts",
          },
          {
            image_url: "/media/bookings_dashboard.svg",
            desc: "Manage all your bookings at one place",
            button_text: "My Bookings",
            redirect_url: "/dashboard/mybookings",
          },
        ]
      : [];

  // Admin-Specific Cards
  const adminCards =
    user?.role === "Admin"
      ? [
          {
            image_url: "/media/bookings_dashboard.svg",
            desc: "Validate and Check-in users",
            button_text: "Check In",
            redirect_url: "/dashboard/checkin",
          },
          {
            image_url: "/media/myequipment_dashboard.svg",
            desc: "Manage your equipments",
            button_text: "My Equipment",
            redirect_url: "/dashboard/myequipment",
          },
          {
            image_url: "/media/mycourts_dashboard.svg",
            desc: "View your courts",
            button_text: "My Courts",
            redirect_url: "/dashboard/mycourts",
          },
          {
            image_url: "/media/equipment_dashboard.svg",
            desc: "Create new and exciting equipment",
            button_text: "Add Equipments",
            redirect_url: "/create/equipment",
          },
          {
            image_url: "/media/courts_dashboard.svg",
            desc: "Add a new location that students can enjoy",
            button_text: "Add Courts",
            redirect_url: "/create/court",
          },
          {
            image_url: "/media/logout_dashboard.svg",
            desc: "Get insights about activity on your infrastructure",
            button_text: "Analytics",
            redirect_url: "/dashboard/analytics",
          },
        ]
      : [];

  const allCards = [...userCards, ...adminCards, ...commonCards];

  // Split cards into sections of 6
  const chunkSize = 6;
  const cardSections = [];
  for (let i = 0; i < allCards.length; i += chunkSize) {
    cardSections.push(allCards.slice(i, i + chunkSize));
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />

      {cardSections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col justify-center items-center gap-10 min-h-screen mt-30 md:mt-7 md:mb-0 mb-15 relative z-10 w-full snap-y snap-mandatory px-12 mx-auto"
        >
          {/* First Row (Top 3 cards) */}
          <div className="flex flex-wrap justify-center gap-10">
            {section.slice(0, 3).map((card, cardIndex) => (
              <DashboardCard
                key={cardIndex}
                image_url={card.image_url}
                desc={card.desc}
                button_text={card.button_text}
                redirect_url={card.redirect_url}
              />
            ))}
          </div>

          {/* Second Row (Bottom 3 cards) */}
          <div className="flex flex-wrap justify-center gap-10">
            {section.slice(3, 6).map((card, cardIndex) => (
              <DashboardCard
                key={cardIndex}
                image_url={card.image_url}
                desc={card.desc}
                button_text={card.button_text}
                redirect_url={card.redirect_url}
              />
            ))}
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
}

// we display all the possible functions a user can do. it varies based on the role
