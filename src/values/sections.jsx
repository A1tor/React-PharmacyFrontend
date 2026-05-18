// Sidebar sections per role. Edit the lists to change navigation.
// Labels resolve from `t.sections[id]` in languageConstants.

export const SECTIONS_BY_ROLE = {
  admin: ['users', 'storages', 'medications', 'requests', 'reports'],
  pharm: ['mainStorage', 'deptStorages', 'requests', 'reports'],
  nurse: ['mainStorage', 'deptStorages', 'myRequests'],
};
