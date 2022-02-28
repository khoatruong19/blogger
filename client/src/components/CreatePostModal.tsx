import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Chip, FormControl, Input, InputLabel, NativeSelect, TextareaAutosize, TextField } from '@mui/material';
import { useCreatePostMutation } from '../apiCalls/posts.api';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../firebase.config';
import { useAppDispatch } from '../app/hooks';
import { addPosts } from '../slices/posts.slice';
import { PostResponse } from '../dto/response/post-response.dto';


interface Category{
  id: number,
  category: string
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreatePostModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const [createPost] = useCreatePostMutation()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (category: string) => {
    setCategories(categories.filter(item => item !== category))
  };

  const handleCreatePost = async () => {
    const res = (await createPost({
      title, description, categories, image: imageUrl !== "" ? imageUrl : undefined
    })) as {data: PostResponse}

    console.log(res.data)
    if(res) dispatch(addPosts(res.data))
    handleClose()
  }

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(!categories.find(item => item === e.target.value))
      setCategories(prev => ([...prev,e.target.value]))
  }

  const upload = (items : any) => {
    setUploading(true)
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
            setUploading(false)
            setImageUrl(url)
            });
          }
      )
  }
    const handleChangeImage = (e : any) => {
      console.log(e.target.files)
      upload([
          {file: e.target.files[0], label: "image"},
      ])
    }

  return (
    <div className='flex items-center flex-col justify-center'>
      <Button sx={{marginTop: 3}} onClick={handleOpen}>Create a new post</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}  className="flex flex-col w-[90%] md:w-[60vw] items-center justify-center gap-10  min-h[40vh] max-h-[90vh]">
          <Typography variant="h4" >
            Create a post
          </Typography>
          <TextField type="text" className='w-[80%]' placeholder='Title..' value={title} onChange={(e) => setTitle(e.target.value)}  />
          <textarea className='w-[80%] min-h-[100px] border-2' placeholder='Desc..' value={description} onChange={(e) => setDescription(e.target.value)}  />
          <Box className='flex flex-wrap items-center gap-5'>
            <FormControl >
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Categories
              </InputLabel>
              <NativeSelect
                defaultValue={30}
                inputProps={{
                  name: 'Categories',
                  id: 'uncontrolled-native',
                }}
                onChange={handleSelectCategory}
              >
                <option value="Other">Other</option>
                <option value="Travel">Travel</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
              </NativeSelect>
            </FormControl>
            <Box className='flex flex-wrap gap-2'>
                {categories.map(category => (
                  <Chip key={category} label={category} onDelete={() => handleDelete(category)} />
                ))}
            </Box>
          </Box>
            <Box className='flex items-center gap-10'>
                <Typography className='cursor-pointer text-red-300' component="label" onChange={handleChangeImage}> 
                {!uploading ? "Choose an image" : "Uploading image..."}
                <input type="file" hidden/>
                </Typography>
                
                <Box className='w-64 h-64'>
                  {imageUrl && <img src={imageUrl} className=' object-cover' alt="" />}
                </Box>

            </Box>

            <Button variant="contained" color="success" onClick={handleCreatePost}>Create</Button>
        </Box>
      </Modal>
    </div>
  );
}