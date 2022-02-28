import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { SaveResponse } from "../dto/response/save-response.dto"

export const savesApi = createApi({
    reducerPath: "savesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "saves",
        prepareHeaders:(headers) => {
            const token = localStorage.getItem("accessToken")

            if(token){
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        createSave: builder.mutation<SaveResponse, {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`,method: "POST"})
        }),
        deleteSave: builder.mutation<{message:string}, {postId:string | undefined}>({
            query: ({postId}) => ({url: `/${postId}`,method: "Delete"})
        }),
     
      
    })
})


export const {useCreateSaveMutation, useDeleteSaveMutation} = savesApi