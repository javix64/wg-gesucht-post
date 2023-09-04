import { AppBar, Box, Toolbar, Button } from "@mui/material";

const Navbar = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            href="/"
            component="div"
            variant="h6"
            sx={{ flexGrow: 3 }}
          >
            Home
          </Button>
          <Button color="inherit" href="/faq">
            F.A.Q
          </Button>
          <Button color="inherit" href="/instructions">
            Instructions
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
