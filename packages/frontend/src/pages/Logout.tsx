import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { useAuth } from '../contexts/auth';

const Logout: Component = function () {
  const { logOut } = useAuth();
  logOut();
  useNavigate()('/login');
  return '';
};

export default Logout;
