import React from "react";
import { FaEdit, FaRegCalendarCheck, FaHistory } from "react-icons/fa";
import { BsFillGearFill } from "react-icons/bs";

/**
 * exports sidebar data, including title, path, icon, className
 */
export const sidebarData = [
  {
    title: "Edit Profile",
    path: "/tutorials/profile/editProfile",
    icon: <FaEdit />,
    cName: "sidenav__list-item",
  },
  {
    title: "Manage Booking",
    path: "/tutorials/profile/manageBooking",
    icon: <FaRegCalendarCheck />,
    cName: "sidenav__list-item",
  },
  {
    title: "Class History",
    path: "/tutorials/profile/classHistory",
    icon: <FaHistory />,
    cName: "sidenav__list-item",
  },
  {
    title: "Account Settings",
    path: "/tutorials/profile/accountSettings",
    icon: <BsFillGearFill />,
    cName: "sidenav__list-item",
  },
];