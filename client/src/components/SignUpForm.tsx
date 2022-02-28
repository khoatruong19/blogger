import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'
import { useSignupMutation } from '../apiCalls/auth.api';
import { UserResponse } from '../dto/response/user-response.dto';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Blogger
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUpForm() {
  const [email, setEmail] = useState<string>("")
  const [emailErrored, setEmailErrored,] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordErrored, setPasswordErrored] = useState<boolean>(false)
  const [passwordConfirmed, setPasswordConfirmed] = useState<string>("")
  const [passwordConfirmedErrored, setPasswordConfirmedErrored] = useState<boolean>(false)

  const navigate = useNavigate()

  const [signup] = useSignupMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!validator.isEmail(email)) setEmailErrored(true)
    if(!password) setPasswordErrored(true)
    if(!passwordConfirmed) setPasswordConfirmedErrored(true)
    if(password && passwordConfirmed && password !== passwordConfirmed) {
      alert("Password is not matched")
      return
    }

    if(emailErrored || passwordErrored || passwordConfirmedErrored) alert("Something wrong!")

    try{
      const res =  (await signup({email, password})) as {data: UserResponse}
      console.log(res.data)
      if(res) navigate("/login")
    }catch(error){console.log(error)}
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#24292F' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmailErrored(false)
                setEmail(e.target.value)}}
            />
              {emailErrored && 
                <Typography variant="caption" className="text-red-500">Please enter a valid email</Typography>
              }
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPasswordErrored(false)
                setPassword(e.target.value)}}
            />
              {passwordErrored && 
               <Typography variant="caption" className="text-red-500">Password can not be empty</Typography>
              }
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordConfirmed"
              label="Password Confirmed"
              type="password"
              id="passwordConfirmed"
              autoComplete="current-passwordConfirmed"
              value={passwordConfirmed}
              onChange={(e) => { setPasswordConfirmedErrored(false)
                setPasswordConfirmed(e.target.value)}}
            />
              {passwordConfirmedErrored && 
                <Typography variant="caption" className="text-red-500">Please confirm your password!</Typography>
              }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item onClick={() => navigate("/login")}>
                <Link href="#" variant="body2">
                  {"Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}