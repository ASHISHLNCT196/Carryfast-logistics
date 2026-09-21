import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <div className="sidebar">
      <h2>Carryfast Logistics</h2>
      <p>Vehicle Tracking System</p>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>
        <NavLink to="/vehicles" className={({ isActive }) => (isActive ? "active" : "")}>Vehicles</NavLink>
        <NavLink to="/entry-exit" className={({ isActive }) => (isActive ? "active" : "")}>Entry / Exit</NavLink>
        <NavLink to="/docks" className={({ isActive }) => (isActive ? "active" : "")}>Dock Board</NavLink>
      </nav>
      <div className="logout" onClick={logout}>
        Sign out ({user?.name})
      </div>
    </div>
  );
}
