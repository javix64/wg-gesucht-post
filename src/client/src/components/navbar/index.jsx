import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ flex: 1, justifyContent: "space-between" }}>
          <Button color="inherit" href="/">
            <Typography variant="h5" component="p">Home</Typography>
          </Button>
          <Box component="div">
            <Button color="inherit" href="/faq">
              F.A.Q
            </Button>
            <Button color="inherit" href="/instructions">
              Instructions
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
