import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import BlogForm from '../components/BlogForm';
import { getBlogById, updateBlog } from '../utils/storage';

const BlogEdit = ({ onShowSnackbar }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const blogData = getBlogById(id);
    if (blogData) {
      setBlog(blogData);
    } else {
      setError('Blog not found');
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (formData) => {
    try {
      const updatedBlog = updateBlog(id, formData);
      if (updatedBlog) {
        onShowSnackbar('Blog updated successfully', 'success');
        navigate('/dashboard');
      } else {
        onShowSnackbar('Failed to update blog', 'error');
      }
    } catch (error) {
      onShowSnackbar('Failed to update blog', 'error');
      console.error('Error updating blog:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Blog not found'}
        </Alert>
        <Typography variant="body1">
          The blog you're looking for doesn't exist or has been deleted.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Edit Blog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Update blog details
      </Typography>

      <Paper sx={{ p: 3 }}>
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Update Blog"
        />
      </Paper>
    </Box>
  );
};

export default BlogEdit;
