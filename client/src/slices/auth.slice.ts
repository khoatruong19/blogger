import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { UpdateUserRequest } from "../dto/request/user/update-user.dto";
import { UserResponse } from "../dto/response/user-response.dto";

interface AuthState {
    isAuth: boolean 
    user: UserResponse 
}

const slice = createSlice({
    name: "auth",
    initialState: {
        isAuth: localStorage.getItem("accessToken") && true
    } as AuthState,
    reducers: {
        setAuthState: (state, {payload} : PayloadAction<string> ) => {
            state.isAuth = payload === "login" ? true : false
        },
        getUser: (state, {payload} : PayloadAction<AuthState["user"]>) => {
            state.user = payload
        },
        updateUserInfo: (state, {payload} : PayloadAction<UpdateUserRequest >) => {
           state.user = {...state.user, ...payload}
        },
        
        
    }
})

export const {setAuthState, getUser, updateUserInfo} = slice.actions

export default slice.reducer

export const selectAuthStatus = (state: RootState) => state.auth.isAuth

export const selectCurrentUser = (state: RootState) => state.auth.user