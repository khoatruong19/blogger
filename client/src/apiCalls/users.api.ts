import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { CreateUserInput } from "../dto/request/user/create-user-input.dto"
import { UpdateUserRequest } from "../dto/request/user/update-user.dto"
import { UpdateUserResponse } from "../dto/response/update-user-response.dto"
import { UserResponse } from "../dto/response/user-response.dto"
export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "users",
        prepareHeaders:(headers) => {
            const token = localStorage.getItem("accessToken")

            if(token){
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        createUser: builder.mutation<UserResponse, CreateUserInput>({
            query: (createUserInput) => ({
                url: "/",
                method: "POST",
                body: createUserInput,
            })
        }),
        getUser: builder.query<UserResponse, undefined>({
            query: () => ({url: "/"})
        }),
        updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
            query: (updateInput) => ({
                url: "/update",
                method: "POST",
                body: updateInput,
            })
        })
    })
})

export const {useCreateUserMutation, useGetUserQuery, useUpdateUserMutation} = usersApi