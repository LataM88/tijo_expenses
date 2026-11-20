import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthPage } from './pages/auth/AuthPage';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HistoryPage } from './pages/history/HistoryPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';
import { NotFoundPage } from './pages/notFound/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    // Wszystkie trasy wewnątrz ProtectedRoute wymagają zalogowania
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/historia',
            element: <HistoryPage />,
          },
          {
            path: '/history',
            element: <HistoryPage />,
          },
          {
            path: '/kategorie',
            element: <CategoriesPage />,
          },
          {
            path: '/categories',
            element: <CategoriesPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
