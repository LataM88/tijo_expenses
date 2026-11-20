import { useMemo } from 'react';
import { RightOutlined, ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, type TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AddExpenseButton } from '../../components/AddExpenseButton/AddExpenseButton';
import { MonthDropdown } from '../../components/MonthDropdown/MonthDropdown';
import { useExpenses } from '../../hooks/useExpenses';
import { useExpenseModalStore } from '../../store/useExpenseModalStore';
import { useDateFilterStore } from '../../store/useDateFilterStore';
import { formatPLN, formatMonthPL, formatDatePL } from '../../utils/formatters';
import styles from './Dashboard.module.css';

ChartJS.register(ArcElement, Tooltip);

const { Title, Paragraph, Text } = Typography;

// Wykres pierścieniowy z użyciem Chart.js (react-chartjs-2)
const DonutChart = ({
  categories,
  total,
}: {
  categories: { name: string; color: string; amount: number; percent: number }[];
  total: number;
}) => {
  if (total === 0 || categories.length === 0) {
    const emptyData = {
      datasets: [
        {
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0,
        },
      ],
    };

    return (
      <div className={styles.donutWrapper}>
        <div className={styles.donutContainer}>
          <Doughnut
            data={emptyData}
            options={{
              cutout: '74%',
              plugins: { tooltip: { enabled: false } },
              maintainAspectRatio: false,
            }}
          />
          <div className={styles.donutCenter}>
            <Text className={styles.donutCenterLabel}>Łącznie</Text>
            <Text strong className={styles.donutCenterAmount}>0,00 zł</Text>
            <Text className={styles.donutCenterCount}>0 kategorii</Text>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.amount),
        backgroundColor: categories.map((c) => c.color || '#6b7280'),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    cutout: '74%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const val = Number(context.raw) || 0;
            return ` ${context.label}: ${formatPLN(val)} zł`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.donutWrapper}>
      <div className={styles.donutContainer}>
        <Doughnut data={chartData} options={chartOptions} />
        <div className={styles.donutCenter}>
          <Text className={styles.donutCenterLabel}>Łącznie</Text>
          <Text strong className={styles.donutCenterAmount}>
            {formatPLN(total)} zł
          </Text>
          <Text className={styles.donutCenterCount}>
            {categories.length} {categories.length === 1 ? 'kategoria' : 'kategorii'}
          </Text>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { openModal } = useExpenseModalStore();
  const { selectedDate } = useDateFilterStore();
  const { data: expenses = [], isLoading, error } = useExpenses();

  const formattedMonth = formatMonthPL(selectedDate);
  const today = new Date();
  const dayOfMonth = today.getDate();

  // Filtrowanie wydatków według wybranego miesiąca
  const filteredExpenses = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    return expenses.filter((exp) => {
      if (!exp.date) return false;
      const [expY, expM] = exp.date.split('-').map(Number);
      return expY === y && expM === m + 1;
    });
  }, [expenses, selectedDate]);

  // Sortowanie wydatków: najnowsza data, a przy tej samej dacie najnowsze ID (najpóźniej dodane)
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.id - a.id;
    });
  }, [filteredExpenses]);

  // Przetwarzanie danych pobranych z endpointu dla wybranego miesiąca
  const { totalAmount, categoryBreakdown, lastExpense } = useMemo(() => {
    let sum = 0;
    const catMap: Record<
      string,
      { name: string; color: string; amount: number }
    > = {};

    for (const exp of sortedExpenses) {
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
      lastExpense: sortedExpenses.length > 0 ? sortedExpenses[0] : null,
    };
  }, [sortedExpenses]);

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
          <MonthDropdown />
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
          {/* Ciemny baner podsumowania miesiąca z dwoma przestronnymi kolumnami */}
          <div className={styles.summaryBanner}>
            <Row align="middle" gutter={[24, 24]}>
              <Col xs={24} md={15} lg={16} className={styles.summaryLeftCol}>
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
              </Col>

              <Col xs={24} md={9} lg={8} className={styles.summaryRightCol}>
                <Text strong className={styles.countCardMonth}>
                  {formattedMonth}
                </Text>
                <div className={styles.countCardNumber}>
                  {filteredExpenses.length}
                </div>
                <Paragraph className={styles.countCardText}>
                  {filteredExpenses.length === 1
                    ? 'zapisany wydatek'
                    : filteredExpenses.length >= 2 && filteredExpenses.length <= 4
                      ? 'zapisane wydatki'
                      : 'zapisanych wydatków'}
                </Paragraph>
                <Text className={styles.countCardDate}>
                  {selectedDate.getFullYear() === today.getFullYear() &&
                  selectedDate.getMonth() === today.getMonth()
                    ? `Stan na dzień ${dayOfMonth}`
                    : `Stan na koniec miesiąca`}
                </Text>
              </Col>
            </Row>
          </div>

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
                    <Row align="middle" justify="space-between" className={styles.categoryListHeader}>
                      <Col xs={12} sm={14}>
                        <Text className={styles.categoryListHeaderLabel}>KATEGORIA</Text>
                      </Col>
                      <Col xs={12} sm={10} style={{ textAlign: 'right' }}>
                        <Text className={styles.categoryListHeaderLabel}>
                          KWOTA / UDZIAŁ
                        </Text>
                      </Col>
                    </Row>

                    {categoryBreakdown.map((cat) => (
                      <Row
                        key={cat.name}
                        align="middle"
                        justify="space-between"
                        className={styles.categoryRow}
                      >
                        <Col xs={12} sm={14} className={styles.categoryName}>
                          <span
                            className={styles.categoryDot}
                            style={{ backgroundColor: cat.color }}
                          />
                          <Text>{cat.name}</Text>
                        </Col>
                        <Col
                          xs={12}
                          sm={10}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 20,
                          }}
                        >
                          <Text strong className={styles.categoryAmount}>
                            {formatPLN(cat.amount)} zł
                          </Text>
                          <Text className={styles.categoryPercent}>
                            {cat.percent}%
                          </Text>
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
                      {lastExpense.description || lastExpense.category?.name || 'Wydatek'}
                    </Title>
                    <Text className={styles.lastExpenseMeta}>
                      {lastExpense.category?.name} · {formatDatePL(lastExpense.date)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
                  <Text strong className={styles.lastExpenseAmount}>
                    {formatPLN(lastExpense.amount)} zł
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
      <AddExpenseButton fixed onClick={() => openModal()} />
    </>
  );
};

export default Dashboard;
