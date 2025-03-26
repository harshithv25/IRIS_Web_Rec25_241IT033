import { ReactNode } from "react";

export interface User {
  _id?: string;
  name: string;
  email: string;
  branch: string;
  roll_number: string;
  role: string;
  password?: string;
  penalty?: { isPenalty: boolean; endTimeStamp: string };
}

export interface Booking {
  _id?: string;
  user_id: string;
  admin_id?: string;
  infrastructure_id: string;
  booking_type: string;
  start_time: string;
  end_time: string;
  validated?: boolean | null;
  cancel_status?: { cancelled: boolean; reason: string };
  expired?: boolean;
}

export interface Equipment {
  _id?: string;
  admin_id: string;
  name: string;
  category: string;
  media: string;
  quantity: number;
  condition: string;
  available?: boolean;
}

export interface Court {
  _id?: string;
  admin_id: string;
  name: string;
  location: string;
  media: string;
  quantity: number;
  operating_hours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  available?: boolean;
}

export interface AuthContextType {
  user: User | null;
  csrfToken: string | undefined;
  login: (
    email: string,
    password: string
  ) => Promise<{ isErr: boolean; errMessage: string }>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    branch: string,
    roll_number: string,
    password: string,
    role: string
  ) => Promise<{ isErr: boolean; errMessage: string }>;
}

export interface DataContextType {
  bookings: Booking[] | null;
  equipments: Equipment[] | null;
  courts: Court[] | null;
  myEquipments: Equipment[] | null;
  myCourts: Court[] | null;
  newBooking: (booking: Booking) => Promise<Booking>;
  newEquipment: (equipment: Equipment) => Promise<Equipment>;
  newCourt: (court: Court) => Promise<Court>;
  getBookings: (field_type: string, field_value: string) => Promise<Booking[]>;
  getEquipments: (
    field_type: string,
    field_value: string
  ) => Promise<Equipment[]>;
  getCourts: (field_type: string, field_value: string) => Promise<Court[]>;
  getMyEquipments: (
    field_type: string,
    field_value: string
  ) => Promise<Equipment[]>;
  getMyCourts?: (field_type: string, field_value: string) => Promise<Court[]>;
  updateBooking: (
    booking_id: string,
    data: Booking | null,
    type: string,
    user_id: string
  ) => Promise<Booking>;
  updateEquipment: (
    equipment_id: string,
    data: Equipment | null
  ) => Promise<Equipment>;
  updateCourt: (court_id: string, data: Court | null) => Promise<Court>;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  uid: string;
}

export interface CSRFResponse {
  csrfToken: string;
}

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export interface CounterProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}
