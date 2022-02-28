import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectAuthStatus } from '../slices/auth.slice'

const ProtectedRoute = ({children} : any) => {
    const isAuth = useAppSelector((state) => selectAuthStatus(state))

    return isAuth? children : <Navigate to="/login" />
}

export default ProtectedRoute