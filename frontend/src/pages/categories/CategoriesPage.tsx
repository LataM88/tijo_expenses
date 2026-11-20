import { useState, useMemo } from 'react';
import {
  DeleteOutlined,
  CheckOutlined,
  TagOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Row, Col, Typography, Spin, Empty, Popconfirm, Alert } from 'antd';
import { MonthDropdown } from '../../components/MonthDropdown/MonthDropdown';
import { useCategories, useCreateCategory, useDeleteCategory } from '../../hooks/useCategories';
import { useExpenses } from '../../hooks/useExpenses';
import { useDateFilterStore } from '../../store/useDateFilterStore';
import { formatPLN, formatExpenseCount } from '../../utils/formatters';
import styles from './CategoriesPage.module.css';

const { Title, Paragraph, Text } = Typography;

const PALETTE = [
  '#4f46e5', // Fiolet indygo
  '#8b5cf6', // Jasny fiolet
  '#10b981', // Morski / szmaragd
  '#02792dff', // Zielony
  '#f59e0b', // Żółty / bursztyn
  '#f97316', // Pomarańczowy
  '#e00025ff', // Czerwony
  '#0ea5e9', // Błękitny
  '#64748b', // Stalowy
  '#1d2533ff', // Ciemny granat
  '#1d648dff', // Ciemny turkusowy
];

export const CategoriesPage = () => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [formError, setFormError] = useState<string | null>(null);

  const { selectedDate } = useDateFilterStore();
  const { data: categories = [], isLoading, error } = useCategories();
  const { data: expenses = [] } = useExpenses();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  // Obliczenie statystyk dla każdej kategorii na podstawie wydatków z wybranego miesiąca
  const categoryStats = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const monthlyExpenses = expenses.filter((exp) => {
      if (!exp.date) return false;
      const [expY, expM] = exp.date.split('-').map(Number);
      return expY === y && expM === m + 1;
    });

    const stats: Record<number, { count: number; total: number }> = {};
    for (const exp of monthlyExpenses) {
      const catId = exp.category_id || exp.category?.id;
      if (catId) {
        if (!stats[catId]) {
          stats[catId] = { count: 0, total: 0 };
        }
        stats[catId].count += 1;
        stats[catId].total += Number(exp.amount) || 0;
      }
    }
    return stats;
  }, [expenses, selectedDate]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Podaj nazwę kategorii');
      return;
    }
    setFormError(null);
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        color: selectedColor,
      });
      setName('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nie udało się dodać kategorii';
      setFormError(msg);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nie udało się usunąć kategorii';
      alert(msg);
    }
  };

  return (
    <>
      {/* Header */}
      <Row justify="space-between" align="top" className={styles.header}>
        <Col xs={24} sm={16} className={styles.headerLeft}>
          <Text className={styles.headerLabel}>Twoje finanse</Text>
          <Title level={1} className={styles.headerTitle}>
            Kategorie
          </Title>
          <Paragraph className={styles.headerSubtitle}>
            Twój porządek w codziennych wydatkach.
          </Paragraph>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
          <MonthDropdown />
        </Col>
      </Row>

      {/* Karta "Nowa kategoria" z formularzem inline */}
      <div className={styles.newCategoryCard}>
        <Title level={3} className={styles.newCategoryTitle}>
          Nowa kategoria
        </Title>
        <Paragraph className={styles.newCategorySubtitle}>
          Nazwij ją i wybierz kolor, po którym od razu ją rozpoznasz.
        </Paragraph>

        {formError && (
          <Alert
            type="error"
            message={formError}
            showIcon
            closable
            style={{ marginBottom: 16 }}
            onClose={() => setFormError(null)}
          />
        )}

        <form onSubmit={handleAddCategory} className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.fieldLabel} htmlFor="category_name">
              Nazwa
            </label>
            <input
              id="category_name"
              type="text"
              placeholder="np. Podróże"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputName}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel}>Kolor</label>
            <div className={styles.colorSwatches}>
              {PALETTE.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorSwatch} ${
                      isSelected ? styles.colorSwatchActive : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {isSelected && <CheckOutlined style={{ fontSize: 11 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={createMutation.isPending}>
            <PlusOutlined /> {createMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
          </button>
        </form>
      </div>

      {/* Nagłówek sekcji "Twoje kategorie" */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleGroup}>
          <Title level={2} className={styles.sectionTitle}>
            Twoje kategorie
          </Title>
          <span className={styles.badgeCount}>{categories.length}</span>
        </div>
        <Text className={styles.sectionSubtitle}>Kolory pojawią się na wykresie i w historii.</Text>
      </div>

      {/* Siatka kart kategorii z Row i Col */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Pobieranie kategorii...</Text>
          </div>
        </div>
      ) : error ? (
        <Alert type="error" message={error.message} showIcon style={{ marginBottom: 24 }} />
      ) : categories.length === 0 ? (
        <Empty description="Brak zdefiniowanych kategorii. Dodaj pierwszą kategorię powyżej!" />
      ) : (
        <Row gutter={[16, 16]} className={styles.categoriesGrid}>
          {categories.map((cat) => {
            const stats = categoryStats[cat.id] || { count: 0, total: 0 };
            const countText = formatExpenseCount(stats.count);
            const totalText = `${formatPLN(stats.total)} zł`;

            return (
              <Col xs={24} sm={12} lg={8} key={cat.id}>
                <div className={styles.categoryCard}>
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.iconWrapper}
                      style={{
                        backgroundColor: `${cat.color}1a`, // ~10% przezroczystości
                        color: cat.color,
                      }}
                    >
                      <TagOutlined />
                    </div>
                    <Popconfirm
                      title="Usuń kategorię"
                      description="Czy na pewno chcesz usunąć tę kategorię?"
                      okText="Tak, usuń"
                      cancelText="Anuluj"
                      onConfirm={() => handleDeleteCategory(cat.id)}
                    >
                      <button
                        className={styles.deleteBtn}
                        title="Usuń kategorię"
                        disabled={deleteMutation.isPending}
                      >
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>

                  <Text strong className={styles.categoryName}>
                    {cat.name}
                  </Text>

                  <div className={styles.cardFooter}>
                    <Text className={styles.expenseCount}>{countText}</Text>
                    <Text strong className={styles.expenseSum}>
                      {totalText}
                    </Text>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Dolny baner informacyjny */}
      <div className={styles.infoBanner}>
        <InfoCircleOutlined className={styles.bannerIcon} />
        <div className={styles.bannerContent}>
          <span className={styles.bannerTitle}>Twój system, Twoje zasady.</span>
          <span className={styles.bannerText}>
            Własne kategorie pomogą Ci lepiej zrozumieć codzienne wydatki.
          </span>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
