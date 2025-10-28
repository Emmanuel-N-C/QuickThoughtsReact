import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Overview from "./views/Overview";
import ListView from "./views/ListView";
import BoardView from "./views/BoardView";
import "./App.css";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("overview");
  const [listFilter, setListFilter] = useState("All");

  // Wrapper function to handle sidebar navigation
  const handleSidebarNavigation = (view) => {
    if (view === "list") {
      setListFilter("All"); // Reset filter when navigating from sidebar
    }
    setCurrentView(view);
  };

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
      {/* Toggle Sidebar Button */}
      <button
        className="toggle-sidebar-btn"
        onClick={() => setIsSidebarOpen(true)}
      >
        📋 Menu
      </button>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        setCurrentView={handleSidebarNavigation}
      />

      {/* Main Content (no header or input below) */}
      <div className="main-content">
        {renderView()}
      </div>
    </div>
  );
};

export default App;