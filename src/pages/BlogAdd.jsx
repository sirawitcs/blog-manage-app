import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import BlogForm from '../components/BlogForm';
import { addBlog } from '../utils/storage';

const BlogAdd = ({ onShowSnackbar }) => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    try {
      addBlog(formData);
      onShowSnackbar('Blog created successfully', 'success');
      navigate('/blogs');
    } catch (error) {
      onShowSnackbar('Failed to create blog', 'error');
      console.error('Error creating blog:', error);
    }
  };

  const handleCancel = () => {
    navigate('/blogs');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Add New Blog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create a new blog post
      </Typography>

      <Paper sx={{ p: 3 }}>
        <BlogForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Create Blog"
        />
      </Paper>
    </Box>
  );
};

export default BlogAdd;
