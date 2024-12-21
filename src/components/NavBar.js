import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fantasy Football Challenge 2025
        </Typography>
        <Button color="inherit" href={`${BASE_URL}/user_home/`}>Home</Button>
        <Button color="inherit" href={`${BASE_URL}/standings/`}>Standings</Button>
        <Button color="inherit" href={`${BASE_URL}/players/`}>Players</Button>
        <Button color="inherit" href={`${BASE_URL}/rules/`}>Rules</Button>
        <Button color="inherit" href={`${BASE_URL}/create-entry/`}>Create Entry</Button>
        <Button color="inherit" href={`${BASE_URL}/sign_out/`}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;