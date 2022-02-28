import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authApi } from '../apiCalls/auth.api';
import { postsApi } from '../apiCalls/posts.api';
import { usersApi } from '../apiCalls/users.api';
import auth from "../slices/auth.slice"
import posts from "../slices/posts.slice"
import singlePost from "../pages/SinglePost/slice"
import { commentsApi } from '../apiCalls/comments.api';
import { likesApi } from '../apiCalls/likes.api';
import { savesApi } from '../apiCalls/saves.api';


export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postsApi.middleware, usersApi.middleware, authApi.middleware),
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
    [savesApi.reducerPath]: savesApi.reducer,
    auth,
    posts,
    singlePost
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
