import { Route, Routes, Navigate } from 'react-router-dom';
import { RendAni } from '../components/RendAni'
import { Home } from '../pages/Home';
import Admin from '../pages/Admin';
import AdminLogin from '../components/AdminLogin';
import useAdminAuth from '../hooks/useAdminAuth';

export const AppRoutes = () => {
  const { isAuthenticated } = useAdminAuth();
  return (
    <Routes>
        <Route path='/' element={<RendAni />}>
            <Route index element={
                <Home/>
            } />
        </Route>
        <Route path='/admin/login' element={isAuthenticated ? <Navigate to={'/admin'} /> : <AdminLogin/>} />
        <Route path='/admin' element={isAuthenticated ? <Admin/> : <Navigate to={'/admin/login'} />} />
        <Route path='/*' element={<Navigate to={'/'} />} />
    </Routes>
  )
}
