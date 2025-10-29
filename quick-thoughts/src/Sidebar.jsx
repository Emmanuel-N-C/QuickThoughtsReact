import React from "react";
import { FaHome, FaList, FaBullseye, FaChartLine } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, setCurrentView, currentView }) => {
  const navItems = [
    { id: "overview", icon: <FaHome />, label: "Overview", color: "#6366f1" },
    { id: "list", icon: <FaList />, label: "List View", color: "#8b5cf6" },
    { id: "board", icon: <FaBullseye />, label: "Board View", color: "#ec4899" },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="workspace-info">
            <div className="workspace-icon">
              <HiSparkles />
            </div>
            <div>
              <h3>My Workspace</h3>
              <p>Quick Thoughts</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`nav-btn ${currentView === item.id ? "active" : ""}`}
              style={{
                "--nav-color": item.color,
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {currentView === item.id && <span className="nav-indicator"></span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        <div className="sidebar-stats">
          <h4>
            <FaChartLine style={{ marginRight: '8px' }} />
            Quick Stats
          </h4>
          <div className="stat-item">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">-</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">-</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="keyboard-hint">
            <kbd>⌘</kbd> + <kbd>K</kbd> Quick Actions
          </div>
          <small>© 2025 Quick Thoughts</small>
        </div>
      </div>
    </>
  );
};

export default Sidebar;