import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { LikeResponse } from "../dto/response/like-response.dto"
export const likesApi = createApi({
    reducerPath: "likesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "likes",
        prepareHeaders:(headers) => {
            const token = localStorage.getItem("accessToken")

            if(token){
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        createLike: builder.mutation<LikeResponse, {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`,method: "POST"})
        }),
        deleteLike: builder.mutation<{message:string}, {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`,method: "Delete"})
        }),
     
      
    })
})


export const {useCreateLikeMutation, useDeleteLikeMutation} = likesApi