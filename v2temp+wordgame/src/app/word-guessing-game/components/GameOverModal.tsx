import React, { useState, useEffect, useRef } from 'react';
import GOMWordReveal from "./GOMWordReveal";

interface GameOverModalProps {
  on: boolean;
  word: string;
  rowNum: number;
  playAgain: boolean;
  setPlayAgain: React.Dispatch<React.SetStateAction<boolean>>;
  setEndModal: React.Dispatch<React.SetStateAction<boolean>>;
  gameOver: boolean;
  youWin: boolean;
  gridAmount: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ on, word, rowNum, playAgain, setPlayAgain, setEndModal, gameOver, youWin, gridAmount }) => {
  const [visible, setVisible] = useState(false);
  const [guesslol, setGuess] = useState('')
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    if(timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setVisible(false);
    setEndModal(false);
  };

  const handleClick = () => {
    setPlayAgain(true);
  };

  useEffect(() => {
    if (rowNum == gridAmount && gameOver && !youWin) {
      setGuess(`Ran out of guesses!`);
    }
    if (rowNum == gridAmount && gameOver && youWin) {
      setGuess(`${rowNum+1} guesses!`);
    }
    else {
      if (rowNum == 1) {
        setGuess(`${rowNum} guess!`);
      }
      else {
        setGuess(`${rowNum} guesses!`);
      }
    }
    if (on) {
        timeoutId.current = setTimeout(() => {
          setVisible(true);
        }, 0);
      } else {
        handleClose();
      }
      return () => {
        if(timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }, [on]);

  if (!visible) {
    return null;
  }
  
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-60">
      </div>
        <div className="flex justify-center align-center fixed inset-0 top-12">
        <div className="w-80 h-96 bg-neutral-900 items-center justify-center rounded-md my-12">
          <button className="text-l text-white py-2 px-4 float-right" onClick={handleClose}>x</button>
          <div className="relative top-8">
          <GOMWordReveal word={word} />
          <p className="text-l text-white mx-8 my-6 font-bold">STATISTICS</p>
            <h2 className="text-2xl text-white mx-8 my-2">
              {guesslol}
            </h2>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mx-8 my-8" onClick={handleClick}>
              Play Again?
            </button>
            </div>
        </div>
     </div>
      </div>
    );
};

export default GameOverModal;