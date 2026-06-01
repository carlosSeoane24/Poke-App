// src/components/MoveRow.jsx
import React, { useState, useEffect } from 'react';

const MoveRow = ({ moveData }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchMoveDetails = async () => {
      try {
        const response = await fetch(moveData.url);
        const data = await response.json();
        const nameEs = data.names.find(n => n.language.name === 'es')?.name || moveData.name;
        setDetails({
          name: nameEs,
          type: data.type.name,
          power: data.power || '—',
          pp: data.pp || '—',
        });
      } catch (e) { console.error(e); }
    };
    fetchMoveDetails();
  }, [moveData.url]);

  if (!details) return null;

  return (
    <tr className="move-row">
      <td className="move-name-cell">{details.name}</td>
      <td>
        <span className={`type-badge type-${details.type.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
          {details.type}
        </span>
      </td>
      <td className="move-stat">{details.power}</td>
      <td className="move-stat">{details.pp}</td>
    </tr>
  );
};

export default MoveRow;