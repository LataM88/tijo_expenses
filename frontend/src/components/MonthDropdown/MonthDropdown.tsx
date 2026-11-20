import { Dropdown, type MenuProps } from 'antd';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useDateFilterStore } from '../../store/useDateFilterStore';
import { formatMonthPL } from '../../utils/formatters';
import styles from './MonthDropdown.module.css';

export const MonthDropdown = () => {
  const { selectedDate, setSelectedDate } = useDateFilterStore();
  const formattedMonth = formatMonthPL(selectedDate);

  const base = new Date();
  const menuItems: MenuProps['items'] = [];

  // Ostatnie 11 miesięcy + bieżący + 2 przyszłe
  for (let i = -11; i <= 2; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    const label = formatMonthPL(d);
    const isSelected =
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth();

    menuItems.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: 160,
            padding: '4px 0',
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? 'var(--color-primary)' : 'inherit',
          }}
        >
          <span>{label}</span>
          {isSelected && <CheckOutlined style={{ fontSize: 12 }} />}
        </div>
      ),
      onClick: () => setSelectedDate(d),
    });
  }

  return (
    <Dropdown
      menu={{ items: menuItems, style: { maxHeight: 320, overflowY: 'auto' } }}
      trigger={['click']}
      placement="bottomRight"
    >
      <button className={styles.monthSelector} type="button">
        {formattedMonth} <RightOutlined style={{ fontSize: 11 }} />
      </button>
    </Dropdown>
  );
};

export default MonthDropdown;
