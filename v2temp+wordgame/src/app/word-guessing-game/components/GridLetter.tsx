import React, { useState, useEffect } from 'react';

interface GridLetterProps {
  char: string;
  color: string;
  flipping: boolean;
  delay?: number;
}

const GridLetter: React.FC<GridLetterProps> = ({ char, color, flipping, delay = 0 }) => {
  const [localFlipping, setLocalFlipping] = useState(flipping);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLocalFlipping(flipping);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [flipping, delay]);

  const flippingClass = localFlipping ? 'flip' : '';

  return (
    <div className={`grid-letter ${flippingClass}`}>
      <div className={`border-2 border-neutral-600 w-14 h-14 flex items-center justify-center m-0.5 ${color}`}>
        <h4 className={`text-3xl text-center font-bold text-white`}>{char}</h4>
      </div>
    </div>
  );
};

export default GridLetter;