import { useEffect } from 'react';

import GridLetter from "./GridLetter";

interface GridRowProps {
  word: string;
  id: number;
  letterCount: number;
  colorClass: number[];
  flipping: boolean;
}

const GridRow: React.FC<GridRowProps> = ({ word, letterCount, colorClass = [], flipping }) => {
  const colors = ["", "bg-yellow-500", "bg-lime-500"];
  return (
  <div className="flex items-center justify-center m-0.25">
    {[...Array(letterCount)].map((_, i) => (
      <GridLetter 
        key={i}
        char={word[i]} 
        color={colors[colorClass[i] || 0]}
        flipping={flipping} 
        delay={i * 200} 
      />
    ))}
  </div>
);
};

export default GridRow;