const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const rawApiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || '/api/v1');

const resolveBackendOrigin = () => {
  try {
    return new URL(rawApiUrl, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
};

export const apiBaseUrl = import.meta.env.DEV ? '/api/v1' : rawApiUrl;

export const buildTourImageUrl = (imageCover) => {
  if (!imageCover) return '';
  if (/^https?:\/\//i.test(imageCover)) return imageCover;

  if (import.meta.env.DEV) {
    return `/img/tours/${imageCover}`;
  }

  return `${resolveBackendOrigin()}/img/tours/${imageCover}`;
};
