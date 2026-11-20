/**
 * Narzędzia formatowania walut, dat i odmian językowych
 */

/**
 * Formatuje liczbę do formatu walutowego PLN, np. "1 800,00"
 */
export const formatPLN = (amount: number | string): string => {
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (isNaN(num)) return '0,00';
  return num.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formatuje datę 'YYYY-MM-DD' do skróconego formatu polskiego, np. "13 lis 2026"
 */
export const formatDatePL = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Zwraca sformatowaną nazwę bieżącego lub wskazanego miesiąca, np. "Listopad 2026"
 */
export const formatMonthPL = (date: Date = new Date()): string => {
  const str = date.toLocaleString('pl-PL', {
    month: 'long',
    year: 'numeric',
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Poprawna odmiana słowa "wydatek" w języku polskim
 * 1 wydatek, 2-4 wydatki, 5+ wydatków
 */
export const formatExpenseCount = (count: number): string => {
  if (count === 1) return '1 wydatek';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} wydatki`;
  }
  return `${count} wydatków`;
};
