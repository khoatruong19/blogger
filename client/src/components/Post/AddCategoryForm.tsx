import {useState} from 'react';
import { IconButton, NativeSelect } from '@mui/material';
import { Add, Check, Remove } from '@mui/icons-material';
import { UserResponse } from '../../dto/response/user-response.dto';

interface IProps {
    edit: boolean
    categories: string[]
    setCategories: React.Dispatch<React.SetStateAction<string[]>>
}

export default function AddCategoryForm({edit, categories, setCategories} : IProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setCategory("")
    setOpen(false)
  };
  const [category, setCategory] = useState<string>("")

  const handleSelectCategory = (category: string) => {
    if(!categories.find(item => item === category)) setCategories(prev => ([...prev, category]))
    handleClose()
  }
  
  return (
        
        <div className='flex gap-2'>
        {open && edit && 
           <NativeSelect
           defaultValue={30}
           inputProps={{
             name: 'Categories',
             id: 'uncontrolled-native',
           }}
           onChange={(e) => setCategory(e.target.value)}
         >
           <option value="Other">Other</option>
           <option value="Travel">Travel</option>
           <option value="Gaming">Gaming</option>
           <option value="Education">Education</option>
         </NativeSelect>
        }
        {edit && open &&  <IconButton onClick={() => handleSelectCategory(category)}><Check className='text-green-600'/></IconButton>} 
       
        {edit ? open ?  <IconButton onClick={handleClose}><Remove className='text-red-400'/></IconButton> : <IconButton onClick={handleOpen}><Add className='text-green-400'/></IconButton>
        : true    
        }

    </div>
  );
}


