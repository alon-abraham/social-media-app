import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/api/posts');
  return data;
});

export const createPost = createAsyncThunk('posts/createPost', async (post) => {
  const { data } = await axios.post('/api/posts', post, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
});

const postSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      });
  },
});

export default postSlice.reducer;
