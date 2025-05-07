import React from 'react';

interface TopBarProps {
  setEndModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<TopBarProps> = ({ setEndModal }) => {

  const handleClick = () => {
    setEndModal(true);
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-10 bg-neutral-900 border-b-2 border-neutral-600 relative">
        <h1 className="text-2xl font-black text-center text-white font-serif absolute inset-x-0 top-1">Wordle</h1>
      </div>
    </div>
  );
};

export default TopBar;
