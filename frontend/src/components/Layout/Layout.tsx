import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { AddExpenseModal } from '../AddExpenseModal/AddExpenseModal';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <AddExpenseModal />
    </div>
  );
};

export default Layout;

