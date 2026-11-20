import { useState } from 'react';
import { Modal, Select, Alert } from 'antd';
import { PlusOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import { useExpenseModalStore } from '../../store/useExpenseModalStore';
import { useCategories } from '../../hooks/useCategories';
import { useCreateExpense } from '../../hooks/useExpenses';
import styles from './AddExpenseModal.module.css';

export const AddExpenseModal = () => {
  const { isOpen, closeModal } = useExpenseModalStore();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createExpenseMutation = useCreateExpense();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => {
    setAmount('');
    setCategoryId(undefined);
    setDescription('');
    setErrorMessage(null);
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Wprowadź prawidłową kwotę większą od zera');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Wybierz kategorię wydatku');
      return;
    }

    if (!date) {
      setErrorMessage('Wybierz datę wydatku');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      setErrorMessage('Data wydatku nie może być datą z przyszłości');
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        amount: numericAmount,
        category_id: categoryId,
        date: date,
        description: description.trim() || undefined,
      });
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nie udało się zapisać wydatku';
      setErrorMessage(msg);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closable={false}
      centered
      width={480}
      styles={{
        body: {
          borderRadius: 20,
          padding: 0,
        },
      }}
    >
      <div className={styles.modalContainer}>
        {/* Nagłówek okna */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBadge}>
              <PlusOutlined />
            </div>
            <div className={styles.headerTexts}>
              <span className={styles.title}>Dodaj wydatek</span>
              <span className={styles.subtitle}>
                Mały wpis. Pełny obraz Twoich finansów.
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            title="Zamknij"
          >
            <CloseOutlined />
          </button>
        </div>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            closable
            style={{ marginBottom: 16 }}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {/* Formularz */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Kwota */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="expense_amount">
              Kwota
            </label>
            <div className={styles.amountBox}>
              <input
                id="expense_amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.amountInput}
                autoFocus
              />
              <span className={styles.amountCurrency}>PLN</span>
            </div>
          </div>

          {/* Kategoria */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Kategoria</label>
            <Select
              placeholder="Wybierz kategorię"
              size="large"
              value={categoryId}
              onChange={(val) => setCategoryId(val)}
              loading={isLoadingCategories}
              style={{ width: '100%' }}
              options={categories.map((c) => ({
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: c.color,
                        display: 'inline-block',
                      }}
                    />
                    {c.name}
                  </div>
                ),
                value: c.id,
              }))}
            />
          </div>

          {/* Data */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="expense_date">
              Data
            </label>
            <div className={styles.dateBox}>
              <input
                id="expense_date"
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className={styles.dateInput}
              />
              <CalendarOutlined className={styles.calendarIcon} />
            </div>
          </div>

          {/* Opis */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="expense_desc">
              Opis <span className={styles.fieldLabelOptional}>opcjonalnie</span>
            </label>
            <textarea
              id="expense_desc"
              placeholder="Na co został przeznaczony wydatek?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>

          {/* Przyciski Akcji */}
          <div className={styles.footerButtons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={createExpenseMutation.isPending}
            >
              {createExpenseMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;
