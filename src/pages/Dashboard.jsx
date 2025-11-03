import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  Article as ArticleIcon,
  Public as PublicIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getBlogStats, getBlogs, deleteBlog, getFilteredBlogs } from '../utils/storage';
import { useNavigate } from 'react-router';
import BlogTable from '../components/BlogTable';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const Dashboard = ({ onShowSnackbar }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    unpublic: 0,
  });
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    blog: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, blogs]);

  const loadData = () => {
    const blogStats = getBlogStats();
    setStats(blogStats);
    const allBlogs = getBlogs();
    setBlogs(allBlogs);
  };

  const applyFilters = () => {
    const filtered = getFilteredBlogs(searchTerm, statusFilter);
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
        loadData();
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

  const statsCards = [
    {
      title: 'Total Blogs',
      value: stats.total,
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Published',
      value: stats.public,
      icon: <PublicIcon sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light',
    },
    {
      title: 'Unpublished',
      value: stats.unpublic,
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to your blog management system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blogs/add')}
          size="large"
        >
          New Blog
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                  }}
                >
                  <Box sx={{ pr: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={600} color={card.color} >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: card.bgColor,
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          All Blogs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and view all your blog posts
        </Typography>
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

export default Dashboard;
