import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import {
  CompassOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../context';
import styles from './NotFoundPage.module.css';

const { Title, Paragraph } = Typography;

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Ikona w okręgu */}
        <div className={styles.iconCircle}>
          <CompassOutlined />
        </div>

        {/* Kod błędu */}
        <div className={styles.badgeWrapper}>
          <div className={styles.errorCode}>404</div>
        </div>

        {/* Tytuł i opis */}
        <Title level={1} className={styles.title}>
          Nie znaleziono strony
        </Title>
        <Paragraph className={styles.description}>
          Adres, którego szukasz, nie istnieje lub został przeniesiony. Sprawdź
          poprawność linku lub wróć do bezpiecznego miejsca.
        </Paragraph>

        {/* Przyciski nawigacyjne */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleGoBack}
          >
            <ArrowLeftOutlined /> Wróć do poprzedniej
          </button>

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleGoHome}
          >
            <HomeOutlined />
            {isAuthenticated ? 'Przejdź do pulpitu' : 'Strona główna'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
