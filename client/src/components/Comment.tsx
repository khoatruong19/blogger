import { Check, Delete, Edit } from '@mui/icons-material'
import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDeleteCommentMutation, useUpdateCommentMutation } from '../apiCalls/comments.api'
import { CommentResponse } from '../dto/response/comment-response.dto'
import { UserResponse } from '../dto/response/user-response.dto'

interface IProps{
  comment: CommentResponse
  comments: CommentResponse[]
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>
  trigger: React.Dispatch<React.SetStateAction<boolean>>
  user: UserResponse
}

const Comment = ({comment, user, comments, setComments, trigger}: IProps) => {
  const [edit, setEdit] = useState<boolean>(false)

  const [updateComment] = useUpdateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  const handleDeleteComment = async () =>{
    setComments(comments.filter(item => item.id !== comment?.id))
    await deleteComment({commentId: comment.id})
  }

  const handleEditComment = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>{
    const newComments = comments.map(item => {
      if(item.id === comment.id) return {...item, content: e.target.value}
      else return item
    })
    setComments(newComments)
  }

  const handleUpdateComment = async () => {
    await updateComment({content: comment.content, commentId: comment.id})
    setEdit(false)
    trigger(true)
  }


  return (
    <Box className="min-w-full p-3 bg-gray-100 mb-4 rounded-lg ">
        {!edit ? <Typography variant='body1'>{comment?.content}</Typography> 
               : <TextField value={comment.content} onChange={handleEditComment} /> }
        <Box className='flex items-center justify-between gap-2 mt-4'>
            <Box className='flex items-center gap-2'>
              <Avatar className='cursor-pointer' alt="Remy Sharp" src={comment?.author.image} />
              <Typography variant="h6" >{comment?.author.username}</Typography>
            </Box>
            {user?.id === comment?.author.id && 
              <Box className='flex items-center'>

                  {!edit ? <IconButton onClick={() => setEdit(true)}><Edit className='text-orange-500'/></IconButton> :
                  <IconButton onClick={handleUpdateComment}><Check className='text-green-400'/></IconButton> }

                  <IconButton onClick={handleDeleteComment}><Delete  className='text-red-400'/></IconButton>
              </Box>
            }
            <Typography variant="caption">{JSON.stringify(comment.createdAt).split("T")[0].substring(1)}</Typography>
        </Box>
    </Box>
  )
}

export default Comment