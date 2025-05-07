import KeyboardButton from "./KeyboardButton";
import KeyboardActionButton from "./KeyboardActionButton"

interface BottomKeyboardRowProps {
  onLetterClick: (letter: string) => void;
  onActionClick: (label: string) => void;
  unusedLetters: string[];
  usedLetters: string[];
}

const BottomKeyboardRow: React.FC<BottomKeyboardRowProps> = ({ onLetterClick, onActionClick, unusedLetters, usedLetters }) => {
  const letters = ["Z", "X", "C", "V", "B", "N", "M"];
  
  return (
    <div className="flex items-center justify-center m-1">
      <KeyboardActionButton label="ENTER" onActionClick={onActionClick} />
      
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

      <KeyboardActionButton label="◀" onActionClick={onActionClick} />
    </div>
  );
};

export default BottomKeyboardRow;