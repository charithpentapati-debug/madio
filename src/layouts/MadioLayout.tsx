import React from "react";
import { Outlet } from "react-router-dom";
import { MadioHeader } from "../components/MadioHeader";
import { MadioFooter } from "../components/MadioFooter";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const MadioLayout: React.FC = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col min-h-screen">
      <MadioHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MadioFooter />
    </div>
  );
};
