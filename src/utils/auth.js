const API_BASE_URL = "/api/users";
import { setAuthToken, getAuthToken, removeAuthToken } from './token';

// Re-export token functions so they can be imported from auth.js
export { setAuthToken, getAuthToken, removeAuthToken };

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/register/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const verifyOTPAndRegister = async ({ email, name, password, role, otp }) => {
  const response = await fetch(`${API_BASE_URL}/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, name, password, role, otp }),
  });
  const data = await response.json();
  if (data.data?.token) setAuthToken(data.data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const verifyLoginOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/verify-login-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (data.data?.token) setAuthToken(data.data.token);
  return data;
};

export const logoutUser = async () => {
  await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
  });
  removeAuthToken();
};