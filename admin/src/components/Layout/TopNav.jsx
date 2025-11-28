import React, { useState } from 'react';
import { Menu, Bell, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TopNav = ({ onMenuClick, admin }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="topnav">
      <div className="topnav-content">
        <div className="topnav-left">
          <button 
            className="menu-btn"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          <h1 className="topnav-title">Admin Panel</h1>
        </div>
        
        <div className="topnav-right">
          <button className="notification-btn">
            <Bell size={20} />
          </button>
          
          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-info">
                <span className="user-name">{admin?.name}</span>
                <span className="user-email">{admin?.email}</span>
              </div>
              <User size={20} />
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .topnav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(226,232,240,0.6);
          z-index: 90;
          height: 64px;
        }
        
        @media (min-width: 1024px) {
          .topnav {
            left: 280px;
          }
        }
        
        .topnav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 100%;
        }
        
        .topnav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
        }
        
        .menu-btn:hover {
          background: rgba(99,102,241,0.12);
          color: #111827;
        }
        
        @media (min-width: 1024px) {
          .menu-btn {
            display: none;
          }
        }
        
        .topnav-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        
        .topnav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .notification-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
        }
        
        .notification-btn:hover {
          background: rgba(236,72,153,0.12);
          color: #111827;
        }
        
        .user-menu {
          position: relative;
        }
        
        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          color: #4b5563;
        }
        
        .user-btn:hover {
          background: rgba(99,102,241,0.12);
          color: #111827;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }
        
        .user-email {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        @media (max-width: 640px) {
          .user-info {
            display: none;
          }
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(226,232,240,0.6);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 100;
          margin-top: 0.5rem;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #374151;
          font-size: 0.875rem;
          text-align: left;
        }
        
        .dropdown-item:hover {
          background: rgba(99,102,241,0.1);
        }
        .dropdown-item:first-child {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        
        .dropdown-item:last-child {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </header>
  );
};

export default TopNav;
