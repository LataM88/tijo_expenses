import {
  AppstoreOutlined,
  HistoryOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/dashboard', label: 'Pulpit', icon: <AppstoreOutlined /> },
  { path: '/history', label: 'Historia', icon: <HistoryOutlined /> },
  { path: '/categories', label: 'Kategorie', icon: <TagsOutlined /> },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Pasek boczny na komputery / desktopy */}
      <aside className={styles.desktopSidebar}>
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
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Dolna sekcja desktop */}
        <div className={styles.bottom}>
          <div className={styles.infoCard}>
            <InfoCircleOutlined className={styles.infoIcon} />
            <span className={styles.infoTitle}>Małe kwoty, duży obraz.</span>
            <span className={styles.infoText}>
              Zapisuj na bieżąco.{'\n'}Zyskaj finansowy spokój.
            </span>
          </div>

          <div className={styles.divider} />

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Wyloguj się"
          >
            <div className={styles.accountSection}>
              <span className={styles.accountLabel}>Twoja przestrzeń</span>
              <span className={styles.accountSub}>Konto osobiste</span>
            </div>
            <LogoutOutlined className={styles.logoutIcon} />
          </button>
        </div>
      </aside>

      {/* Pasek nawigacyjny na dole ekranu dla urządzeń mobilnych (kafelki) */}
      <nav className={styles.mobileBottomNav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.mobileNavItem} ${isActive ? styles.mobileActive : ''}`
            }
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={styles.mobileNavItem}
          onClick={handleLogout}
          title="Wyloguj"
        >
          <span className={styles.mobileNavIcon}>
            <LogoutOutlined />
          </span>
          <span className={styles.mobileNavLabel}>Wyloguj</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
