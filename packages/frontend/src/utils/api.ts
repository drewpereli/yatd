import { getAuthToken } from './auth';

export async function request(url: `/${string}`, options: RequestInit = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`,
  };

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const opts = {
    ...options,
    headers,
  };

  const res = await fetch(`http://localhost:4000/api/v1${url}`, opts);
  return res.json();
}
