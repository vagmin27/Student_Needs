import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Navigate } from 'react-router-dom';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!localStorage.getItem("User")) {
    return <Navigate to='/expenses-tracker/login' />;
  }

  return (
    <div className="flex h-screen bg-brand-900 overflow-hidden font-inter">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden">
        <TopNavbar setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
