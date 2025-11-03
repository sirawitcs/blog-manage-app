import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import BlogTable from '../components/BlogTable';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { getBlogs, deleteBlog } from '../utils/storage';

const BlogList = ({ onShowSnackbar }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    blog: null,
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, blogs]);

  const loadBlogs = () => {
    const allBlogs = getBlogs();
    setBlogs(allBlogs);
  };

  const applyFilters = () => {
    let filtered = [...blogs];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.content.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    setFilteredBlogs(filtered);
  };

  const handleEdit = (blog) => {
    navigate(`/blogs/edit/${blog.id}`);
  };

  const handleDeleteClick = (blog) => {
    setDeleteDialog({
      open: true,
      blog,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.blog) {
      const success = deleteBlog(deleteDialog.blog.id);
      if (success) {
        loadBlogs(); // Reload blogs after deletion
        onShowSnackbar('Blog deleted successfully', 'success');
      } else {
        onShowSnackbar('Failed to delete blog', 'error');
      }
    }
    setDeleteDialog({ open: false, blog: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, blog: null });
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Blog Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all your blogs
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blogs/add')}
          size="large"
        >
          Add New Blog
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="unpublic">Unpublic</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <BlogTable
        blogs={filteredBlogs}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteDialog.blog?.title}"? This action cannot be undone.`}
      />
    </Box>
  );
};

export default BlogList;
