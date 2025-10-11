import React from 'react';

export default function HButton({ id, label, active, onClick }) {
  return (
    <div
      className={`h-button ${id} ${active ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {label}
    </div>
  );
}
