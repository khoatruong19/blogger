import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input, TextareaAutosize, TextField } from '@mui/material';

interface IProps{
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    desc: string,
    setDesc: React.Dispatch<React.SetStateAction<string>>
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

export default function EditDescriptionForm({open, setOpen, desc, setDesc} : IProps) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = React.useState("")
    const handleCreatePost = React.useCallback(() => {
        handleClose()
    },[open])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col items-center justify-center gap-10 w-[90%] h-[60%] md:w-[65%] p-3">
          <Typography variant="h3" >
            Description
          </Typography>
          <TextareaAutosize className='w-full min-h-[80%] border-2' placeholder='Desc..' value={desc} onChange={(e) => setDesc(e.target.value)}  />
        </Box>
      </Modal>
    </div>
  );
}