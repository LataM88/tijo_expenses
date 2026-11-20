import { useState, useMemo } from 'react';
import { RightOutlined, ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { AddExpenseButton } from '../../components/AddExpenseButton/AddExpenseButton';
import { AddExpenseModal } from '../../components/AddExpenseModal/AddExpenseModal';
import { useExpenses } from '../../hooks/useExpenses';
import styles from './Dashboard.module.css';

const { Title, Paragraph, Text } = Typography;

const formatPLN = (amount: number) =>
  amount.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// SVG Donut Chart z rzeczywistymi danymi
const DonutChart = ({
  categories,
  total,
}: {
  categories: { name: string; color: string; amount: number; percent: number }[];
  total: number;
}) => {
  const size = 220;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  if (total === 0 || categories.length === 0) {
    return (
      <div className={styles.donutWrapper}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
        </svg>
        <div className={styles.donutCenter}>
          <Text className={styles.donutCenterLabel}>Łącznie</Text>
          <Text strong className={styles.donutCenterAmount}>0,00 zł</Text>
          <Text className={styles.donutCenterCount}>0 kategorii</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.donutWrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {categories.map((cat, i) => {
          const percent = total > 0 ? cat.amount / total : 0;
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
              stroke={cat.color || '#6b7280'}
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
        <Text className={styles.donutCenterLabel}>Łącznie</Text>
        <Text strong className={styles.donutCenterAmount}>
          {total.toLocaleString('pl-PL')} zł
        </Text>
        <Text className={styles.donutCenterCount}>
          {categories.length} {categories.length === 1 ? 'kategoria' : 'kategorii'}
        </Text>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: expenses = [], isLoading, error } = useExpenses();

  const today = new Date();
  const currentMonthName = today.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
  const formattedMonth =
    currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
  const dayOfMonth = today.getDate();

  // Przetwarzanie rzeczywistych danych pobranych z endpointu
  const { totalAmount, categoryBreakdown, lastExpense } = useMemo(() => {
    let sum = 0;
    const catMap: Record<
      string,
      { name: string; color: string; amount: number }
    > = {};

    for (const exp of expenses) {
      const amount = Number(exp.amount) || 0;
      sum += amount;

      const catName = exp.category?.name || 'Inne';
      const catColor = exp.category?.color || '#6b7280';

      if (!catMap[catName]) {
        catMap[catName] = { name: catName, color: catColor, amount: 0 };
      }
      catMap[catName].amount += amount;
    }

    const breakdown = Object.values(catMap)
      .map((cat) => ({
        ...cat,
        percent: sum > 0 ? Number(((cat.amount / sum) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalAmount: sum,
      categoryBreakdown: breakdown,
      lastExpense: expenses.length > 0 ? expenses[0] : null,
    };
  }, [expenses]);

  return (
    <>
      {/* Header */}
      <Row justify="space-between" align="top" className={styles.header}>
        <Col xs={24} sm={16} className={styles.headerLeft}>
          <Text className={styles.headerLabel}>Twoje finanse</Text>
          <Title level={1} className={styles.headerTitle}>
            Pulpit
          </Title>
          <Paragraph className={styles.headerSubtitle}>
            Wiesz, na co wydajesz. I masz nad tym kontrolę.
          </Paragraph>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
          <button className={styles.monthSelector}>
            {formattedMonth} <RightOutlined />
          </button>
        </Col>
      </Row>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Pobieranie danych z serwera...</Text>
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text type="danger">Wystąpił błąd: {error.message}</Text>
        </div>
      ) : (
        <>
          {/* Karty podsumowania z danymi dynamicznymi */}
          <Row gutter={[16, 16]} className={styles.summaryRow}>
            <Col xs={24} lg={16}>
              <div className={styles.summaryCardPrimary}>
                <Text className={styles.summaryCardLabel}>
                  Wydatki w tym miesiącu
                </Text>
                <div className={styles.summaryAmount}>
                  {formatPLN(totalAmount)}
                  <span className={styles.summaryAmountUnit}>zł</span>
                </div>
                <div className={styles.summaryBadge}>
                  <ArrowDownOutlined /> Bieżące podsumowanie wydatków
                </div>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className={styles.summaryCard}>
                <Text strong className={styles.countCardMonth}>
                  {formattedMonth}
                </Text>
                <div className={styles.countCardNumber}>{expenses.length}</div>
                <Paragraph className={styles.countCardText}>
                  zapisanych wydatków
                </Paragraph>
                <Text className={styles.countCardDate}>
                  Stan na dzień {dayOfMonth}
                </Text>
              </div>
            </Col>
          </Row>

          {/* Sekcja kategorii */}
          <div className={styles.categorySection}>
            <div className={styles.categorySectionHeader}>
              <Title level={2} className={styles.categorySectionTitle}>
                Na co wydajesz?
              </Title>
              <Paragraph className={styles.categorySectionSubtitle}>
                Każda kategoria ma swoje miejsce.
              </Paragraph>
            </div>

            {categoryBreakdown.length === 0 ? (
              <Empty description="Brak wydatków w wybranym okresie. Dodaj pierwszy wydatek!" />
            ) : (
              <Row gutter={[32, 24]} align="middle" className={styles.categoryContent}>
                <Col xs={24} md={10} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <DonutChart categories={categoryBreakdown} total={totalAmount} />
                </Col>

                <Col xs={24} md={14} lg={16}>
                  <div className={styles.categoryList}>
                    <Row className={styles.categoryListHeader}>
                      <Col span={12}>
                        <Text className={styles.categoryListHeaderLabel}>Kategoria</Text>
                      </Col>
                      <Col span={8} style={{ textAlign: 'right' }}>
                        <Text className={styles.categoryListHeaderLabel}>
                          Kwota / Udział
                        </Text>
                      </Col>
                      <Col span={4}>&nbsp;</Col>
                    </Row>

                    {categoryBreakdown.map((cat) => (
                      <Row
                        key={cat.name}
                        align="middle"
                        className={styles.categoryRow}
                      >
                        <Col span={12} className={styles.categoryName}>
                          <span
                            className={styles.categoryDot}
                            style={{ backgroundColor: cat.color }}
                          />
                          <Text>{cat.name}</Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Text strong className={styles.categoryAmount}>
                            {formatPLN(cat.amount)} zł
                          </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                          <Text className={styles.categoryPercent}>{cat.percent}%</Text>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </div>

          {/* Ostatni wydatek */}
          {lastExpense && (
            <div className={styles.lastExpense}>
              <Row align="middle" justify="space-between" gutter={[16, 16]} style={{ width: '100%' }}>
                <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className={styles.lastExpenseBadge}>
                    {lastExpense.date.split('-')[2] || '•'}
                  </div>
                  <div>
                    <Text className={styles.lastExpenseLabel}>Ostatni wydatek</Text>
                    <Title level={4} className={styles.lastExpenseName} style={{ margin: 0 }}>
                      {lastExpense.description || 'Wydatek'}
                    </Title>
                    <Text className={styles.lastExpenseMeta}>
                      {lastExpense.category?.name} · {lastExpense.date}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
                  <Text strong className={styles.lastExpenseAmount}>
                    {formatPLN(Number(lastExpense.amount))} zł
                  </Text>
                  <Link to="/historia" className={styles.lastExpenseLink}>
                    Zobacz historię <RightOutlined />
                  </Link>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}

      {/* Przycisk "Dodaj wydatek" */}
      <AddExpenseButton fixed onClick={() => setIsModalOpen(true)} />

      {/* Modal dodawania nowego wydatku */}
      <AddExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
