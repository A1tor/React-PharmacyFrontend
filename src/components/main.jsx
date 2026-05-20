import React from 'react';
import '../static/styles.css';
import Topbar from './topbar';
import { SECTIONS_BY_ROLE, SECTION_ENTITY, ENTITY_FIELDS, ENTITY_FILTERS, FIELD_CONFIG } from '../values/sections';
import { getAll, send } from '../api';
import FormPopup from './formPopup';

const PROFILE_FIELDS = ['name', 'surname', 'lastname', 'password'];
const PROFILE_CONFIG = { ...FIELD_CONFIG, password: { type: 'password' } };

const cell = (v, t) => {
  if (v == null) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return t.values[String(v)] || String(v);
};

export default function MainScreen({ t, user, onLogout }) {
  const sections = SECTIONS_BY_ROLE[user.role] || [];
  const [active, setActive] = React.useState(sections[0]);
  const label = (id) => t.sections[id] || id;

  const entity = SECTION_ENTITY[active];
  const [rows, setRows] = React.useState([]);
  const [status, setStatus] = React.useState('');   // '', 'loading', error message
  const [filters, setFilters] = React.useState({});
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const saveProfile = async (values) => {
    try {
      await send('user', 'PUT', { id: user.id, ...values });
      setProfileOpen(false);
    } catch (e) {
      alert(e.message || 'Ошибка');
    }
  };

  React.useEffect(() => { setFilters({}); }, [entity]);   // reset filters on section change

  React.useEffect(() => {
    if (!entity) { setRows([]); setStatus(''); return; }
    let alive = true;
    setStatus('loading');
    getAll(entity, { page: 0, size: 50, ...filters })
      .then(res => { if (alive) { setRows(res.content || res || []); setStatus(''); } })
      .catch(err => { if (alive) { setRows([]); setStatus(err.message || 'Ошибка'); } });
    return () => { alive = false; };
  }, [entity, filters]);

  const cols = ENTITY_FIELDS[entity] || [];
  const filterFields = ENTITY_FILTERS[entity] || [];

  const fullName = [user.surname, user.name, user.lastname].filter(Boolean).join(' ');
  const initial = (user.name || user.surname || '?').charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Topbar t={t} />
        <nav className="sidebar-nav">
          {sections.map(id => (
            <button
              key={id}
              type="button"
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => setActive(id)}
            >
              <span>{label(id)}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="user-chip" onClick={() => setProfileOpen(true)}>
            <div className="avatar" aria-hidden="true">{initial}</div>
            <div className="user-text">
              <div className="user-name">{fullName}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </button>
        </div>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="page-title"><h1>{active ? label(active) : ''}</h1></div>
          <div className="topbar-actions">
            <button type="button" className="btn btn-ghost" onClick={onLogout}>{t.logout}</button>
          </div>
        </header>

        <div className="content">
          {filterFields.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setFilterOpen(true)}>{t.filters}</button>
            </div>
          )}
          <br/>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>{cols.map(c => <th key={c}>{t.fields[c] || c}</th>)}</tr>
              </thead>
              <tbody>
                {status && (
                  <tr><td colSpan={Math.max(cols.length, 1)} style={{ textAlign: 'center', color: 'var(--ink-3)' }}>
                    {status === 'loading' ? t.loading : status}
                  </td></tr>
                )}
                {!status && rows.map((row, i) => (
                  <tr key={row.id ?? i}>{cols.map(c => <td key={c}>{cell(row[c], t)}</td>)}</tr>
                ))}
                {!status && !rows.length && (
                  <tr><td colSpan={Math.max(cols.length, 1)} style={{ textAlign: 'center', color: 'var(--ink-3)' }}>{t.noData}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filterOpen && (
        <FormPopup
          t={t}
          title={t.filters}
          fields={filterFields}
          initial={filters}
          config={FIELD_CONFIG}
          submitLabel={t.apply}
          onCancel={() => setFilterOpen(false)}
          onApply={(v) => { setFilters(v); setFilterOpen(false); }}
        />
      )}

      {profileOpen && (
        <FormPopup
          t={t}
          title={t.profile}
          fields={PROFILE_FIELDS}
          initial={{ name: user.name, surname: user.surname, lastname: user.lastname }}
          config={PROFILE_CONFIG}
          submitLabel={t.save}
          onCancel={() => setProfileOpen(false)}
          onApply={saveProfile}
        />
      )}
    </div>
  );
}
