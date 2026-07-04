import React from "react";
import { Outlet } from "react-router-dom";
import { DWHeader } from "../components/DWHeader";
import { MadioFooter } from "../components/MadioFooter";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const DWLayout: React.FC = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col min-h-screen">
      <DWHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <MadioFooter />
    </div>
  );
};
