import { useMemo } from 'react';
import {
  RightOutlined,
  LeftOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Row, Col, Typography, Spin, Empty, Popconfirm } from 'antd';
import { AddExpenseButton } from '../../components/AddExpenseButton/AddExpenseButton';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';
import { formatPLN, formatDatePL, formatMonthPL, formatExpenseCount } from '../../utils/formatters';
import type { Expense } from '../../types/types';
import styles from './HistoryPage.module.css';

const { Title, Paragraph, Text } = Typography;

export const HistoryPage = () => {
  const { data: expenses = [], isLoading, error } = useExpenses();
  const deleteMutation = useDeleteExpense();

  const formattedMonth = formatMonthPL();

  // Podsumowanie rzeczywistych wydatków
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (expense: Expense) => {
    console.log('Edycja wydatku:', expense);
  };

  return (
    <>
      {/* Header */}
      <Row justify="space-between" align="top" className={styles.header}>
        <Col xs={24} sm={16} className={styles.headerLeft}>
          <Text className={styles.headerLabel}>Twoje finanse</Text>
          <Title level={1} className={styles.headerTitle}>
            Historia wydatków
          </Title>
          <Paragraph className={styles.headerSubtitle}>
            Wszystkie Twoje wydatki, w jednym miejscu.
          </Paragraph>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
          <button className={styles.monthDropdown}>
            {formattedMonth} <RightOutlined />
          </button>
        </Col>
      </Row>

      {/* Kontrolki nawigacji i przycisk Dodaj */}
      <Row justify="space-between" align="middle" className={styles.controlsBar}>
        <Col>
          <div className={styles.controlsLeft}>
            <div className={styles.monthNavPill}>
              <button className={styles.monthNavBtn} title="Poprzedni miesiąc">
                <LeftOutlined />
              </button>
              <Text strong className={styles.currentMonthText}>
                {formattedMonth}
              </Text>
              <button className={styles.monthNavBtn} title="Następny miesiąc">
                <RightOutlined />
              </button>
            </div>
            <Text className={styles.expensesCountLabel}>
              {formatExpenseCount(expenses.length)}
            </Text>
          </div>
        </Col>

        <Col>
          <AddExpenseButton onClick={() => {}} />
        </Col>
      </Row>

      {/* Tabela wydatków z danymi z backendu */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Ładowanie historii wydatków...</Text>
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text type="danger">Wystąpił błąd: {error.message}</Text>
        </div>
      ) : expenses.length === 0 ? (
        <div className={styles.tableCard} style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Empty description="Brak zapisanych wydatków. Kliknij '+ Dodaj wydatek', aby dodać pierwszy!" />
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th} style={{ width: '15%' }}>
                    <Text className={styles.thLabel}>Data</Text>
                  </th>
                  <th className={styles.th} style={{ width: '20%' }}>
                    <Text className={styles.thLabel}>Kategoria</Text>
                  </th>
                  <th className={styles.th} style={{ width: '45%' }}>
                    <Text className={styles.thLabel}>Opis</Text>
                  </th>
                  <th
                    className={`${styles.th} ${styles.thAmount}`}
                    style={{ width: '20%' }}
                  >
                    <Text className={styles.thLabel}>Kwota</Text>
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {expenses.map((expense) => {
                  const categoryName = expense.category?.name || 'Inne';
                  const categoryColor = expense.category?.color || '#6b7280';

                  return (
                    <tr key={expense.id}>
                      <td className={`${styles.td} ${styles.tdDate}`}>
                        <Text type="secondary">{formatDatePL(expense.date)}</Text>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={styles.categoryPill}
                          style={{
                            backgroundColor: `${categoryColor}18`,
                            color: categoryColor,
                          }}
                        >
                          <span
                            className={styles.categoryDot}
                            style={{ backgroundColor: categoryColor }}
                          />
                          {categoryName}
                        </span>
                      </td>
                      <td className={`${styles.td} ${styles.tdDescription}`}>
                        <Text>{expense.description || '-'}</Text>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.tdAmountWrapper}>
                          <Text strong className={styles.amountText}>
                            {formatPLN(expense.amount)} zł
                          </Text>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionBtn} ${styles.editBtn}`}
                              title="Edytuj"
                              onClick={() => handleEdit(expense)}
                            >
                              <EditOutlined />
                            </button>
                            <Popconfirm
                              title="Usuń wydatek"
                              description="Czy na pewno chcesz usunąć ten wydatek?"
                              okText="Tak, usuń"
                              cancelText="Anuluj"
                              onConfirm={() => handleDelete(expense.id)}
                            >
                              <button
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                title="Usuń"
                                disabled={deleteMutation.isPending}
                              >
                                <DeleteOutlined />
                              </button>
                            </Popconfirm>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Podsumowanie w stopce tabeli */}
            <div className={styles.tableFooter}>
              <Text className={styles.footerTotalLabel}>
                Łącznie w wybranym okresie
              </Text>
              <Text strong className={styles.footerTotalAmount}>
                {formatPLN(totalAmount)} zł
              </Text>
            </div>
          </div>

          {/* Tekst pod tabelą */}
          <Row justify="space-between" align="middle" className={styles.pageFooterMeta}>
            <Col>
              <Text type="secondary">
                Pokazano {expenses.length} z {expenses.length} wydatków
              </Text>
            </Col>
            <Col>
              <Text type="secondary">
                Najedź na wiersz, aby edytować lub usunąć wydatek.
              </Text>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default HistoryPage;
