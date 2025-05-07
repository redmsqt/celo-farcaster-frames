interface GOMWordRevealProps {
    word: string;
  }
  
  const GOMWordReveal:React.FC<GOMWordRevealProps> = ( {word} ) => {
    return (
      <div>
      <p className="text-xl text-white mx-8 my-2">The word was</p>
            <h2 className="text-5xl text-white mx-8 font-bold">{word.toUpperCase()}</h2>
      </div>
    );
  };
  
  export default GOMWordReveal;