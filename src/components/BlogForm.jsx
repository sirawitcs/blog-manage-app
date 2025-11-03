import { useState, useEffect } from 'react';
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
import { validateBlogForm } from '../utils/validation';

const BlogForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'unpublic',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        status: initialData.status || 'unpublic',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const validation = validateBlogForm({ ...formData, [field]: formData[field] });
    if (validation.errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validation.errors[field],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      content: true,
      status: true,
    });

    const validation = validateBlogForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={() => handleBlur('title')}
        error={touched.title && !!errors.title}
        helperText={touched.title && errors.title}
        margin="normal"
        required
        placeholder="Enter blog title"
      />

      <TextField
        fullWidth
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        onBlur={() => handleBlur('content')}
        error={touched.content && !!errors.content}
        helperText={touched.content && errors.content}
        margin="normal"
        required
        multiline
        rows={10}
        placeholder="Write your blog content here..."
      />

      <FormControl
        fullWidth
        margin="normal"
        error={touched.status && !!errors.status}
        required
      >
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          onBlur={() => handleBlur('status')}
          label="Status"
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="unpublic">Unpublic</MenuItem>
        </Select>
        {touched.status && errors.status && (
          <FormHelperText>{errors.status}</FormHelperText>
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
