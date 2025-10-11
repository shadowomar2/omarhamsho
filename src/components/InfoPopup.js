import React from 'react';

export default function InfoPopup({ open, onClose, children }) {
  return (
    <div className={`info-popup ${open ? 'open' : ''}`} onClick={onClose} aria-hidden={!open}>
      <div className="info-inner" onClick={e => e.stopPropagation()}>
        <button className="info-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
