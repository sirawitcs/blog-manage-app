export const validateBlogForm = (data) => {
  const errors = {};
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }
  if (!data.content || data.content.trim() === '') {
    errors.content = 'Content is required';
  } else if (data.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters';
  } else if (data.content.trim().length > 5000) {
    errors.content = 'Content must not exceed 5000 characters';
  }
  if (!data.status) {
    errors.status = 'Status is required';
  } else if (!['public', 'unpublic'].includes(data.status)) {
    errors.status = 'Status must be either "public" or "unpublic"';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data) => {
  const errors = {};
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  if (!data.password || data.password === '') {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
