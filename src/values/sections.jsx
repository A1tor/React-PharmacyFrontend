// Sidebar sections per role. Edit the lists to change navigation.
// Labels resolve from `t.sections[id]` in languageConstants.

export const SECTIONS_BY_ROLE = {
  admin: ['users', 'storages', 'medications', 'requests', 'reports'],
  pharm: ['mainStorage', 'deptStorages', 'requests', 'reports'],
  nurse: ['mainStorage', 'deptStorages', 'myRequests'],
};

// Section -> backend entity name (used with getAll). Sections with no entity
// (e.g. 'reports') are intentionally absent.
export const SECTION_ENTITY = {
  users:        'user',
  storages:     'storage',
  medications:  'product',
  requests:     'request',
  mainStorage:  'storage',
  deptStorages: 'storage',
  myRequests:   'request',
};

// Columns per entity (id and image fields excluded). Used to render headers
// even when the request fails or returns zero rows.
export const ENTITY_FIELDS = {
  user:    ['username', 'name', 'surname', 'lastname', 'role', 'linkedStorageId'],
  storage: ['name', 'isPharmacyStorage'],
  product: ['name', 'description', 'isRequiredRecipe', 'manufacturer', 'countryName'],
  request: ['number', 'creatorName', 'handlerName', 'status', 'creationDate', 'productName', 'productCount'],
  country: ['name'],
};

// Available filter params per entity (matches *Filter DTOs in the backend).
export const ENTITY_FILTERS = {
  user:    ['username', 'name'],
  storage: ['name'],
  product: ['name', 'productType', 'countryOfOriginId', 'manufacturer'],
  request: ['creatorId', 'status', 'creationDateFrom', 'creationDateTo', 'productName'],
};
