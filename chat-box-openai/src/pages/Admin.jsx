import '../App.css';
import {React, useState} from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/* Test API */

function Admin() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handeFileSubmit = (e) => {
    console.log(e.target)
  }
  
  return (
    <div className='app'>
      
        <div class="two alt-two">
        <h1>Tư Vấn Tâm Lý<br></br>
            <span>Hỗ Trợ Bạn Trên Mọi Hành Trình</span>
        </h1>
        </div>
      
        <div className='upload-file-button'>   
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Embed a file
                <VisuallyHiddenInput type="file" accept='.pdf' onChange={handeFileSubmit}/>
            </Button>
        </div>

    </div>
  );
}

export default Admin;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});