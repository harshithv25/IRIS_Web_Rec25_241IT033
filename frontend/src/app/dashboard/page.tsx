"use client";

import Background from "@/components/Background";
import DashboardCard from "@/components/DashboardCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Background />

      <div className="flex flex-col justify-center mt-33 lg:mt-7 items-center gap-10 min-h-screen relative z-10 w-full snap-y snap-mandatory px-12 mx-auto">
        <div className="flex flex-col justify-center lg:flex-row items-center gap-10">
          <DashboardCard
            image_url="/media/equipment_dashboard.svg"
            desc="Explore more equipments and go book 'em!"
            button_text="Equipments"
            redirect_url="/book/equipment"
          />
          <DashboardCard
            image_url="/media/courts_dashboard.svg"
            desc="Book courts and play with your friends!"
            button_text="Courts"
            redirect_url="/book/courts"
          />
          <DashboardCard
            image_url="/media/bookings_dashboard.svg"
            desc="Manage all your bookings at one place"
            button_text="My Bookings"
            redirect_url="/dashboard/mybookings"
          />
        </div>
        <div className="flex flex-col justify-center lg:flex-row items-center gap-10">
          {user?.role === "Admin" && (
            <>
              <DashboardCard
                image_url="/media/myequipment_dashboard.svg"
                desc="Manage your equipments"
                button_text="My Equipment"
                redirect_url="/dashboard/myequipment"
              />
              <DashboardCard
                image_url="/media/mycourts_dashboard.svg"
                desc="View your courts"
                button_text="My Courts"
                redirect_url="/dashboard/mycourts"
              />
            </>
          )}
          <DashboardCard
            image_url="/media/logout_dashboard.svg"
            desc="Sign out of your account"
            button_text="Logout"
            redirect_url="/logout"
          />
        </div>
      </div>

      {user?.role === "Admin" && (
        <>
          <div className="flex flex-col justify-center mt-33 lg:mt-7 mb-15 lg:mb-0 items-center gap-10 min-h-screen relative z-10 w-full snap-y snap-mandatory px-12 mx-auto">
            <div className="flex flex-col justify-center lg:flex-row items-center gap-10">
              <DashboardCard
                image_url="/media/equipment_dashboard.svg"
                desc="Create new and exciting equipment"
                button_text="Add Equipments"
                redirect_url="/create/equipment"
              />
              <DashboardCard
                image_url="/media/courts_dashboard.svg"
                desc="Add a new location that students can enjoy"
                button_text="Add Courts"
                redirect_url="/create/court"
              />
              <DashboardCard
                image_url="/media/logout_dashboard.svg"
                desc="Get insights about activity on your infrastructure"
                button_text="Analytics"
                redirect_url="/dashboard/analytics"
              />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

// we display all the possible functions a user can do. it varies based on the role
