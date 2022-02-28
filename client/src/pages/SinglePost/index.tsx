import { Add, ArrowLeft, Bookmark, BookmarkBorder, Check, Clear, Favorite, FavoriteBorder } from '@mui/icons-material'
import { Avatar, Box, Button, CardMedia, Chip, CircularProgress, IconButton, NativeSelect, TextareaAutosize, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {useNavigate, useParams } from 'react-router-dom'
import Comment from '../../components/Comment'
import Layout from '../../layout'
import {Edit} from '@mui/icons-material'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../../firebase.config'
import { useDeletePostMutation, useGetPostByIdQuery, useUpdatePostMutation } from '../../apiCalls/posts.api'
import { PostResponse } from '../../dto/response/post-response.dto'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../slices/auth.slice'
import { getSinglePost, selectSinglePost, updateSinglePost } from './slice'
import { deletePosts, updatePosts } from '../../slices/posts.slice'
import axios from 'axios'
import { useCreateCommentMutation, useGetAllCommentsQuery } from '../../apiCalls/comments.api'
import { CommentResponse } from '../../dto/response/comment-response.dto'
import { LikeResponse } from '../../dto/response/like-response.dto'
import { SaveResponse } from '../../dto/response/save-response.dto'
import { useCreateLikeMutation, useDeleteLikeMutation } from '../../apiCalls/likes.api'
import { useCreateSaveMutation, useDeleteSaveMutation } from '../../apiCalls/saves.api'
import BackButton from '../../components/BackButton'

interface IPostFuncProps {
    isMobile: boolean
}

interface ICSProps {
    category: string
}

const SinglePost = () => {
    const {postId} = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    
    const user = useAppSelector(state => selectCurrentUser(state))
    const post = useAppSelector(state => selectSinglePost(state))

    const [liked, setLiked] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const [editTitle, setEditTitle] = useState<boolean>(false)
    const [editDesc, setEditDesc] = useState<boolean>(false)
    const [category, setCategory] = useState<string>("")
    const [editCategories, setEditCategories] = useState<boolean>(false)
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [comments, setComments] = useState<CommentResponse[]>([]) 
    const [comment, setComment] = useState<string>("")
    const [updateCommentTrigger, setUpdateCommentTrigger] = useState<boolean>(false)

    const [updatePost] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()
    const [createComment] = useCreateCommentMutation()
    const [createLike] = useCreateLikeMutation()
    const [deleteLike] = useDeleteLikeMutation()
    const [createSave] = useCreateSaveMutation()
    const [deleteSave] = useDeleteSaveMutation()
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })
    const isAuth = user?.id === post?.author.id

    const handleEditTitle = async () => {
        setEditTitle(false)
        await updatePost({updateBody: {title:post.title}, postId:post.id})
        dispatch(updatePosts(post))
    }

    const handleEditDesc = async () => {
        setEditDesc(false)
        await updatePost({updateBody: {description:post.description}, postId:post.id})
        dispatch(updatePosts(post))
    }

    const handleEditCategories = async () => {
        if(!post.categories.find(item => item === category)){
            const newCategories = [...post.categories, category]
            dispatch(updatePosts({...post, categories: newCategories}))
            dispatch(updateSinglePost({updateInfo: {categories: newCategories}}))
            const res = (await updatePost({updateBody: {categories: newCategories}, postId:post.id})) as {data: PostResponse}
        }
    }

    const handleDeletePost = async () => {
        try{
            await deletePost({postId: post.id})
            dispatch(deletePosts({postId: post.id}))
            navigate(-1)
        }catch(error) {console.log(error)}
    }

    const handleDeleteCategory =  async (category: string) => {
        const newCategories = post.categories.filter(item => item !== category)
        dispatch(updatePosts({...post, categories: newCategories}))
        dispatch(updateSinglePost({updateInfo: {categories: newCategories }}))
        const res = (await updatePost({updateBody: {categories: newCategories}, postId:post.id})) as {data: PostResponse}
    }

    const handleLike = async () => {
        if(!liked) {
          const res = (await createLike({postId: post.id})) as {data: LikeResponse}
          if(res.data){
            const {userId} = res.data
            const likes  = [...post.likes, {userId}]
            dispatch(updatePosts({...post, likes}))
            dispatch(updateSinglePost({updateInfo: {likes}}))
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
            dispatch(updateSinglePost({updateInfo: {saves}}))
          }
        }
        else{
          await deleteSave({postId: post.id})
          const saves  = post.saves.filter(item => item.userId !== user.id)
          dispatch(updatePosts({...post, saves}))
        }
        setSaved(!saved)
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
                dispatch(updatePosts({...post, image:url}))
                dispatch(updateSinglePost({updateInfo: {image: url}}))
                await (updatePost({updateBody:{image: url}, postId: post.id})) 
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

    const handleCreateComment = async () => {
        if(comment !== "") {
            const res = (await createComment({content: comment, postId: post.id})) as {data: CommentResponse}

            if(res.data) {
                setComments(prev => [ res.data,...prev])
            }

            setComment("")
        }
        else alert("Comment cant be empty!!")
    }


    const CategorySituation  = ({ category} : ICSProps) : JSX.Element => {
        if(isAuth) return <Chip label={category} onDelete={() => handleDeleteCategory(category)} />
        else return <Typography className="p-1 px-2 rounded-lg bg-blue-400 text-white">{category}</Typography> 
    }

    const PostFunc = ({isMobile} : IPostFuncProps) => {
        return (
            <Box className={`${!isMobile ? "absolute " : "mt-4 flex gap-5"} top-[-100px] right-0`}>
                <Box className='flex items-center gap-2 mb-4 cursor-pointer' onClick={() => navigate("/profile/23")}>
                    <Avatar alt="Remy Sharp" src={post?.author.image}/>
                    <Typography variant="h6" >{post?.author.username}</Typography>
                </Box>
    
                <Box className={"flex gap-5"}>
                    <Box className='flex items-center mb-4 gap-2'>
                        <Box className='cursor-pointer text-gray-500' onClick={handleLike}>
                            {liked ? <Favorite fontSize='large'/> :  <FavoriteBorder fontSize='large'/>}
                        </Box>
                        <Typography variant='body1'>{post?.likes.length}</Typography>
                    </Box>
        
                    <Box className='cursor-pointer text-gray-500' onClick={handleSave}>
                        {saved ? <Bookmark fontSize='large'/> :  <BookmarkBorder fontSize='large'/>}
                    </Box>
                </Box>
                
            </Box>
        )
    }

    useEffect(() => {
        const getPost = async() => {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}posts/${postId}`, {
                headers:{
                    'Authorization': "Bearer " + localStorage.getItem("accessToken")
                },
            })
            
            if(res.data) dispatch(getSinglePost(res.data))
        }
        getPost()
    },[postId])



    useEffect(() => {
        const getComments = async() => {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}comments/${postId}`, {
                headers:{
                    'Authorization': "Bearer " + localStorage.getItem("accessToken")
                },
            })
            
            if(res.data) setComments(res.data)
        }
        getComments()
    },[updateCommentTrigger])

    useEffect(() => {
        setLiked(post?.likes.find(like => like.userId === user?.id) ? true : false)
        setSaved(post?.saves.find(save => save.userId === user?.id) ? true : false)
      },[post, user])

    if(!post || !comments) return <CircularProgress className='m-auto' />

    return (
    <Layout>
        <Box className='relative'>
            <Box className='flex items-center justify-between'>
                <BackButton/>
                {post?.author.id === user?.id && <Button onClick={handleDeletePost} variant="contained" color="error">Delete post</Button>}
            </Box>

            <Box className='flex flex-col items-center justify-center'>
                <Typography component="div" className="text-gray-400" variant="h6">Published {post?.updatedAt && JSON.stringify(post?.updatedAt).split("T")[0].substring(1)}</Typography>
                
                {editTitle ? <input onBlur={handleEditTitle} className='min-w-[30vw] h-20 text-2xl font-bold border-2' type="text" value={post?.title} onChange={(e) => dispatch(updateSinglePost({updateInfo: {title: e.target.value}}))}/> :
                    <h1 className='text-center text-3xl md:text-4xl lg:text-5xl font-bold'> {post?.title} 
                        {isAuth && <Edit onClick={() => setEditTitle(true)} className="cursor-pointer ml-2 text-red-400" />}
                    </h1>
                 }

                <Box className="flex flex-wrap items-center gap-4 md:gap-10 mt-5 md:mt-8">
                    {post?.categories.map(category => (
                        <CategorySituation key={category} category={category} />
                    ))}
                  
                    {isAuth && ! editCategories && <IconButton onClick={() => setEditCategories(true)}><Add className='text-green-400'/></IconButton>}
                    {editCategories && <Box className='flex items-center gap-3'>
                            <NativeSelect
                            defaultValue={30}
                            inputProps={{
                                name: 'Categories',
                                id: 'uncontrolled-native',
                            }}
                            onChange={e => setCategory(e.target.value)}
                            >
                            <option value="Other">Other</option>
                            <option value="Travel">Travel</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Education">Education</option>
                            </NativeSelect>
                            <IconButton onClick={handleEditCategories}><Check className='text-green-400'/></IconButton>

                            <IconButton onClick={() => setEditCategories(false)}><Clear className='text-red-400'/></IconButton>

                            </Box>
                    }
                       
                </Box>

                <Box className='min-w-full mt-5 flex flex-col items-center justify-center relative'>
                    <img
                        src={post?.image}
                        alt="green iguana"
                        className='rounded-2xl min-h-[40vh] md:max-w-[60vw] object-fit'
                        
                    />
                    <PostFunc isMobile={isTabletOrMobile}/>

                    <Box className='mt-10 w-full max-w-5xl text-center break-words'>
                        {editDesc ? <TextareaAutosize onBlur={handleEditDesc} className='w-full min-h-[20%] border-2' value={post.description} onChange={e => dispatch(updateSinglePost({updateInfo: {description: e.target.value}}))} /> : <>
                             {post?.description} {isAuth && <Edit onClick={() => setEditDesc(true)} className="cursor-pointer ml-2 text-red-400" />
                             }
                             </>
                        }

                    </Box>

                    <Box className='w-full md:w-[60vw] flex flex-col justify-center' >
                        <h1 className='text-center text-3xl my-8 md:text-4xl lg:text-5xl font-bold'>Comments</h1>
                        <Box className='w-full flex items-center gap-2 mb-5'>
                            <TextField value={comment} onChange={e => setComment(e.target.value)} className='flex-1' type="text" placeholder='Comment'/>
                            <Button onClick={handleCreateComment} className=' h-14' variant="contained">Comment</Button>
                        </Box>

                        <Box className='w-full'>
                            {comments?.map(comment => (
                                <Comment trigger={setUpdateCommentTrigger} comments={comments} setComments={setComments} user={user} comment={comment} key={comment.id}/>
                            ))}
                            
                        </Box>
                    </Box>

                 {isAuth && <Typography onChange={handleChangeImage} component="label" className='absolute opacity-50 hover:opacity-100 top-5 text-white hover:text-blue-400 font-bold text-center hover:bg-gray-200 p-3 rounded-xl cursor-pointer' variant='h5'>
                        {loadingImage ? <span className="text-red-400">Uploading Image...</span> : "Change image"}
                        <input type="file" hidden/>
                    </Typography>
                }   
                </Box>
            </Box>

        </Box>
    </Layout>
  )
}

export default SinglePost