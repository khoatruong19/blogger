import React from 'react'
import {motion, AnimatePresence} from "framer-motion"
import Post from './Post'
import { PostResponse } from '../dto/response/post-response.dto'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../slices/auth.slice'

interface IProps {
  posts: PostResponse[] | undefined
}

const Posts = ({posts} : IProps) => {
  const user = useAppSelector((state) => selectCurrentUser(state))

  return (
    <motion.div layout className='mt-20 flex flex-wrap gap-12 items-center justify-center '>
        <AnimatePresence>
          {posts?.map(post => (
            <Post key={post.id} post={post} user={user} />
          ))}
        </AnimatePresence>

    </motion.div>
  )
}

export default Posts