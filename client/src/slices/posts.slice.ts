import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { PostResponse } from "../dto/response/post-response.dto";

interface InitialState{
    posts: PostResponse[]
}

const slice = createSlice({
    name: "posts",
    initialState: {} as InitialState,
    reducers: {
        getPosts: (state, {payload} : PayloadAction<PostResponse[]>) =>{
            state.posts = payload
        },
        addPosts: (state, {payload} : PayloadAction<PostResponse>) => {
            state.posts = [...state.posts, payload]
        },
        deletePosts: (state, {payload} : PayloadAction<{postId: string}>) => {
            state.posts = state.posts.filter((post: PostResponse) => post.id !== payload.postId)
            console.log(state.posts)
        },
        updatePosts:  (state, {payload} : PayloadAction<PostResponse>) => {
            console.log("Update Posts")
            let newPosts = state.posts.map(post => {
                if(post.id === payload.id) return payload
                return post
            })

            state.posts = newPosts
        },
    }
})

export const {getPosts, addPosts, deletePosts, updatePosts} = slice.actions
export default slice.reducer

export const selectPosts = (state: RootState) => state.posts.posts
