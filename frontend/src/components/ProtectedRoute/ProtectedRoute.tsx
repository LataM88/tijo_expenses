import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../context';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-main)',
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
