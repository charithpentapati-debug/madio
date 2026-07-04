import React from "react";
import { Outlet } from "react-router-dom";
import { FurnitureHeader } from "../components/FurnitureHeader";
import { MadioFooter } from "../components/MadioFooter";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const FurnitureLayout: React.FC = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col min-h-screen">
      <FurnitureHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MadioFooter />
    </div>
  );
};
