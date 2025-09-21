import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout: React.FC = () => {
  return (
    <div
      className="
        min-h-screen flex flex-col text-foreground
        bg-[url('/your-bg.jpg')] 
        bg-no-repeat bg-center
        bg-cover              /* default: cover screen */
        sm:bg-contain sm:bg-top /* on small screens: fit image */
      "
    >
      {/* Navbar */}
      <Navigation />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet /> {/* All child routes will render here */}
      </main>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground text-center py-4 mt-auto">
        &copy; {new Date().getFullYear()} Saathi. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;