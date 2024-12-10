import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (userId) => {
  const { data } = await axios.get(`/api/chat/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
