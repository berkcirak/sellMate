// frontend/src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/components/layout.css';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}