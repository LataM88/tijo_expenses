import {
  AppstoreOutlined,
  HistoryOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/dashboard', label: 'Pulpit', icon: <AppstoreOutlined /> },
  { path: '/historia', label: 'Historia', icon: <HistoryOutlined /> },
  { path: '/kategorie', label: 'Kategorie', icon: <TagsOutlined /> },
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoTitle}>Menedżer wydatków</span>
      </div>

      {/* Nawigacja */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Dolna sekcja */}
      <div className={styles.bottom}>
        <div className={styles.infoCard}>
          <InfoCircleOutlined className={styles.infoIcon} />
          <span className={styles.infoTitle}>Małe kwoty, duży obraz.</span>
          <span className={styles.infoText}>
            Zapisuj na bieżąco.{'\n'}Zyskaj finansowy spokój.
          </span>
        </div>

        <div className={styles.divider} />

        <button className={styles.logoutButton}>
          <div className={styles.accountSection}>
            <span className={styles.accountLabel}>Twoja przestrzeń</span>
            <span className={styles.accountSub}>Konto osobiste</span>
          </div>
          <LogoutOutlined className={styles.logoutIcon} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
