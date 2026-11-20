import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HistoryPage } from './pages/history/HistoryPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
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
        path: '/kategorie',
        element: <CategoriesPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>404 - Nie znaleziono strony</h2>
      </div>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
