import React from 'react';
import '../static/styles.css';
import Topbar from './topbar';
import { SECTIONS_BY_ROLE } from '../values/sections';

export default function MainScreen({ t, user, onLogout }) {
  const sections = SECTIONS_BY_ROLE[user.role] || [];
  const [activeId, setActiveId] = React.useState(sections[0] && sections[0].id);
  const active = sections.find(s => s.id === activeId) || sections[0];

  const fullName = [user.surname, user.name, user.lastname].filter(Boolean).join(' ');
  const initial = (user.name || user.surname || '?').charAt(0).toUpperCase();

  const showProfile = () => alert(`${fullName}\n${user.role}`);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Topbar t={t} />
        <nav className="sidebar-nav">
          {sections.map(s => (
            <button
              key={s.id}
              type="button"
              className={`nav-item ${active && active.id === s.id ? 'active' : ''}`}
              onClick={() => setActiveId(s.id)}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="user-chip" onClick={showProfile}>
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
          <div className="page-title">
            <h1>{active ? active.label : ''}</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="btn btn-ghost" onClick={onLogout}>{t.logout}</button>
          </div>
        </header>
        <div className="content">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.name}</th>
                  <th>{t.status}</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
