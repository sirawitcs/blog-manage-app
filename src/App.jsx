import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Snackbar, Alert } from '@mui/material';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlogAdd from './pages/BlogAdd';
import BlogEdit from './pages/BlogEdit';

const initializeBlogData = async () => {
  const existingData = localStorage.getItem('blogs');
  if (!existingData) {
    try {
      const response = await fetch('/data/mockBlogs.json');
      const initialBlogs = await response.json();
      localStorage.setItem('blogs', JSON.stringify(initialBlogs));
    } catch (error) {
      console.error('Failed to load initial blog data:', error);
    }
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    initializeBlogData();
    const loggedIn = sessionStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userEmail', userData.email);
    showSnackbar('Login successful', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    showSnackbar('Logged out successfully', 'info');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : (
              <AuthLayout>
                <Login onLogin={handleLogin} />
              </AuthLayout>
            )
          } />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}>
                <Dashboard onShowSnackbar={showSnackbar} />
              </MainLayout>
            </ProtectedRoute>
          } />
        <Route path="/blogs/add" element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}>
                <BlogAdd onShowSnackbar={showSnackbar} />
              </MainLayout>
            </ProtectedRoute>
          } />
        <Route path="/blogs/edit/:id" element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}>
                <BlogEdit onShowSnackbar={showSnackbar} />
              </MainLayout>
            </ProtectedRoute>
          } />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
