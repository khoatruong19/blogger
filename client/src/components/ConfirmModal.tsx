import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'

interface IProps{
    title: string
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    agree: boolean
    setAgree: React.Dispatch<React.SetStateAction<boolean>>
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const ConfirmModal = ( {title ,open,setOpen,agree,setAgree}: IProps) => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleYes = () => {
        handleClose()
        setAgree(true)
    }

    const handleNo = () => {
        handleClose()
        setAgree(false)
    }

  return (
    <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" className='text-center' variant="h5" component="h2">
                   Do you want to <strong>{title}</strong> ?
                </Typography>
               <Box className='flex items-center gap-5 mt-5 justify-center'>
                   <Button variant='contained' color="success" onClick={handleYes}>Yes</Button>
                   <Button variant='contained' color="error"onClick={handleNo}>No</Button>
               </Box>
            </Box>
        </Modal>
    </div>
  )
}

export default ConfirmModal