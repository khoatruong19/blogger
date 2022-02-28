import { Edit } from '@mui/icons-material'
import { Button, IconButton, TextareaAutosize, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateUserMutation } from '../apiCalls/users.api'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { UpdateUserResponse } from '../dto/response/update-user-response.dto'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../firebase.config'
import Layout from '../layout'
import { selectCurrentUser, updateUserInfo} from '../slices/auth.slice'
import { updatePosts } from '../slices/posts.slice'


const ProfilePage = () => {
    const navigate = useNavigate()
    const user = useAppSelector((state) => selectCurrentUser(state))

    const [password, setPassword] = useState("")
    const [passwordConfirmed, setPasswordConfirmed] = useState("")
    const [editBio, setEditBio] = useState(false)
    const [bio,setBio] = useState(user?.bio)
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [changingUsername, setChangingUsername]= useState<boolean>(false)

    const [updateUser] = useUpdateUserMutation()
    const dispatch = useAppDispatch()

    const handleUpdateUsername = async () => {
        const res = (await updateUser({username: user.username}) as {data: UpdateUserResponse})
        setChangingUsername(false)
        console.log(res.data.message)
    }

    const handleUpdateBio = async () => {
        setEditBio(false)
        const res = (await updateUser({bio}) as {data: UpdateUserResponse})
        console.log(res.data.message)
        dispatch(updateUserInfo({bio}))
    }

    const upload = (items : any) => {
            setLoadingImage(true)
            const item = items[0]
            const fileName = new Date().getTime() + item.label + item.file.name
            const storageRef = ref(storage, 'images/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef, item.file);
            uploadTask.on("state_changed", snapshot => {
                const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
                console.log("Upload is " + progress + " % done")
          },
            (error) => {console.log(error)},() => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    dispatch(updateUserInfo({image: url}))
                    const res = (await updateUser({image: url}) as {data: UpdateUserResponse})
                    window.location.reload()         
                    setLoadingImage(false)
                  });
            }
        )
    }

    const handleChangePassword = async () => {
        if(password !== passwordConfirmed) alert("Password is not matched")
        else{
            const res = (await updateUser({password}) as {data: UpdateUserResponse})
            console.log(res.data.message)
            alert("Password has changed successfully!")
        }
    }

    const handleChangeAvatar = (e : any) => {
        upload([
            {file: e.target.files[0], label: "image"},
        ])
    }


    return (
    <Layout>
        <Box className="flex flex-col lg:flex-row items-center justify-between mt-10">
            <Box className="flex-1">
                <img alt="avatar" className='' src={user?.image} />
                <h1 className='text-3xl md:text-4xl lg:text-5xl mt-5 text-center font-semibold'>{user?.username}</h1>
                {editBio ? <TextareaAutosize onBlur={handleUpdateBio} onChange={(e) => setBio(e.target.value)} className='w-full text-xl md:text-3xl my-5' value={bio}/> : 
                <p className='text-xl md:text-3xl text-center my-5'>
                    {user?.bio} 
                    {user && <IconButton onClick={() => setEditBio(true)} className='ml-3'><Edit/></IconButton>}
                </p>}
                
            </Box>
            <Box className="flex-1 flex items-center justify-center">
                {user ? <Box className="flex flex-col gap-10">
                    <Box className="flex flex-col gap-5 ">
                    <h1 className='text-3xl md:text-4xl lg:text-5xl my-5 text-center font-semibold'>Edit profile</h1>
                    <Box className="flex items-center justify-center ">
                        <input className='h-14 flex-1' type="text"  value={user.username} onChange={(e) => {
                            dispatch(updateUserInfo({username: e.target.value}))
                            setChangingUsername(true)
                            }}/>
                        <Button className='h-14 z-20' variant="contained" color="error" disabled={!changingUsername} onClick={handleUpdateUsername}>Change username</Button>
                    </Box>
                    <Box className = "flex flex-wrap">
                        <TextField type="password" placeholder='Your new password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <TextField type="password" placeholder='New password confirmed' value={passwordConfirmed} onChange={(e) => setPasswordConfirmed(e.target.value)}/>
                        <Button variant="contained" color="secondary" onClick={handleChangePassword}>Change password</Button>
                    </Box>
                    <Button variant="contained" color="primary" component="label" onChange={handleChangeAvatar}>{loadingImage ? "Loading image..." : "Change avatar"} <input type="file" hidden/></Button>
                    </Box>
                    <Button variant="contained" color="success" onClick={() => navigate("/posts/asd")}>See all your posts</Button>
                </Box> : <Button variant="contained" color="success" onClick={() => navigate("/posts/asd")}>See all his posts</Button>}
            </Box>
        </Box>  
    </Layout>
  )
}

export default ProfilePage