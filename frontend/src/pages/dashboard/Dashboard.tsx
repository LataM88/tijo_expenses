import { RightOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AddExpenseButton } from '../../components/AddExpenseButton/AddExpenseButton';
import styles from './Dashboard.module.css';

// ===== Dane mockowe (do podpięcia z API później) =====
const MOCK_CATEGORIES = [
  { name: 'Mieszkanie', color: '#4f46e5', amount: 1800, percent: 42.1 },
  { name: 'Jedzenie', color: '#8b5cf6', amount: 1120, percent: 26.2 },
  { name: 'Transport', color: '#10b981', amount: 480, percent: 11.2 },
  { name: 'Rozrywka', color: '#f59e0b', amount: 360, percent: 8.4 },
  { name: 'Zdrowie', color: '#ef4444', amount: 320, percent: 7.5 },
  { name: 'Inne', color: '#6b7280', amount: 200, percent: 4.7 },
];

const TOTAL_AMOUNT = 4280;
const EXPENSES_COUNT = 9;
const CURRENT_MONTH = 'Listopad 2026';

// Formatowanie kwoty po polsku
const formatPLN = (amount: number) =>
  amount.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ===== SVG Donut Chart =====
const DonutChart = ({
  categories,
  total,
}: {
  categories: typeof MOCK_CATEGORIES;
  total: number;
}) => {
  const size = 220;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className={styles.donutWrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {categories.map((cat, i) => {
          const percent = cat.amount / total;
          const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
          const strokeDashoffset = -circumference * cumulativePercent;
          cumulativePercent += percent;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={cat.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
        })}
      </svg>
      <div className={styles.donutCenter}>
        <span className={styles.donutCenterLabel}>Łącznie</span>
        <span className={styles.donutCenterAmount}>
          {total.toLocaleString('pl-PL')} zł
        </span>
        <span className={styles.donutCenterCount}>
          {categories.length} kategorii
        </span>
      </div>
    </div>
  );
};

// ===== Dashboard =====
export const Dashboard = () => {
  const today = new Date();
  const dayOfMonth = today.getDate();

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerLabel}>Twoje finanse</span>
          <h1 className={styles.headerTitle}>Pulpit</h1>
          <p className={styles.headerSubtitle}>
            Wiesz, na co wydajesz. I masz nad tym kontrolę.
          </p>
        </div>
        <button className={styles.monthSelector}>
          {CURRENT_MONTH} <RightOutlined />
        </button>
      </div>

      {/* Karty podsumowania */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCardPrimary}>
          <div className={styles.summaryCardLabel}>Wydatki w tym miesiącu</div>
          <div className={styles.summaryAmount}>
            {formatPLN(TOTAL_AMOUNT)}
            <span className={styles.summaryAmountUnit}>zł</span>
          </div>
          <div className={styles.summaryBadge}>
            <ArrowDownOutlined /> 11,9% mniej niż w październiku
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.countCardMonth}>{CURRENT_MONTH}</div>
          <div className={styles.countCardNumber}>{EXPENSES_COUNT}</div>
          <div className={styles.countCardText}>zapisanych wydatków</div>
          <div className={styles.countCardDate}>Stan na {dayOfMonth} listopada</div>
        </div>
      </div>

      {/* Sekcja kategorii */}
      <div className={styles.categorySection}>
        <div className={styles.categorySectionHeader}>
          <h2 className={styles.categorySectionTitle}>Na co wydajesz?</h2>
          <p className={styles.categorySectionSubtitle}>
            Każda kategoria ma swoje miejsce.
          </p>
        </div>

        <div className={styles.categoryContent}>
          <DonutChart categories={MOCK_CATEGORIES} total={TOTAL_AMOUNT} />

          <div className={styles.categoryList}>
            <div className={styles.categoryListHeader}>
              <span className={styles.categoryListHeaderLabel}>Kategoria</span>
              <span className={styles.categoryListHeaderLabel}>
                Kwota / Udział
              </span>
              <span className={styles.categoryListHeaderLabel}>&nbsp;</span>
            </div>

            {MOCK_CATEGORIES.map((cat) => (
              <div className={styles.categoryRow} key={cat.name}>
                <div className={styles.categoryName}>
                  <span
                    className={styles.categoryDot}
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </div>
                <span className={styles.categoryAmount}>
                  {formatPLN(cat.amount)} zł
                </span>
                <span className={styles.categoryPercent}>{cat.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ostatni wydatek */}
      <div className={styles.lastExpense}>
        <div className={styles.lastExpenseBadge}>{dayOfMonth}</div>
        <div className={styles.lastExpenseInfo}>
          <span className={styles.lastExpenseLabel}>Ostatni wydatek</span>
          <div className={styles.lastExpenseName}>Zakupy spożywcze</div>
        </div>
        <span className={styles.lastExpenseMeta}>Jedzenie · Dzisiaj</span>
        <span className={styles.lastExpenseAmount}>{formatPLN(420)} zł</span>
        <Link to="/historia" className={styles.lastExpenseLink}>
          Zobacz historię <RightOutlined />
        </Link>
      </div>

      {/* Przycisk "Dodaj wydatek" */}
      <AddExpenseButton
        fixed
        onClick={() => {
          /* TODO: otwórz modal */
        }}
      />
    </>
  );
};

export default Dashboard;
