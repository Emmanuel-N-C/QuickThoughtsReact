import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Sidebar from "./Sidebar";
import Overview from "./views/Overview";
import ListView from "./views/ListView";
import BoardView from "./views/BoardView";
import ProgressPanel from "./ProgressPanel";
import "./App.css";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isProgressOpen, setIsProgressOpen] = useState(window.innerWidth >= 1280);
  const [currentView, setCurrentView] = useState("overview");
  const [listFilter, setListFilter] = useState("All");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }

      if (window.innerWidth >= 1280) {
        setIsProgressOpen(true);
      } else {
        setIsProgressOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wrapper function to handle sidebar navigation
  const handleSidebarNavigation = (view) => {
    if (view === "list") {
      setListFilter("All");
    }
    setCurrentView(view);
    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + 1: Overview
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setCurrentView('overview');
        toast.success('📊 Switched to Overview');
      }
      // Cmd/Ctrl + 2: List View
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setCurrentView('list');
        toast.success('📋 Switched to List View');
      }
      // Cmd/Ctrl + 3: Board View
      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        setCurrentView('board');
        toast.success('🎯 Switched to Board View');
      }
      // Cmd/Ctrl + B: Toggle Sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
      }
      // Cmd/Ctrl + P: Toggle Progress Panel (only on desktop)
      if ((e.metaKey || e.ctrlKey) && e.key === 'p' && window.innerWidth >= 1024) {
        e.preventDefault();
        setIsProgressOpen(!isProgressOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen, isProgressOpen]);

  // Render the current active page
  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <Overview setCurrentView={setCurrentView} setListFilter={setListFilter} />;
      case "list":
        return <ListView initialFilter={listFilter} setCurrentView={setCurrentView} />;
      case "board":
        return <BoardView />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Hamburger Menu Button */}
      <button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Progress Panel Toggle (Right side) - Hidden on mobile */}
      {window.innerWidth >= 1024 && (
        <button
          className="progress-toggle-btn"
          onClick={() => setIsProgressOpen(!isProgressOpen)}
          title="Toggle Progress Panel"
        >
          {isProgressOpen ? "›" : "‹"}
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        setCurrentView={handleSidebarNavigation}
        currentView={currentView}
      />

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen && window.innerWidth >= 1024 ? 'sidebar-open' : ''} ${isProgressOpen && window.innerWidth >= 1280 ? 'progress-open' : ''}`}>
        {renderView()}
      </div>

      {/* Progress Panel (Right side) - Hidden on mobile */}
      {window.innerWidth >= 1024 && (
        <ProgressPanel isOpen={isProgressOpen} />
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default App;