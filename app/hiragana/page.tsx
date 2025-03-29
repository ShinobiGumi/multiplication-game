// app/hiragana/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HiraganaCharacter {
  character: string;
  romanji: string;
}

const hiraganaRows = {
  a: [
    { character: 'あ', romanji: 'a' },
    { character: 'い', romanji: 'i' },
    { character: 'う', romanji: 'u' },
    { character: 'え', romanji: 'e' },
    { character: 'お', romanji: 'o' },
  ],
  ka: [
    { character: 'か', romanji: 'ka' },
    { character: 'き', romanji: 'ki' },
    { character: 'く', romanji: 'ku' },
    { character: 'け', romanji: 'ke' },
    { character: 'こ', romanji: 'ko' },
  ],
  sa: [
    { character: 'さ', romanji: 'sa' },
    { character: 'し', romanji: 'shi' },
    { character: 'す', romanji: 'su' },
    { character: 'せ', romanji: 'se' },
    { character: 'そ', romanji: 'so' },
  ],
  ta: [
    { character: 'た', romanji: 'ta' },
    { character: 'ち', romanji: 'chi' },
    { character: 'つ', romanji: 'tsu' },
    { character: 'て', romanji: 'te' },
    { character: 'と', romanji: 'to' },
  ],
  na: [
    { character: 'な', romanji: 'na' },
    { character: 'に', romanji: 'ni' },
    { character: 'ぬ', romanji: 'nu' },
    { character: 'ね', romanji: 'ne' },
    { character: 'の', romanji: 'no' },
  ],
  ha: [
    { character: 'は', romanji: 'ha' },
    { character: 'ひ', romanji: 'hi' },
    { character: 'ふ', romanji: 'fu' },
    { character: 'へ', romanji: 'he' },
    { character: 'ほ', romanji: 'ho' },
  ],
  ma: [
    { character: 'ま', romanji: 'ma' },
    { character: 'み', romanji: 'mi' },
    { character: 'む', romanji: 'mu' },
    { character: 'め', romanji: 'me' },
    { character: 'も', romanji: 'mo' },
  ],
  ya: [
    { character: 'や', romanji: 'ya' },
    { character: 'ゆ', romanji: 'yu' },
    { character: 'よ', romanji: 'yo' },
  ],
  ra: [
    { character: 'ら', romanji: 'ra' },
    { character: 'り', romanji: 'ri' },
    { character: 'る', romanji: 'ru' },
    { character: 'れ', romanji: 're' },
    { character: 'ろ', romanji: 'ro' },
  ],
  wa: [
    { character: 'わ', romanji: 'wa' },
    { character: 'を', romanji: 'wo' },
  ],
  special: [
    { character: 'ん', romanji: 'n' },
  ]
};

const mostFrequentWords: HiraganaCharacter[] = [
  { character: 'これ', romanji: 'kore' },
  { character: 'それ', romanji: 'sore' },
  { character: 'あれ', romanji: 'are' },
  { character: 'です', romanji: 'desu' },
  { character: 'ます', romanji: 'masu' },
  { character: 'は', romanji: 'wa' },
  { character: 'が', romanji: 'ga' },
  { character: 'の', romanji: 'no' },
  { character: 'に', romanji: 'ni' },
  { character: 'を', romanji: 'wo' },
];

