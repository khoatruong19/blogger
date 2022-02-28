import React, { useEffect, useState } from 'react'
import {AppBar, Avatar, Badge, Box, CardMedia, IconButton, Toolbar, Typography} from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useMediaQuery} from "react-responsive"
import {useNavigate } from 'react-router-dom';
import { selectCurrentUser, setAuthState, updateUserInfo } from '../slices/auth.slice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ConfirmModal from "./ConfirmModal"

const popularClass = 'cursor-pointer bg-gray-100 p-2 hover:font-semibold hover:text-white hover:bg-blue-300'

const Navbar = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [userMenu, setUserMenu] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [agree, setAgree] = useState<boolean>(false)
  const navigate = useNavigate()

  const user = useAppSelector((state) => selectCurrentUser(state))
  const dispatch = useAppDispatch()

  const handleLogout = () => {

    
    setOpenModal(true)
  }

  useEffect(() => {
    if(agree) {
      if(localStorage.getItem("accessToken")) localStorage.clear()
      dispatch(setAuthState("logout"))
      setAgree(false)
    }
  },[agree])

  return (
    <AppBar position='static' >
        {openModal && <ConfirmModal title="logout" open={openModal} setOpen={setOpenModal} agree={agree} setAgree={setAgree}/>}
        <Toolbar>
            <Box sx={{
            width: 200,
            }} className="fl" >
            <Typography variant="h3" className='cursor-pointer' onClick={() => navigate("/")}>Blogger</Typography>
            </Box>
           
            <Box sx={{ flexGrow: 1 }}/>

            <Avatar alt="Remy Sharp" src={user?.image}/>


            <Box className='relative'>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                  <Box className='flex items-center' onClick = {() => setUserMenu(!userMenu)}>
                      {!isTabletOrMobile && <Typography variant="h5" >{user?.username.slice(0,20)}</Typography>}
                      <IconButton >
                              <ArrowDropDownIcon className='text-white' fontSize='large'/>
                      </IconButton>
                  </Box>
                </IconButton>

                {userMenu && 
                  <Box className='absolute z-20 bottom-[-200%] left-[-25%] sm:left-[-20%] md:left-0 min-w-[85%] w-28 md:min-h-[100px] bg-white overflow-hidden text-black rounded-xl rounded-b-2xl shadow-lg'>
                      <Box className={popularClass} onClick={() => navigate("/profile/123")}>Profile</Box>
                      <Box className={popularClass} onClick={() => navigate(`/posts/${user.id}`)}>My Posts</Box>
                      <Box className={popularClass} onClick={() => navigate("/savedposts/asd")}>Saved Posts</Box>
                      <Box className={popularClass} onClick={handleLogout}>Logout</Box>
                  </Box>
                }

            </Box>


            </Toolbar>
    </AppBar>
  )
}

export default Navbar