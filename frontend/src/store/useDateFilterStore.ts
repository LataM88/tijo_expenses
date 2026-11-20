import { create } from 'zustand';

interface DateFilterState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  prevMonth: () => void;
  nextMonth: () => void;
}

export const useDateFilterStore = create<DateFilterState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  prevMonth: () =>
    set((state) => ({
      selectedDate: new Date(
        state.selectedDate.getFullYear(),
        state.selectedDate.getMonth() - 1,
        1
      ),
    })),
  nextMonth: () =>
    set((state) => ({
      selectedDate: new Date(
        state.selectedDate.getFullYear(),
        state.selectedDate.getMonth() + 1,
        1
      ),
    })),
}));