const HiraganaLearningPage = () => {
  const [name, setName] = useState<string>("");
  const [gameState, setGameState] = useState<"welcome" | "playing" | "complete">("welcome");
  const [currentCharacter, setCurrentCharacter] = useState<HiraganaCharacter | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctlyAnsweredCharacters, setCorrectlyAnsweredCharacters] = useState<Set<string>>(new Set());
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showIncorrectImage, setShowIncorrectImage] = useState<boolean>(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<string>("");
  const [completedRows, setCompletedRows] = useState<string[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [remainingCharacters, setRemainingCharacters] = useState<HiraganaCharacter[]>([]);

  // Memoize total unique characters to ensure consistent scoring
  const getTotalUniqueCharacters = React.useMemo(() => {
    return (characters: HiraganaCharacter[]) => {
      return new Set(characters.map(char => char.character)).size;
    };
  }, []);

  // Persist game state in local storage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setName(storedName);
  }, []);

  // Debug useEffect to log state changes
  useEffect(() => {
    console.log("Correctly answered characters:", Array.from(correctlyAnsweredCharacters));
    console.log("Remaining characters:", remainingCharacters.map(c => c.character));
  }, [correctlyAnsweredCharacters, remainingCharacters]);

  const initializeQuestions = (characters: HiraganaCharacter[], rowKey?: string) => {
    // Create a copy of the characters for the question pool
    const uniqueCharacters = [...characters];
    
    // Set total unique characters for accurate scoring
    const totalUnique = getTotalUniqueCharacters(uniqueCharacters);
    
    setRemainingCharacters(uniqueCharacters);
    setTotalQuestions(totalUnique);
    setScore(0);
    setGameState("playing");
    setSelectedRowKey(rowKey || null);
    setCorrectlyAnsweredCharacters(new Set());
    setShowCorrectAnswer("");
    setCurrentCharacter(null);

    // Generate first question after a short delay to ensure state is updated
    setTimeout(() => {
      generateNewQuestion(uniqueCharacters);
    }, 100);
  };

  const generateNewQuestion = (initialPool?: HiraganaCharacter[]) => {
    // Use the provided initial pool or the current remaining characters
    const pool = initialPool || remainingCharacters;
    
    // Check if all characters have been correctly answered
    if (pool.length === 0) {
      if (selectedRowKey && !completedRows.includes(selectedRowKey)) {
        setCompletedRows(prev => [...prev, selectedRowKey]);
      }
      setGameState("complete");
      return;
    }

    // Select a random character from the pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedCharacter = pool[randomIndex];
    
    setCurrentCharacter(selectedCharacter);
    setAnswer("");
    setShowCorrectAnswer("");
  };

  const handleRowSelection = (row: keyof typeof hiraganaRows) => {
    initializeQuestions(hiraganaRows[row], row);
  };

  const handleAllHiraganaSelection = () => {
    const allCharacters = Object.values(hiraganaRows).flat();
    initializeQuestions(allCharacters, 'all');
  };

  const handleFrequentWordsSelection = () => {
    initializeQuestions(mostFrequentWords, 'frequent');
  };

  const handleAnswerSubmit = () => {
    if (!currentCharacter) return;

    const isCorrect = answer.toLowerCase() === currentCharacter.romanji;

    if (isCorrect) {
      // Update the correctlyAnsweredCharacters set
      const newCorrectlyAnswered = new Set(correctlyAnsweredCharacters);
      newCorrectlyAnswered.add(currentCharacter.character);
      setCorrectlyAnsweredCharacters(newCorrectlyAnswered);
      
      // Update score
      const newScore = newCorrectlyAnswered.size;
      setScore(newScore);
      
      // Remove the answered character from the remaining pool
      const newRemaining = remainingCharacters.filter(
        char => char.character !== currentCharacter.character
      );
      setRemainingCharacters(newRemaining);

      // Show success feedback
      setShowCorrectImage(true);
      setTimeout(() => setShowCorrectImage(false), 1000);
      
      // Generate a new question after feedback
      setTimeout(() => {
        generateNewQuestion(newRemaining);
      }, 1000);
    } else {
      // Show incorrect feedback
      setShowIncorrectImage(true);
      setShowCorrectAnswer(currentCharacter.romanji);
      
      setTimeout(() => {
        setShowIncorrectImage(false);
        // We don't update the remaining pool for incorrect answers
        setAnswer("");
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && answer) handleAnswerSubmit();
  };

  const handleReset = () => {
    // Save player name to local storage before resetting
    if (name) {
      localStorage.setItem("playerName", name);
    }
    
    setGameState("welcome");
    setSelectedRowKey(null);
    setRemainingCharacters([]);
    setCurrentCharacter(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100 relative">
      <div className="w-full max-w-2xl mb-6">
        <Image 
          src="/hiragana.svg" 
          alt="Hiragana Adventure" 
          width={800} 
          height={200} 
          priority 
          className="rounded-lg shadow-lg" 
        />
      </div>

      {/* Feedback images */}
      <AnimatePresence>
        {showCorrectImage && (
          <motion.div
            className="absolute left-[30%] top-1/2 z-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src="/sample1.jpg" 
              alt="Correct answer" 
              width={150} 
              height={150} 
              priority 
              className="rounded-lg shadow-lg" 
            />
          </motion.div>
        )}
        {showIncorrectImage && (
          <motion.div
            className="absolute left-[30%] top-1/2 z-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src="/sample2.jpg" 
              alt="Incorrect answer" 
              width={150} 
              height={150} 
              priority 
              className="rounded-lg shadow-lg" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-xl">
        <CardContent className="p-6">
          {gameState === "welcome" ? (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-400">Hiragana Adventure</h2>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your Name" 
                className="text-center text-lg bg-white text-gray-400" 
              />
              
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(hiraganaRows) as Array<keyof typeof hiraganaRows>).map((row) => (
                  <Button 
                    key={row}
                    onClick={() => handleRowSelection(row)} 
                    disabled={!name}
                    className={`text-gray-400 font-bold ${completedRows.includes(row) ? 'bg-green-100' : ''}`}
                  >
                    {row.toUpperCase()} Row {completedRows.includes(row) ? '✓' : ''}
                  </Button>
                ))}
                <Button 
                  onClick={handleAllHiraganaSelection} 
                  disabled={!name}
                  className={`text-gray-400 font-bold col-span-2 ${completedRows.includes('all') ? 'bg-green-100' : ''}`}
                >
                  All Hiragana {completedRows.includes('all') ? '✓' : ''}
                </Button>
                <Button 
                  onClick={handleFrequentWordsSelection} 
                  disabled={!name}
                  className={`text-gray-400 font-bold col-span-1 ${completedRows.includes('frequent') ? 'bg-green-100' : ''}`}
                >
                  Frequent Words {completedRows.includes('frequent') ? '✓' : ''}
                </Button>
              </div>
            </div>
          ) : gameState === "playing" ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-400">Hi {name}!</h2>
              <div className="text-lg text-gray-400">Score: {score}/{totalQuestions}</div>
              <div className="text-sm text-gray-400">Characters remaining: {remainingCharacters.length}</div>

              {currentCharacter && (
                <>
                  <p className="text-6xl font-bold text-gray-400 mb-4">
                    {currentCharacter.character}
                  </p>
                  <Input 
                    type="text" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    onKeyDown={handleKeyPress} 
                    placeholder="Type the romanji"
                    className="text-center text-2xl bg-white text-gray-400 mb-4" 
                    autoFocus 
                  />
                  {showCorrectAnswer && (
                    <div className="text-blue-500 font-bold mb-4">
                      Correct answer: {showCorrectAnswer}
                    </div>
                  )}
                  <Button 
                    onClick={handleAnswerSubmit} 
                    disabled={!answer} 
                    className="text-1xl font-bold text-gray-400 mr-2"
                  >
                    Check Answer
                  </Button>
                  <Button 
                    onClick={handleReset} 
                    className="text-1xl font-bold text-gray-400"
                  >
                    Return to Menu
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-green-500">
                🎉 Well Done, {name}! 🎉
              </h2>
              <div className="text-lg text-gray-400 mb-4">
                Final Score: {score}/{totalQuestions}
              </div>
              <Button 
                onClick={handleReset} 
                className="text-1xl font-bold text-gray-400"
              >
                Return to Menu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HiraganaLearningPage;