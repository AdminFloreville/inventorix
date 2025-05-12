// src/components/common/PrivateRoute.tsx
import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../../stores/authStore';

const PrivateRoute = observer(() => {
  return authStore.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
});

export default PrivateRoute;
