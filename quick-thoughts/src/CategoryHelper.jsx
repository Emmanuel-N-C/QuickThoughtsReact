// src/CategoryHelper.jsx
import React from "react";

const helperMessages = {
  Random: "💭 Type any thought — it will fade away after 15 seconds.",
  Idea: "💡 Write down those brilliant ideas before they disappear.",
  "To-Do": "📝 Add a task — you can mark it done later or add it to a plan.",
  Plan: "📅 Create a plan, then add related to-dos to reach your goals.",
};

const CategoryHelper = ({ category }) => {
  return (
    <p className="mt-3 text-muted small fst-italic">
      {helperMessages[category] || "Choose a category to begin."}
    </p>
  );
};

export default CategoryHelper;
