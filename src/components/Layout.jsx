import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <div className={`main-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar toggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
