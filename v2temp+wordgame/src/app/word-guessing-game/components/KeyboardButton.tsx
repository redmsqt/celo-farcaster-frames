interface KeyboardButtonProps {
    letter: string;
    onLetterClick: (letter: string) => void;
    buttonColor: number;
  }
  
  const KeyboardButton: React.FC<KeyboardButtonProps> = ({ letter, onLetterClick, buttonColor }) => {
    const handleClick = () => onLetterClick(letter);
  
    const colors = ["bg-neutral-500", "bg-neutral-800", "bg-yellow-600"];
  
    return (
      <div>
        <button className={`${colors[buttonColor]} w-8 h-12 rounded-md text-xl font-bold text-neutral-100 m-0.5 items-center`} onClick={handleClick}>
          {letter}
        </button>
      </div>
    );
  };
  
  export default KeyboardButton;