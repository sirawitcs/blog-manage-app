import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { loginFormSchema } from '../validate/loginSchema';

const Login = ({ onLogin }) => {
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onFormSubmit = (data) => {
    setLoginError('');
    onLogin({ email: data.email });
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Login to manage your blogs
        </Typography>
      </Box>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
          autoComplete="email"
          autoFocus
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Demo: Use any email and password (min 6 chars)
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
