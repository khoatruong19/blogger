import { Box, Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import BackButton from '../../components/BackButton'
import CreatePostModal from '../../components/CreatePostModal'
import Posts from '../../components/Posts'
import Layout from '../../layout'

const MyPosts = () => {
  const {userId} = useParams()
  const posts = useAppSelector(state => state.posts.posts)
  console.log(userId)
  const userPosts = posts?.filter(post => post.author.id === userId)
  console.log(userPosts)
  return (

    <Layout>
        <BackButton />
        <h1 className='text-3xl md:text-4xl lg:text-5xl mt-5 text-center font-semibold'>My Posts</h1>
        <CreatePostModal/>
        {userPosts.length > 0 ? <Posts posts={userPosts}/> : <Typography sx={{marginTop: 20}} className='text-center' variant="h4">You don't have any posts.</Typography> } 
    </Layout>
  )
}

export default MyPosts