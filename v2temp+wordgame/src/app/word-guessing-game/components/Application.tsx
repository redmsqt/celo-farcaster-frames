"use client";

import React, { useState, useEffect, useCallback } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import Alert from "./Alert";
import TopBar from "./TopBar";
import GameOverModal from "./GameOverModal";
import dictionary from "./Dictionary.json";

const Application = () => {
  const [correctWord, setCorrectWord] = useState(() => {
    const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
    return randomWord.toUpperCase();
  });
  const gridAmount = 6 - 1;
  const letterCount = 4;
  const wordArray = correctWord.split("");
  
  const [letters, setLetters] = useState<string[]>([]);
  const [rowNum, setRowNum] = useState(0);
  const [color, setColor] = useState<number[]>(new Array(letterCount).fill(0));
  const [youWin, setYouWin] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [keyDown, setKeyDown] = useState("");
  const [unusedLetters, setUnusedLetters] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const updateLetters = (updateFn: (letters: string[]) => string[]) => {
    setLetters(letters => updateFn(letters));
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      const keyUpper = key.toUpperCase();
      setKeyDown(keyUpper);

      if (key === "Enter" && letters.length !== letterCount && !gameOver && !youWin) {
        setAlertValue("NOT ENOUGH LETTERS");
      }
      if (letters.length < letterCount && key.length === 1 && !gameOver && !youWin) {
        setLetters(letters => [...letters, keyUpper]); 
      } else if (key === "Enter" && letters.length === letterCount && !gameOver && !youWin) {
        processEnterKey();
      } else if (key === "Backspace" && letters.length > 0 && !gameOver && !youWin) {
        updateLetters(letters => letters.slice(0, letters.length - 1));
      }
    }

    if (!gameOver && !youWin) {
      window.addEventListener('keydown', handleKeyDown);
    }

    if (flipping) {
      timeout = setTimeout(() => {
        setFlipping(false);
      }, 1500);
    }

    if (playAgain) {
      setLetters([]);
      setRowNum(0);
      setColor(new Array(letterCount).fill(0));
      setYouWin(false);
      setGameOver(false);
      setFlipping(false);
      setEndModal(false);
      setPlayAgain(false);
      setKeyDown("");
      setUnusedLetters([]);
      setUsedLetters([]);
      
      // Select new random word
      const newWord = dictionary[Math.floor(Math.random() * dictionary.length)];
      setCorrectWord(newWord.toUpperCase());
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [letters, letters.length, gameOver, flipping, usedLetters, alertValue, playAgain]);

  const processEnterKey = useCallback(() => {
    let colors = new Array(letterCount).fill(0);
    let localWon = letters.every((letter, index) => letter === wordArray[index]);

    let wordLetterCount: { [key: string]: number } = {};
    let lettersCount: { [key: string]: number } = {};
    
    letters.forEach((letter, index) => {
        lettersCount[letter] = (lettersCount[letter] || 0) + 1;
    });
    wordArray.forEach(letter => {
        wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
    });
    
    letters.forEach((letter, index) => {
        if (letter === wordArray[index] && wordLetterCount[letter] > 0) {
            colors[index] = 2;
            lettersCount[letter]--;
            wordLetterCount[letter]--;
        }
    });
    
    letters.forEach((letter, index) => {
        if (colors[index] !== 2 && wordLetterCount[letter] > 0 && lettersCount[letter] > 0) {
            colors[index] = 1;
            lettersCount[letter]--;
            wordLetterCount[letter]--;
            setUsedLetters(usedLetters => [...usedLetters, letter]);
        } else if (!wordArray.includes(letter)) {
            setUnusedLetters(unusedLetters => [...unusedLetters, letter]);
        }
    });
    
    setColor(colors);
    setFlipping(true);

    if (localWon) {
      setYouWin(true);
      setTimeout(() => {
        setEndModal(true);
      }, 4000);
      
      if (rowNum === gridAmount) {
        setAlertValue("PHEW");
      }
      else if (rowNum < gridAmount && rowNum !== 0) {
        setAlertValue("GREAT JOB")
      }
      else if (rowNum < gridAmount && rowNum === 0) {
        setAlertValue("CHEATER!")
      }
    }
    
    if (rowNum === gridAmount) {
      if (!localWon) {
        setAlertValue(correctWord);
      }
      setGameOver(true);
      setTimeout(() => {
        setEndModal(true);
      }, 4000);
    }
    
    if (rowNum < gridAmount) {
        setLetters([]);
        setRowNum(rowNum + 1);
    } 
  }, [letters, rowNum, gridAmount, correctWord, wordArray, letterCount]);

  const handleLetterClick = (letter: string) => {
    if (letters.length < letterCount && !gameOver && !youWin) {
        updateLetters(letters => [...letters, letter]);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "◀" && !gameOver && !youWin) {
        updateLetters(letters => letters.slice(0, letters.length - 1));
    } else if (action === "ENTER" && !gameOver && !youWin) {
      if (letters.length === letterCount) {
        processEnterKey();
      }
      else {
        setAlertValue("NOT ENOUGH LETTERS");
      }
    }
  };

  return (
    <div>
      <TopBar setEndModal={setEndModal}/>
      <Grid 
        letters={letters} 
        rowNum={rowNum} 
        gridAmount={gridAmount} 
        letterCount={letterCount} 
        color={color} 
        gameOver={gameOver} 
        flipping={flipping} 
        playAgain={playAgain}
      />
      <Keyboard 
        onActionClick={handleActionClick} 
        onLetterClick={handleLetterClick} 
        unusedLetters={unusedLetters} 
        usedLetters={usedLetters} 
      />
      <Alert alertValue={alertValue} setAlertValue={setAlertValue} />
      <GameOverModal 
        on={endModal} 
        word={correctWord} 
        rowNum={rowNum} 
        playAgain={playAgain} 
        setPlayAgain={setPlayAgain} 
        setEndModal={setEndModal} 
        gameOver={gameOver} 
        gridAmount={gridAmount} 
        youWin={youWin}
      />
    </div>
  );
};

export default Application;