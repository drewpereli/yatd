export function getAuthTokenLocalStorage() {
  const token = localStorage.getItem('token');
  return token;
}

export function setAuthTokenLocalStorage(token: string) {
  localStorage.setItem('token', token);
}

export function isLoggedIn() {
  return !!getAuthTokenLocalStorage();
}

export function clearAuthTokenLocalStorage() {
  localStorage.removeItem('token');
}
