import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateUserInput } from "../dto/request/user/create-user-input.dto";
import { LoginRequest } from "../dto/request/auth/login-request";
import { UserResponse } from "../dto/response/user-response.dto";

// export interface TokenPayload{
//     token:string
// }

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_URL + "auth",
    }),
    endpoints: (builder) => ({
        login: builder.mutation<string, LoginRequest>({
            query:(loginRequest) => ({
                url: "/login",
                method: "POST",
                body: loginRequest
            })
        }),
        signup: builder.mutation<UserResponse, CreateUserInput>({
            query:(createUserInput) => ({
                url: "/signup",
                method: "POST",
                body: createUserInput
            })
        })
    })
})


export const {useLoginMutation, useSignupMutation} = authApi