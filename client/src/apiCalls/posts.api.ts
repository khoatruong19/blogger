import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { PostResponse } from "../dto/response/post-response.dto"
import { CreatePostInput } from "../dto/request/post/create-post-input.dto"
export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "posts",
        prepareHeaders:(headers) => {
            const token = localStorage.getItem("accessToken")

            if(token){
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        getAllPosts: builder.query<PostResponse[], undefined>({
            query: () => ({url: "/"})
        }),
        getPostById: builder.query<PostResponse, {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`})
        }),
        getPostByUserId: builder.query<PostResponse[], {userId:string | undefined}>({
            query: ({userId}) => ({url: `/byUser/${userId}`})
        }),
        createPost: builder.mutation<PostResponse, CreatePostInput>({
            query: (createPostInput) => ({
                url: "/",
                method: "POST",
                body: createPostInput,
            })
        }),
        updatePost: builder.mutation<PostResponse, {updateBody : Partial<CreatePostInput>,postId: string}>({
            query: ({postId,updateBody}) => ({
                url: `/${postId}`,
                method: "Put",
                body: updateBody
            })
        }),
        deletePost: builder.mutation<{message: string}, {postId:string}>({
            query: ({postId}) => ({
                url: `/${postId}`,
                method: "Delete",
            })
        })
    })
})


export const {useGetAllPostsQuery, useCreatePostMutation, useDeletePostMutation, useUpdatePostMutation, useGetPostByIdQuery, useGetPostByUserIdQuery} = postsApi