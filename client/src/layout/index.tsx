import { Box } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'

const Layout = ({children} : any) => {
  return (
    <Box className='pb-10'>
        <Navbar/>
        {children}
    </Box>
  )
}

export default Layout