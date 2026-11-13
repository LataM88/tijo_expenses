import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
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
