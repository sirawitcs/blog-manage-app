import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { blogFormSchema } from '../validate/blogSchema';

const BlogForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(blogFormSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'unpublic',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        content: initialData.content || '',
        status: initialData.status || 'unpublic',
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <TextField
        fullWidth
        label="Title"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
        margin="normal"
        required
        placeholder="Enter blog title"
      />

      <TextField
        fullWidth
        label="Content"
        {...register('content')}
        error={!!errors.content}
        helperText={errors.content?.message}
        margin="normal"
        required
        multiline
        rows={10}
        placeholder="Write your blog content here..."
      />

      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.status}
        required
      >
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Status">
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="unpublic">Unpublic</MenuItem>
            </Select>
          )}
        />
        {errors.status && (
          <FormHelperText>{errors.status?.message}</FormHelperText>
        )}
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            size="large"
            fullWidth
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BlogForm;
