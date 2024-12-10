import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
  const { data } = await axios.get('/api/notifications', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], loading: false },
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification) notification.isRead = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      });
  },
});

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
