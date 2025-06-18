// Token management utilities
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token) => {
  console.log('Setting auth token:', token ? token.substring(0, 20) + '...' : 'No token')
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token stored in localStorage under key:', TOKEN_KEY)
  }
};

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Getting auth token:', token ? token.substring(0, 20) + '...' : 'No token')
  return token;
};

export const removeAuthToken = () => {
  console.log('Removing auth token')
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const hasToken = !!getAuthToken();
  console.log('Checking authentication:', hasToken)
  return hasToken;
};