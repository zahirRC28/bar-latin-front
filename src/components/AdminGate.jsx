import React from 'react';
import useAdminAuth from '../hooks/useAdminAuth';
import Admin from '../pages/Admin';
import AdminLogin from './AdminLogin';

export default function AdminGate() {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? <Admin /> : <AdminLogin />;
}
