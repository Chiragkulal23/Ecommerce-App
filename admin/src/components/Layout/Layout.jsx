import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin } = useAuth();

  return (
    <div className="layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="main-content">
        <TopNav 
          onMenuClick={() => setSidebarOpen(true)} 
          admin={admin} 
        />
        
        <main className="content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
      
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0;
          transition: margin-left 0.3s ease;
        }
        
        @media (min-width: 1024px) {
          .main-content {
            margin-left: 280px;
          }
        }
        
        .content {
          flex: 1;
          padding: 1rem;
          padding-top: 80px;
        }
        
        @media (max-width: 1023px) {
          .content {
            padding-top: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;