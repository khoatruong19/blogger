
import { Typography } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import BackButton from '../../components/BackButton'
import Posts from '../../components/Posts'
import Layout from '../../layout'
import { selectCurrentUser } from '../../slices/auth.slice'

const SavedPosts = () => {
  const posts = useAppSelector(state => state.posts.posts)
  const user = useAppSelector((state) => selectCurrentUser(state))
  const userPosts = posts?.filter(post => post.saves.find(save => save.userId === user.id))
  console.log(userPosts)
  return (

    <Layout>
        <BackButton/>
        <h1 className='text-3xl md:text-4xl lg:text-5xl mt-5 text-center font-semibold'>Saved Posts</h1>
        {userPosts.length > 0 ? <Posts posts={userPosts}/> : <Typography sx={{marginTop: 20}} className='text-center' variant="h4">You don't save any posts.</Typography> } 
    </Layout>
  )
}

export default SavedPosts