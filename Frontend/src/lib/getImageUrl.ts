import { API_ORIGIN } from './api';

export const getImageUrl = (src?: string | null, fallback = 'https://via.placeholder.com/400') => {
  if (!src) return fallback;
  if (src.startsWith('http')) return src;
  // if stored as relative path like /uploads/..., prepend backend origin
  if (src.startsWith('/')) return `${API_ORIGIN}${src}`;
  return src;
};