import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Grid3X3, 
  Shirt, 
  ShoppingCart, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/categories',
      icon: Grid3X3,
      label: 'Categories'
    },
    {
      path: '/products',
      icon: Shirt,
      label: 'Products'
    },
    {
      path: '/orders',
      icon: ShoppingCart,
      label: 'Orders'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>StyleAura Admin</h2>
          <button 
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        <style jsx>{`
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: -280px;
            width: 280px;
            height: 100vh;
            background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            z-index: 100;
            transition: left 0.3s ease;
            display: flex;
            flex-direction: column;
          }
          
          .sidebar-open {
            left: 0;
          }
          
          @media (min-width: 1024px) {
            .sidebar {
              left: 0;
            }
            
            .sidebar-overlay {
              display: none;
            }
          }
          
          .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .sidebar-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ffffff;
          }
          
          .sidebar-close {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e5e7eb;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
          }
          
          .sidebar-close:hover {
            color: #ffffff;
            background: rgba(255,255,255,0.1);
          }
          
          @media (min-width: 1024px) {
            .sidebar-close {
              display: none;
            }
          }
          
          .sidebar-nav {
            flex: 1;
            padding: 1rem 0.5rem;
          }
          
          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
            border-radius: 0.375rem;
            color: #e5e7eb;
            text-decoration: none;
            transition: all 0.25s ease;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
          }
          
          .sidebar-link:hover {
            background: rgba(255,255,255,0.12);
            color: #ffffff;
            transform: translateX(2px);
          }
          
          .sidebar-link.active {
            background: rgba(255,255,255,0.18);
            color: #ffffff;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25), 0 8px 20px -10px rgba(0,0,0,0.25);
          }
          
          .sidebar-link span {
            font-weight: 500;
            font-size: 0.875rem;
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
