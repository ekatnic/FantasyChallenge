import React, { useState } from 'react';
import { Avatar, Typography, Box, Popover, MenuItem, Divider, Button } from '@mui/material';
import LogoutButton from './auth/LogoutButton';

const UserProfile = ({ email }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar 
        onClick={handleClick}
        sx={{ 
          bgcolor: 'secondary.main', 
          width: 40, 
          height: 40,
          fontSize: 18,
          cursor: 'pointer',
          '&:hover': { opacity: 0.9 },
        }}
      >
       {email.charAt(0).toUpperCase()}
      </Avatar>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1,
            minWidth: 100, // Optional: Set a minimum width for aesthetic purposes
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              wordBreak: 'break-word',
            }}
          >
           <strong>Email: </strong> {email}
          </Typography>
          <Divider sx={{ width: '100%', my: 1 }} />
          <Box>
            <LogoutButton />
          </Box>
        </Box>

      </Popover>
    </>
  );
};

export default UserProfile;