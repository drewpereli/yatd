import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { clearAuthToken } from '../utils/auth';

const Logout: Component = function () {
  clearAuthToken();
  useNavigate()('/login');
  return '';
};

export default Logout;
