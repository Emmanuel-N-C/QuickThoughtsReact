import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { FaHome, FaList, FaBullseye, FaChartLine } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, setCurrentView, currentView }) => {
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const plans = useSelector((state) => state.plans);

  // Calculate stats
  const stats = useMemo(() => {
    const totalIdeas = thoughts.filter((t) => t.category === "Idea").length;
    const totalRandomThoughts = thoughts.filter((t) => t.category === "Random Thought").length;
    const totalTodos = todos.length;
    const completedTodos = todos.filter((t) => t.completed).length;
    const totalPlans = plans.length;
    
    const totalItems = totalIdeas + totalRandomThoughts + totalTodos + totalPlans;
    const completedItems = completedTodos + plans.filter(p => {
      const planTodos = p.todos || [];
      return planTodos.length > 0 && planTodos.every(t => t.completed);
    }).length;

    return {
      totalItems,
      completedItems,
      completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  }, [thoughts, todos, plans]);

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
            <span className="stat-value">{stats.totalItems}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completedItems}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{stats.completionRate}%</span>
          </div>
          
          {/* Visual Progress Bar */}
          <div style={{ marginTop: "12px" }}>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#e5e7eb",
              borderRadius: "3px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${stats.completionRate}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                transition: "width 0.5s ease"
              }} />
            </div>
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