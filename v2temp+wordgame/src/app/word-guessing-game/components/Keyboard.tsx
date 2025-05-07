import { useState } from "react";
import TopKeyboardRow from "./TopKeyboardRow";
import MiddleKeyboardRow from "./MiddleKeyboardRow";
import BottomKeyboardRow from "./BottomKeyboardRow";

interface KeyboardProps {
  onLetterClick: (letter: string) => void;
  onActionClick: (letter: string) => void;
  unusedLetters: string[];
  usedLetters: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ onLetterClick, onActionClick, unusedLetters, usedLetters }) => {
  return (
    <div>
      <TopKeyboardRow onLetterClick={onLetterClick} unusedLetters={unusedLetters} usedLetters={usedLetters}  />
      <MiddleKeyboardRow onLetterClick={onLetterClick} unusedLetters={unusedLetters} usedLetters={usedLetters}  />
      <BottomKeyboardRow onActionClick={onActionClick} onLetterClick={onLetterClick} unusedLetters={unusedLetters} usedLetters={usedLetters}  />
    </div>
  );
};

export default Keyboard;
