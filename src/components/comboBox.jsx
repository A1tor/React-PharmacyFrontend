import React from 'react';
import { getAll } from '../api';

// Reusable typeahead. Loads items from GET /{entity}?name=<query>.
// The input itself is the search box; selected item id is emitted via onChange.
export default function ComboBox({ entity, value, onChange, t }) {
  const [open, setOpen]   = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [items, setItems] = React.useState([]);
  const ref = React.useRef(null);
  const resolved = React.useRef(false);

  // Resolve display name for a pre-set value (once).
  React.useEffect(() => {
    if (resolved.current || value == null) return;
    resolved.current = true;
    getAll(entity, { page: 0, size: 50 })
      .then(res => {
        const sel = (res.content || res || []).find(i => i.id === value);
        if (sel) setQuery(sel.name);
      })
      .catch(() => {});
  }, [value, entity]);

  // Search (debounced) while open.
  React.useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      getAll(entity, { name: query, page: 0, size: 20 })
        .then(res => setItems(res.content || res || []))
        .catch(() => setItems([]));
    }, 200);
    return () => clearTimeout(id);
  }, [entity, query, open]);

  // Close on outside click.
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const pick = (item) => {
    onChange(item.id);
    setQuery(item.name);
    setOpen(false);
  };

  return (
    <div className="combo" ref={ref}>
      <input
        type="text"
        className="combo-input"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        placeholder={t.search || ''}
      />
      <span className="combo-arrow" aria-hidden="true">▾</span>
      {open && (
        <ul className="combo-panel">
          {items.length === 0 && <li className="combo-empty">{t.noData}</li>}
          {items.map(item => (
            <li
              key={item.id}
              className={item.id === value ? 'active' : ''}
              onMouseDown={(e) => { e.preventDefault(); pick(item); }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
