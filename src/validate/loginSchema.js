import * as yup from 'yup';

export const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .test('not-empty', 'Email is required', (value) => value?.trim() !== '')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
