import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '../services/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await projectAPI.getAll(params);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, { rejectWithValue }) => {
  try {
    const { data } = await projectAPI.create(projectData);
    return data.data.project;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data: projectData }, { rejectWithValue }) => {
  try {
    const { data } = await projectAPI.update(id, projectData);
    return data.data.project;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { items: [], pagination: null, loading: false, error: null },
  reducers: { clearProjectError: (s) => { s.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.loading = true; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.projects; s.pagination = a.payload.pagination; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createProject.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateProject.fulfilled, (s, a) => { const i = s.items.findIndex(p => p._id === a.payload._id); if (i >= 0) s.items[i] = a.payload; })
      .addCase(deleteProject.fulfilled, (s, a) => { s.items = s.items.filter(p => p._id !== a.payload); });
  },
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
