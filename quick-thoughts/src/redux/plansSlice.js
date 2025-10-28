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
    updateTodoStatus(state, action) {
      const { planId, todoId, status } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        const todo = plan.todos.find((t) => String(t.id) === String(todoId));
        if (todo) {
          todo.status = status;
          // ✅ Sync completed field with status
          todo.completed = status === "done";
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
          // ✅ Sync status field with completed
          todo.status = todo.completed ? "done" : "todo";
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
  addTodoToPlan,
  updateTodoStatus,
  toggleTodoInPlan,
  removeTodoFromPlan,
} = plansSlice.actions;

export default plansSlice.reducer;