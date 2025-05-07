import KeyboardButton from "./KeyboardButton";

interface TopKeyboardRowProps {
  onLetterClick: (letter: string) => void;
  unusedLetters: string[];
  usedLetters: string[];
}

const TopKeyboardRow: React.FC<TopKeyboardRowProps> = ({ onLetterClick, unusedLetters, usedLetters }) => {
  const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  
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

export default TopKeyboardRow;