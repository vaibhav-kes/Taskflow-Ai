import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await taskAPI.getAll(params);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const { data } = await taskAPI.create(taskData);
    return data.data.task;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data: taskData }, { rejectWithValue }) => {
  try {
    const { data } = await taskAPI.update(id, taskData);
    return data.data.task;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await taskAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], pagination: null, loading: false, error: null },
  reducers: { clearTaskError: (s) => { s.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.tasks; s.pagination = a.payload.pagination; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => { const i = s.items.findIndex(t => t._id === a.payload._id); if (i >= 0) s.items[i] = a.payload; })
      .addCase(deleteTask.fulfilled, (s, a) => { s.items = s.items.filter(t => t._id !== a.payload); });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
