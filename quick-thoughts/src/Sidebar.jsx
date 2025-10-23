import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, setCurrentView }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>📋 My Workspace</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => setCurrentView("overview")} className="nav-btn">
          🏠 Overview
        </button>
        <button onClick={() => setCurrentView("list")} className="nav-btn">
          📋 List
        </button>
        <button onClick={() => setCurrentView("board")} className="nav-btn">
          🗂️ Board
        </button>
      </nav>

      <hr />

      <div className="sidebar-footer">
        <small>Quick Thoughts © 2025</small>
      </div>
    </div>
  );
};

export default Sidebar;
