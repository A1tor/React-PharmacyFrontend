import React from 'react';

// Reusable popup with a flat list of input fields and Cancel / Apply buttons.
// Labels resolve from t.fields. Per-field input type via the `types` map.
export default function FormPopup({
  t, title, fields, initial, submitLabel, types = {}, onApply, onCancel,
}) {
  const [values, setValues] = React.useState(initial || {});
  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  return (
    <div className="popup-scrim" onClick={onCancel}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {fields.map(k => (
          <div key={k} className="field">
            <label htmlFor={`f-${k}`}>{t.fields[k] || k}</label>
            <input
              id={`f-${k}`}
              type={types[k] || 'text'}
              value={values[k] || ''}
              onChange={e => set(k, e.target.value)}
            />
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
