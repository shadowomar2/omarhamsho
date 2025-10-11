import React from 'react';

export default function ContentCard({ title, text, onKnowMore }) {
  return (
    <div className="o-card">
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="know-more" onClick={onKnowMore}>Know more</button>
    </div>
  );
}
