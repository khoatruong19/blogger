import { Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Routes, Route} from 'react-router-dom';
import { useGetUserQuery } from './apiCalls/users.api';
import { useAppDispatch } from './app/hooks';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPosts from './pages/MyPosts';
import ProfilePage from './pages/ProfilePage';
import SavedPosts from './pages/SavedPosts';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { getUser, setAuthState } from './slices/auth.slice';
import {useGetAllPostsQuery} from "./apiCalls/posts.api"
import { getPosts } from './slices/posts.slice';
import SinglePost from './pages/SinglePost';


function App() {
  const {data: user} = useGetUserQuery(undefined)
  const dispatch = useAppDispatch()
  const {data: posts} = useGetAllPostsQuery(undefined)

  useEffect(() => {
    if(user) {
      dispatch(getUser(user))
    }
    if(posts){
      dispatch(getPosts(posts))
    }
  },[user, dispatch,posts])

  return (
      <Container maxWidth="xl">

        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
          <Route path="/post/:postId" element={<ProtectedRoute><SinglePost/></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
          <Route path="/savedposts/:id" element={<ProtectedRoute><SavedPosts/></ProtectedRoute>} />
          <Route path="/posts/:userId" element={<ProtectedRoute><MyPosts/></ProtectedRoute>} />
        </Routes>
     
      </Container>
  );
}

export default App;
