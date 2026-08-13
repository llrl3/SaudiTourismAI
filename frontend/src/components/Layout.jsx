import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const Layout = () => {
  const location = useLocation();
  return (
    <div className="App min-h-screen bg-[#FDFDFD]">
      <Header />
      <main key={location.pathname} className="page-enter max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-28 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
