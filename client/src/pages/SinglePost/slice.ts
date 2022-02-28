import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PostResponse } from "../../dto/response/post-response.dto";

interface InitialState{
    post: PostResponse
}

const slice = createSlice({
    name: "singlePost",
    initialState: {} as InitialState,
    reducers: {
        getSinglePost: (state, {payload} : PayloadAction<PostResponse>) =>{
            state.post = payload
        },
       
        updateSinglePost: (state, {payload} : PayloadAction<{updateInfo: Partial<PostResponse>}>) => {
            state.post = {...state.post, ...payload.updateInfo}
            console.log(state.post)
        },
    }
})

export const {getSinglePost,  updateSinglePost} = slice.actions
export default slice.reducer
export const selectSinglePost = (state: RootState) => state.singlePost.post
