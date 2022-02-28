import { ArrowLeft } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate()
  return (
    <IconButton sx={{marginTop: 2, color: "gray"}} onClick={() => navigate(-1)}>
        <ArrowLeft fontSize='large'/>
        <Typography variant='h6'>Go back</Typography>
    </IconButton>
  )
}

export default BackButton