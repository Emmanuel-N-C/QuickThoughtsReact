import { createSlice, nanoid } from "@reduxjs/toolkit";

const plansSlice = createSlice({
  name: "plans",
  initialState: [],
  reducers: {
    addPlan: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, description = "") {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            todos: [],
          },
        };
      },
    },
    removePlan(state, action) {
      return state.filter((plan) => plan.id !== action.payload);
    },
    // ✅ NEW: Edit plan
    editPlan(state, action) {
      const { id, title, description } = action.payload;
      const plan = state.find((p) => p.id === id);
      if (plan) {
        if (title !== undefined) plan.title = title;
        if (description !== undefined) plan.description = description;
      }
    },
    addTodoToPlan(state, action) {
      const { planId, text } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        plan.todos.push({
          id: String(nanoid()),
          text,
          completed: false,
          status: "todo",
        });
      }
    },
    // ✅ NEW: Edit todo in plan
    editTodoInPlan(state, action) {
      const { planId, todoId, text } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        const todo = plan.todos.find((t) => String(t.id) === String(todoId));
        if (todo && text !== undefined) todo.text = text;
      }
    },
    updateTodoStatus(state, action) {
      const { planId, todoId, status } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        const todo = plan.todos.find((t) => String(t.id) === String(todoId));
        if (todo) {
          todo.status = status;
          todo.completed = status === "done"; //  Sync completed with status
        }
      }
    },
    toggleTodoInPlan(state, action) {
      const { planId, todoId } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        const todo = plan.todos.find((t) => String(t.id) === String(todoId));
        if (todo) {
          todo.completed = !todo.completed;
          todo.status = todo.completed ? "done" : "todo"; //  Sync status with completed
        }
      }
    },
    removeTodoFromPlan(state, action) {
      const { planId, todoId } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        plan.todos = plan.todos.filter(
          (t) => String(t.id) !== String(todoId)
        );
      }
    },
  },
});

export const {
  addPlan,
  removePlan,
  editPlan, 
  addTodoToPlan,
  editTodoInPlan, 
  updateTodoStatus,
  toggleTodoInPlan,
  removeTodoFromPlan,
} = plansSlice.actions;

export default plansSlice.reducer;