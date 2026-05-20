import React from 'react';
import ComboBox from './comboBox';

// Reusable popup with a flat list of fields and Cancel / Apply buttons.
// Labels resolve from t.fields. Per-field widget via the `config` map:
//   { combo: '<entity>' }  -> ComboBox
//   { type: '<html-type>' } -> <input type="...">
//   undefined              -> plain text input
export default function FormPopup({
  t, title, fields, initial, submitLabel, config = {}, onApply, onCancel,
}) {
  const [values, setValues] = React.useState(initial || {});
  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  const renderField = (k) => {
    const cfg = config[k] || {};
    if (cfg.combo) {
      return <ComboBox entity={cfg.combo} value={values[k]} onChange={v => set(k, v)} t={t} />;
    }
    return (
      <input
        id={`f-${k}`}
        type={cfg.type || 'text'}
        value={values[k] || ''}
        onChange={e => set(k, e.target.value)}
      />
    );
  };

  return (
    <div className="popup-scrim" onClick={onCancel}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {fields.map(k => (
          <div key={k} className="field">
            <label htmlFor={`f-${k}`}>{t.fields[k] || k}</label>
            {renderField(k)}
          </div>
        ))}
        <div className="popup-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>{t.cancel}</button>
          <button type="button" className="btn btn-primary" onClick={() => onApply(values)}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
