import { Bookmark, BookmarkBorder, Check, Delete, Edit, Favorite, FavoriteBorder } from '@mui/icons-material'
import { Avatar, Card, CardMedia, IconButton, TextField, Typography, Chip} from '@mui/material'
import { Box } from '@mui/system'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../../firebase.config'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {motion} from "framer-motion"
import AddCategoryForm from './AddCategoryForm'
import EditDescriptionForm from './EditDescriptionForm'
import { PostResponse } from '../../dto/response/post-response.dto'
import { UserResponse } from '../../dto/response/user-response.dto'
import { useDeletePostMutation, useUpdatePostMutation } from '../../apiCalls/posts.api'
import { useAppDispatch } from '../../app/hooks'
import { deletePosts, updatePosts } from '../../slices/posts.slice'
import { getSinglePost, updateSinglePost } from '../../pages/SinglePost/slice'
import { LikeResponse } from '../../dto/response/like-response.dto'
import { useCreateLikeMutation, useDeleteLikeMutation } from '../../apiCalls/likes.api'
import { useCreateSaveMutation, useDeleteSaveMutation } from '../../apiCalls/saves.api'
import { SaveResponse } from '../../dto/response/save-response.dto'

interface IProps{
  post: PostResponse
  user: UserResponse
}

const Post = ({post, user}: IProps) => {
    const navigate = useNavigate()

    const [liked, setLiked] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [title,setTitle] = useState<string>(post?.title)
    const [description, setDescription] = useState<string>(post?.description)
    const [imageUrl, setImageUrl] = useState<string>(post?.image)
    const [categories, setCategories] = useState<string[]>(post?.categories)
    const [openDescForm, setOpenDescForm] = useState<boolean>(false)
    const [loadingImage, setLoadingImage] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const [deletePost] = useDeletePostMutation()
    const [updatePost] = useUpdatePostMutation()
    const [createLike] = useCreateLikeMutation()
    const [deleteLike] = useDeleteLikeMutation()
    const [createSave] = useCreateSaveMutation()
    const [deleteSave] = useDeleteSaveMutation()

    const handleDeltePost = async (postId: string) => {
      dispatch(deletePosts({postId}))
      await deletePost({postId})
    }

    const handleUpdatePost = async (postId: string) => {
      const updateBody = {title, description, image: imageUrl !== "" ? imageUrl : post.image, categories }
      await updatePost({postId, updateBody}) 
      dispatch(updatePosts({...post, ...updateBody}))
      setEdit(false)
    }

    const handleDeleteCategory = (category: string) => {
      setCategories(categories.filter(item => item !== category))
    }

    const upload = (items : any) => {
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
              setImageUrl(url)
              await (updatePost({postId: post.id, updateBody:{image: imageUrl}}))
              setLoadingImage(false)
            });
      }
      )
    }

    const handleChangeImage = (e : any) => {
      setLoadingImage(true)
      upload([
          {file: e.target.files[0], label: "image"},
      ])
    }

    const handleLongUsername = (name: string) : string => {
      if(name.length > 30) return name.slice(0,20) + "..."
      return name
    }

    const handleLike = async () => {
      if(!liked) {
        const res = (await createLike({postId: post.id})) as {data: LikeResponse}
        if(res.data){
          const {userId} = res.data
          const likes  = [...post.likes, {userId}]
          dispatch(updatePosts({...post, likes}))
        }
      }
      else{
        await deleteLike({postId: post.id})
        const likes  = post.likes.filter(item => item.userId !== user.id)
        dispatch(updatePosts({...post, likes}))
      }
      setLiked(!liked)
    }

    const handleSave = async () => {
      if(!saved) {
        const res = (await createSave({postId: post.id})) as {data: SaveResponse}
        if(res.data){
          const {userId} = res.data
          const saves  = [...post.saves, {userId}]
          dispatch(updatePosts({...post, saves}))
        }
      }
      else{
        await deleteSave({postId: post.id})
        const saves  = post.saves.filter(item => item.userId !== user.id)
        dispatch(updatePosts({...post, saves}))
      }
      setSaved(!saved)
    }

    useEffect(() => {
      setLiked(post?.likes.find(like => like.userId === user?.id) ? true : false)
      setSaved(post?.saves.find(save => save.userId === user?.id) ? true : false)
    },[post, user])


    return (
    <motion.div animate={{opacity:1}} initial={{opacity: 0}} exit={{opacity:0}} className="relative" layout>
      <Card sx={{ maxWidth: 345, border:"none", boxShadow:"none" }} className="hover:scale-105 transition-all duration-150 " >
          <CardMedia
            component="img"
            image={imageUrl}
            height="140"
            alt="green iguana"
            className='rounded-2xl cursor-pointer ' 
            onClick={() => navigate(`/post/${post.id}`)}
          />
          {edit && !loadingImage && <Typography onChange={(e: any) => handleChangeImage(e)} component="label" variant='body1' className='flex items-center justify-center text-blue-400 cursor-pointer pt-2'>Change image
            <input type="file" hidden />
          </Typography>}
          {loadingImage && <Typography variant='body1' className='flex items-center justify-center text-red-400 pt-2'>Uploading image...</Typography>}
          <Box className="flex flex-col gap-y-3">
          <Box className="flex flex-wrap items-center gap-2 mt-2">
              {categories.map(category => (
                  <>
                    { edit ? <Chip key={category} label={category} variant="outlined" onDelete={() => handleDeleteCategory(category)} /> : 

                    <Typography key={category} className='p-1 px-2 rounded-lg bg-blue-400 text-white' variant='body2' component="div">{category}</Typography>
                    }
                  </>
              ))}
              <AddCategoryForm categories={categories} setCategories={setCategories} edit={edit} />
          </Box>

          {edit ? <TextField type="text" className='p-2' value={title} onChange={(e) => setTitle(e.target.value)} /> :
                  <h1 className=' text-2xl font-bold'>
                    {title.length > 24 ? title.slice(0,24) + "..." : title} 
                  </h1>
           }
        
          <Typography variant="body2" color="text.secondary">
           {description.length > 50 ? description.slice(0,50) + "..." : description} {edit && <Edit onClick={() => setOpenDescForm(true)} className='cursor-pointer' fontSize='small'/>}
          </Typography>

          <EditDescriptionForm desc={description} setDesc={setDescription} open={openDescForm} setOpen={setOpenDescForm}/>
      
          <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-2">
                  <Avatar className='cursor-pointer' alt="Remy Sharp" src={post?.author.image}/>
                  <Box>
                      <h1 className=' text-md font-bold'>
                          { post?.author.id === user?.id ? handleLongUsername(user.username) : handleLongUsername(post.author.username) }
                      </h1>
                      <Typography className='text-gray-500' variant='caption' component="div">{JSON.stringify(post.updatedAt).split('T')[0].substring(1)}</Typography>
                  </Box>
              </Box>

              <Box>
                  <Typography variant='caption'>{post?.likes.length}</Typography>
                  <IconButton onClick={handleLike}>
                      {liked ? <Favorite/> :  <FavoriteBorder/>}
                  </IconButton>

                  <IconButton onClick={handleSave}>
                      {saved ? <Bookmark/> :  <BookmarkBorder/>}
                  </IconButton>
              </Box>
              
              
          </Box>
      </Box>

      </Card>
      {post?.author.id === user?.id  && <Box className="absolute top-[-10%] right-0 text-black">  
               
                  {edit ?   <IconButton onClick={() => handleUpdatePost(post.id)} ><Check className='text-green-600'/></IconButton>
                        : <IconButton onClick={() => setEdit(true)}><Edit className='text-blue-400'/></IconButton>
                  }
                <IconButton  onClick ={() => handleDeltePost(post.id)}><Delete className='text-red-500'/></IconButton>
              </Box>
      }
      
    </motion.div>
  )
}

export default Post