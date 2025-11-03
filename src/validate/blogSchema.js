import * as yup from 'yup';

export const blogFormSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .test('not-empty', 'Title is required', (value) => value?.trim() !== '')
    .test('min-length', 'Title must be at least 3 characters', (value) =>
      value?.trim().length >= 3
    )
    .test('max-length', 'Title must not exceed 100 characters', (value) =>
      value?.trim().length <= 100
    ),
  content: yup
    .string()
    .required('Content is required')
    .test('not-empty', 'Content is required', (value) => value?.trim() !== '')
    .test('min-length', 'Content must be at least 10 characters', (value) =>
      value?.trim().length >= 10
    )
    .test('max-length', 'Content must not exceed 5000 characters', (value) =>
      value?.trim().length <= 5000
    ),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['public', 'unpublic'], 'Status must be either "public" or "unpublic"'),
});
