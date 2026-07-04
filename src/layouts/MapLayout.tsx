import React from "react";
import { Outlet } from "react-router-dom";
import { MapHeader } from "../components/MapHeader";
import { MapFooter } from "../components/MapFooter";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const MapLayout: React.FC = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col min-h-screen">
      <MapHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MapFooter />
    </div>
  );
};
