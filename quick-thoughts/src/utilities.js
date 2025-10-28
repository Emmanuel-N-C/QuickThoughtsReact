import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date string to relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return "No date";
  
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

/**
 * Search filter function for all items
 */
export const searchItems = (items, searchTerm, type) => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  
  switch (type) {
    case 'thoughts':
      return items.filter(item => 
        item.text.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    
    case 'todos':
      return items.filter(item => 
        item.text.toLowerCase().includes(term)
      );
    
    case 'plans':
      return items.filter(item => 
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    
    default:
      return items;
  }
};

/**
 * Calculate plan progress percentage
 */
export const calculatePlanProgress = (plan) => {
  if (!plan.todos || plan.todos.length === 0) return 0;
  
  const completedCount = plan.todos.filter(t => t.completed).length;
  return Math.round((completedCount / plan.todos.length) * 100);
};

/**
 * Get plan completion stats
 */
export const getPlanStats = (plan) => {
  if (!plan.todos || plan.todos.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  
  const completed = plan.todos.filter(t => t.completed).length;
  const total = plan.todos.length;
  const percentage = Math.round((completed / total) * 100);
  
  return { total, completed, percentage };
};