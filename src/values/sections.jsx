// Sidebar sections per role. Edit the lists to change navigation.
// Each item: { id, label }. `label` is read directly from `t`.

export const SECTIONS_BY_ROLE = {
  admin: [
    { id: 'users',        label: 'Пользователи' },
    { id: 'storages',     label: 'Склады' },
    { id: 'medications',  label: 'База лекарств' },
    { id: 'requests',     label: 'Запросы' },
    { id: 'reports',      label: 'Отчёты' },
  ],
  pharm: [
    { id: 'main-storage',  label: 'Основной склад' },
    { id: 'dept-storages', label: 'Склады отделений' },
    { id: 'requests',      label: 'Запросы' },
    { id: 'reports',       label: 'Отчёты' },
  ],
  nurse: [
    { id: 'main-storage',  label: 'Основной склад' },
    { id: 'dept-storages', label: 'Склады отделений' },
    { id: 'my-requests',   label: 'Мои запросы' },
  ],
};
