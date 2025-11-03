export const getBlogs = () => {
  try {
    const blogs = localStorage.getItem('blogs');
    return blogs ? JSON.parse(blogs) : [];
  } catch (error) {
    console.error('Error reading blogs from localStorage:', error);
    return [];
  }
};

export const getBlogById = (id) => {
  try {
    const blogs = getBlogs();
    return blogs.find((blog) => blog.id === id) || null;
  } catch (error) {
    console.error('Error getting blog by ID:', error);
    return null;
  }
};

export const addBlog = (blogData) => {
  try {
    const blogs = getBlogs();
    const newBlog = {
      ...blogData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    localStorage.setItem('blogs', JSON.stringify(blogs));
    return newBlog;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

export const updateBlog = (id, updatedData) => {
  try {
    const blogs = getBlogs();
    const index = blogs.findIndex((blog) => blog.id === id);
    if (index === -1) {
      return null;
    }
    blogs[index] = {
      ...blogs[index],
      ...updatedData,
      id,
      createdAt: blogs[index].createdAt,
    };
    localStorage.setItem('blogs', JSON.stringify(blogs));
    return blogs[index];
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = (id) => {
  try {
    const blogs = getBlogs();
    const filteredBlogs = blogs.filter((blog) => blog.id !== id);
    if (filteredBlogs.length === blogs.length) {
      return false;
    }
    localStorage.setItem('blogs', JSON.stringify(filteredBlogs));
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const getFilteredBlogs = (searchTerm = '', status = 'all') => {
  try {
    let filtered = getBlogs();

    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term)
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((blog) => blog.status === status);
    }

    return filtered;
  } catch (error) {
    console.error('Error filtering blogs:', error);
    return [];
  }
};

export const getBlogStats = () => {
  try {
    const blogs = getBlogs();
    return {
      total: blogs.length,
      public: blogs.filter((blog) => blog.status === 'public').length,
      unpublic: blogs.filter((blog) => blog.status === 'unpublic').length,
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    return { total: 0, public: 0, unpublic: 0 };
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
