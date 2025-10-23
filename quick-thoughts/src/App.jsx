import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Overview from "./views/Overview";
import ListView from "./views/ListView";
import BoardView from "./views/BoardView";
import "./App.css";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("overview");

  // Render the current active page
  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <Overview />;
      case "list":
        return <ListView />;
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
        setCurrentView={setCurrentView}
      />

      {/* Main Content (no header or input below) */}
      <div className="main-content">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
