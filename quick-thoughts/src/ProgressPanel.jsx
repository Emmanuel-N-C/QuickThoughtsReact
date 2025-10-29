import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { FaLightbulb, FaBrain, FaCheckCircle, FaCalendarAlt, FaChartBar, FaBell } from 'react-icons/fa';
import { calculatePlanProgress } from "./utilities";
import "./ProgressPanel.css";

const ProgressPanel = ({ isOpen }) => {
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const plans = useSelector((state) => state.plans);

  const ideas = thoughts.filter((t) => t.category === "Idea");
  const randomThoughts = thoughts.filter((t) => t.category === "Random Thought");
  
  const completedTodos = todos.filter((t) => t.completed).length;
  const totalTodos = todos.length;
  const todoProgress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const completedPlans = plans.filter((p) => calculatePlanProgress(p) === 100).length;
  const inProgressPlans = plans.filter((p) => {
    const progress = calculatePlanProgress(p);
    return progress > 0 && progress < 100;
  }).length;

  const totalTasks = plans.reduce((sum, plan) => sum + (plan.todos?.length || 0), 0) + totalTodos;
  const completedTasks = plans.reduce((sum, plan) => 
    sum + (plan.todos?.filter(t => t.completed).length || 0), 0) + completedTodos;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`progress-panel ${isOpen ? 'open' : ''}`}>
      <div className="progress-header">
        <h3>
          <FaChartBar style={{ marginRight: '8px' }} />
          Progress
        </h3>
      </div>

      <div className="progress-content">
        {/* Overall Progress */}
        <div className="progress-card highlight">
          <h4>Overall Progress</h4>
          <div className="circular-progress">
            <svg width="120" height="120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="10"
                strokeDasharray={`${overallProgress * 3.14} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="progress-text">{overallProgress}%</div>
          </div>
          <p>{completedTasks} / {totalTasks} tasks completed</p>
        </div>

        {/* Quick Stats */}
        <div className="progress-card">
          <h4>
            <FaLightbulb style={{ marginRight: '6px', color: '#fbbf24' }} />
            Ideas
          </h4>
          <div className="stat-number">{ideas.length}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(ideas.length * 20, 100)}%`, background: '#fbbf24' }}></div>
          </div>
        </div>

        <div className="progress-card">
          <h4>
            <FaBrain style={{ marginRight: '6px', color: '#8b5cf6' }} />
            Random Thoughts
          </h4>
          <div className="stat-number">{randomThoughts.length}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(randomThoughts.length * 20, 100)}%`, background: '#8b5cf6' }}></div>
          </div>
        </div>

        <div className="progress-card">
          <h4>
            <FaCheckCircle style={{ marginRight: '6px', color: '#10b981' }} />
            To-Dos
          </h4>
          <div className="stat-number">{completedTodos}/{totalTodos}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${todoProgress}%`, background: '#10b981' }}></div>
          </div>
          <p className="stat-label">{todoProgress}% complete</p>
        </div>

        <div className="progress-card">
          <h4>
            <FaCalendarAlt style={{ marginRight: '6px', color: '#6366f1' }} />
            Plans
          </h4>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-badge completed">{completedPlans}</span>
              <span>Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge in-progress">{inProgressPlans}</span>
              <span>In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge total">{plans.length}</span>
              <span>Total</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="progress-card">
          <h4>
            <FaBell style={{ marginRight: '6px' }} />
            Recent Activity
          </h4>
          <div className="activity-list">
            {randomThoughts.slice(0, 3).map((thought) => (
              <div key={thought.id} className="activity-item">
                <span className="activity-icon">
                  <FaBrain />
                </span>
                <span className="activity-text">{thought.text.substring(0, 30)}...</span>
              </div>
            ))}
            {randomThoughts.length === 0 && <p className="empty-state">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPanel;