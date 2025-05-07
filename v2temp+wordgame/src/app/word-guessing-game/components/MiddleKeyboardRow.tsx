import KeyboardButton from "./KeyboardButton";

interface MiddleKeyboardRowProps {
  onLetterClick: (letter: string) => void;
  unusedLetters: string[];
  usedLetters: string[];
}

const MiddleKeyboardRow: React.FC<MiddleKeyboardRowProps> = ({ onLetterClick, unusedLetters, usedLetters }) => {
  const letters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];

  return (
    <div className="flex items-center justify-center m-1">
      {letters.map(letter => (
        <KeyboardButton 
          key={letter} 
          letter={letter} 
          buttonColor={
    unusedLetters.includes(letter) ? 1 :
    usedLetters.includes(letter) ? 2 :
  0
}
          onLetterClick={onLetterClick} 
        />
      ))}
    </div>
  );
};

export default MiddleKeyboardRow;