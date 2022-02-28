import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { CreateCommentInput } from "../dto/request/comment/create-comment-input.dto"
import { CommentResponse } from "../dto/response/comment-response.dto"
export const commentsApi = createApi({
    reducerPath: "commentsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "comments",
        prepareHeaders:(headers) => {
            const token = localStorage.getItem("accessToken")

            if(token){
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        getAllComments: builder.query<CommentResponse[], {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`})
        }),
     
        createComment: builder.mutation<CommentResponse, CreateCommentInput>({
            query: (createCommentInput) => ({
                url: `/${createCommentInput.postId}`,
                method: "POST",
                body: createCommentInput,
            })
        }),
        updateComment: builder.mutation<CommentResponse, {content: string ,commentId: string}>({
            query: ({commentId,content}) => ({
                url: `/${commentId}`,
                method: "Put",
                body: {content}
            })
        }),
        deleteComment: builder.mutation<{message: string}, {commentId:string}>({
            query: ({commentId}) => ({
                url: `/${commentId}`,
                method: "Delete",
            })
        })
    })
})


export const {useGetAllCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation} = commentsApi