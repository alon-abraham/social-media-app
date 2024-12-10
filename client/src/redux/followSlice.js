import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const followUser = createAsyncThunk('follow/followUser', async (userId) => {
  await axios.post(`/api/follow/${userId}/follow`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return userId;
});

export const unfollowUser = createAsyncThunk('follow/unfollowUser', async (userId) => {
  await axios.delete(`/api/follow/${userId}/unfollow`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return userId;
});

const followSlice = createSlice({
  name: 'follow',
  initialState: { following: [] },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        state.following.push(action.payload);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.following = state.following.filter((id) => id !== action.payload);
      });
  },
});

export default followSlice.reducer;
