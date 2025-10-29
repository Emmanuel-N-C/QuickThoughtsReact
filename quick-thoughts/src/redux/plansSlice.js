import { createSlice, nanoid } from "@reduxjs/toolkit";

const plansSlice = createSlice({
  name: "plans",
  initialState: [],
  reducers: {
    addPlan: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, description = "", dueDate = null) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            dueDate,
            todos: [],
          },
        };
      },
    },
    removePlan(state, action) {
      return state.filter((plan) => plan.id !== action.payload);
    },
    editPlan(state, action) {
      const { id, title, description, dueDate } = action.payload;
      const plan = state.find((p) => p.id === id);
      if (plan) {
        if (title !== undefined) plan.title = title;
        if (description !== undefined) plan.description = description;
        if (dueDate !== undefined) plan.dueDate = dueDate;
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
          todo.completed = status === "done";
        }
      }
    },
    // SIMPLIFIED: Reorder todos - works by rewriting the entire todos array
    reorderTodosInPlan(state, action) {
      const { planId, sourceIndex, destinationIndex, sourceStatus, destinationStatus, todoId } = action.payload;
      const plan = state.find((p) => p.id === planId);
      
      if (!plan || !plan.todos || plan.todos.length === 0) return;

      // Find the todo being moved
      const todoToMove = plan.todos.find((t) => String(t.id) === String(todoId));
      if (!todoToMove) return;

      // Group todos by status
      const todoColumn = plan.todos.filter((t) => (t.status || "todo") === "todo");
      const inprogressColumn = plan.todos.filter((t) => (t.status || "todo") === "inprogress");
      const doneColumn = plan.todos.filter((t) => (t.status || "todo") === "done");

      // Get the source and destination arrays
      let sourceArray, destArray;
      
      if (sourceStatus === "todo") sourceArray = todoColumn;
      else if (sourceStatus === "inprogress") sourceArray = inprogressColumn;
      else sourceArray = doneColumn;

      if (destinationStatus === "todo") destArray = todoColumn;
      else if (destinationStatus === "inprogress") destArray = inprogressColumn;
      else destArray = doneColumn;

      // Remove from source
      const sourceIdx = sourceArray.findIndex((t) => String(t.id) === String(todoId));
      if (sourceIdx === -1) return;
      
      sourceArray.splice(sourceIdx, 1);

      // Update status if moving between columns
      if (sourceStatus !== destinationStatus) {
        todoToMove.status = destinationStatus;
        todoToMove.completed = destinationStatus === "done";
      }

      // Insert into destination at the correct position
      destArray.splice(destinationIndex, 0, todoToMove);

      // Reconstruct the todos array with new order
      plan.todos = [...todoColumn, ...inprogressColumn, ...doneColumn];
    },
    toggleTodoInPlan(state, action) {
      const { planId, todoId } = action.payload;
      const plan = state.find((p) => p.id === planId);
      if (plan) {
        const todo = plan.todos.find((t) => String(t.id) === String(todoId));
        if (todo) {
          todo.completed = !todo.completed;
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
    batchDeletePlans: (state, action) => {
      const idsToDelete = action.payload;
      return state.filter(p => !idsToDelete.includes(p.id));
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
  reorderTodosInPlan,
  toggleTodoInPlan,
  removeTodoFromPlan,
  batchDeletePlans,
} = plansSlice.actions;

export default plansSlice.reducer;