import { Box, Button, CircularProgress, Container, InputBase, TextField, Typography } from '@mui/material'
import { useState, useCallback } from 'react'
import { useAppSelector } from '../../app/hooks'
import CreatePostModal from '../../components/CreatePostModal'
import Posts from '../../components/Posts'
import { PostResponse } from '../../dto/response/post-response.dto'
import Layout from '../../layout'
import { selectPosts } from '../../slices/posts.slice'

const HomePage = () => {
  const posts = useAppSelector((state) => selectPosts(state))
  const [filterCategory, setFilterCategory] = useState<string>("")

  let filterdPosts : PostResponse[]
  if(filterCategory) {
    filterdPosts = posts?.filter(post => post.categories.find(category => category.toLowerCase().includes(filterCategory.toLowerCase())))
  }else filterdPosts = posts

    return (
    <Layout>
      <Box className='my-10 flex flex-col items-center'>
          <Box className='flex flex-col items-center justify-center gap-y-8 '>
            <h1 className='text-center text-4xl md:text-6xl lg:text-7xl text-blue-400'>Welcome to Blogger!</h1>
            <Typography paragraph variant='h6' className='text-center text-gray-400 max-w-md'>awesome place to make oneself productive and entertained through daily updates</Typography>
            <CreatePostModal/>

          </Box>

          <Box className='mt-8 flex gap-x-2 items-center border-2 px-2 py-1 bg-gray-200 rounded-lg min-w-[300px] justify-between '>
            <InputBase onChange={e => setFilterCategory(e.target.value)} placeholder="Search By Category" className='flex-1'/>
            <Button variant='contained'>Go</Button>
          </Box>

         {posts ? <Posts posts = {filterdPosts}/> : <CircularProgress sx={{marginTop: "100px"}}/>} 

      </Box>
    </Layout>
  )
}

export default HomePage