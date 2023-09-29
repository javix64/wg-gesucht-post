import { Formik, Form } from "formik";
import { scrapWgGesucht } from "../../services/scrapWgGesucht";
import { Button, Grid, TextField, Typography } from "@mui/material";
const WGgesucht = () => {
  return (
    <Grid container direction="column" alignItems="center" >
      <Typography variant="h3" component="h1" textAlign="center" sx={{marginTop:'1%', marginBottom:'1%'}}>
        WG-Gesucht App
      </Typography>
      <Formik
        initialValues={{ email: "", password: "", url: "", msg: "" }}
        onSubmit={(values) => {
          scrapWgGesucht(values);
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <Grid
            component={Form}
            container
            spacing={2}
            direction="column"
            maxWidth="md"
          >
            <Grid item>
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                defaultValue={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                defaultValue={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                id="url"
                label="Url"
                variant="outlined"
                defaultValue={values.url}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                id="msg"
                label="Message"
                multiline
                variant="outlined"
                minRows={10}
                defaultValue={values.msg}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item alignItems="center">
              <Button
                variant="outlined"
                color="inherit"
                type="submit"
                size="large"
                sx={{ minWidth: "80%", margin: "auto", display: "block" }}
              >
                Submit!
              </Button>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Grid>
  );
};

export default WGgesucht;
