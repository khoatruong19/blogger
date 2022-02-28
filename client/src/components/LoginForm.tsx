import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'
import { useAppDispatch } from '../app/hooks';
import {useLoginMutation } from '../apiCalls/auth.api';
import { UserResponse } from '../dto/response/user-response.dto';
import { setAuthState } from '../slices/auth.slice';


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

export default function LoginForm() {
  const [email, setEmail] = useState<string>("")
  const [emailErrored, setEmailErrored,] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordErrored, setPasswordErrored] = useState<boolean>(false)


  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const [login] = useLoginMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!validator.isEmail(email) || email === "") setEmailErrored(true)
    if(password === "") setPasswordErrored(true)

    if(!emailErrored && !passwordErrored) {
        try {
          const res = await (login({email, password})) as {data:string}
          if(res.data){ 
            window.location.pathname = "/"
            dispatch(setAuthState("login"))
            localStorage.setItem("accessToken", res.data)
          }
          else alert("Your email or password is not valid")
        }
        catch(error) {alert(error)}
    }
    
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
            Sign in
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
              type="email"
              autoFocus
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
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
              onChange = {(e) => { setPasswordErrored(false)
                setPassword(e.target.value)}}
            />
            {passwordErrored && 
              <Typography variant="caption" className="text-red-500">Password can not be empty</Typography>
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item onClick={() => navigate("/signup")}>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
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