interface KeyboardActionButtonProps {
    label: string;
    onActionClick: (label: string) => void;
  }
  
  const KeyboardActionButton: React.FC<KeyboardActionButtonProps> = ({ label, onActionClick }) => {
    const handleClick = () => onActionClick(label);
  
    return (
      <div>
        <button className="bg-neutral-500 w-12 h-12 rounded-md text-xs font-bold text-neutral-100 m-0.5 items-center" onClick={handleClick}>
          { label }
        </button>
      </div>
    );
  };
  
  export default KeyboardActionButton;