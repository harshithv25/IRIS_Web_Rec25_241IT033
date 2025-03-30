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
  user_id?: string;
  admin_id?: string;
  infrastructure_id: string | undefined;
  name?: string;
  booking_type: string;
  start_time: string;
  end_time: string;
  validated?: boolean | null;
  cancel_status?: { cancelled: boolean; reason: string };
  expired?: boolean;
  password?: string;

  type?: string;
}

export interface Equipment {
  _id?: string;
  admin_id: string | undefined;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  operating_hours?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
  };
  available?: boolean;
}

export interface Court {
  _id?: string;
  admin_id: string | undefined;
  name: string;
  location: string;
  capacity: number;
  operating_hours?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
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
  equipment: Equipment[] | null;
  courts: Court[] | null;
  adminBookings: Booking[] | null;
  adminEquipments: Equipment[] | null;
  adminCourts: Court[] | null;
  newBooking: (booking: Booking) => Promise<ErrorProps>;
  newEquipment: (equipment: Equipment) => Promise<ErrorProps>;
  newCourt: (court: Court) => Promise<ErrorProps>;
  getBookings: (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    getAll: boolean,
    getBy: string,
    admin: boolean
  ) => Promise<ErrorProps>;
  getEquipment: (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    admin: boolean
  ) => Promise<ErrorProps>;
  getCourts: (
    field_type: string | null | undefined,
    field_value: string | null | undefined,
    admin: boolean
  ) => Promise<ErrorProps>;
  updateBooking: (
    booking_id: string | undefined,
    data: Booking | null,
    admin: boolean,
    type?: string
  ) => Promise<ErrorProps>;
  updateEquipment: (
    equipment_id: string | undefined,
    data: Equipment | null,
    admin: boolean
  ) => Promise<ErrorProps>;
  updateCourt: (
    court_id: string | undefined,
    data: Court | null,
    admin: boolean
  ) => Promise<ErrorProps>;
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

export interface ErrorProps {
  isErr: boolean;
  errMessage: string;
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
