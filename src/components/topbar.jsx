import React from 'react';

export default function Topbar({ t }) {
  return (
    <header className="login-topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="22" height="22">
            <rect x="3" y="3" width="26" height="26" rx="6" fill="currentColor" opacity="0.12"/>
            <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="brand-text">
          <div className="brand-name">{t.appName}</div>
          <div className="brand-hint">{t.appHint}</div>
        </div>
      </div>
    </header>
  );
}
