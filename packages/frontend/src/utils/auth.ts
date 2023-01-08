export function getAuthToken() {
  const token = localStorage.getItem('token');
  return token;
}

export function setAuthToken(token: string) {
  localStorage.setItem('token', token);
}

export function isLoggedIn() {
  return !!getAuthToken();
}

export function clearAuthToken() {
  localStorage.removeItem('token');
}
