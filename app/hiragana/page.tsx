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

// --- Hiragana Data (Keep as is) ---
const hiraganaRows = {
  a: [
    { character: 'あ', romanji: 'a' }, { character: 'い', romanji: 'i' }, { character: 'う', romanji: 'u' }, { character: 'え', romanji: 'e' }, { character: 'お', romanji: 'o' },
  ],
  ka: [
    { character: 'か', romanji: 'ka' }, { character: 'き', romanji: 'ki' }, { character: 'く', romanji: 'ku' }, { character: 'け', romanji: 'ke' }, { character: 'こ', romanji: 'ko' },
  ],
  sa: [
    { character: 'さ', romanji: 'sa' }, { character: 'し', romanji: 'shi' }, { character: 'す', romanji: 'su' }, { character: 'せ', romanji: 'se' }, { character: 'そ', romanji: 'so' },
  ],
  ta: [
    { character: 'た', romanji: 'ta' }, { character: 'ち', romanji: 'chi' }, { character: 'つ', romanji: 'tsu' }, { character: 'て', romanji: 'te' }, { character: 'と', romanji: 'to' },
  ],
  na: [
    { character: 'な', romanji: 'na' }, { character: 'に', romanji: 'ni' }, { character: 'ぬ', romanji: 'nu' }, { character: 'ね', romanji: 'ne' }, { character: 'の', romanji: 'no' },
  ],
  ha: [
    { character: 'は', romanji: 'ha' }, { character: 'ひ', romanji: 'hi' }, { character: 'ふ', romanji: 'fu' }, { character: 'へ', romanji: 'he' }, { character: 'ほ', romanji: 'ho' },
  ],
  ma: [
    { character: 'ま', romanji: 'ma' }, { character: 'み', romanji: 'mi' }, { character: 'む', romanji: 'mu' }, { character: 'め', romanji: 'me' }, { character: 'も', romanji: 'mo' },
  ],
  ya: [
    { character: 'や', romanji: 'ya' }, { character: 'ゆ', romanji: 'yu' }, { character: 'よ', romanji: 'yo' },
  ],
  ra: [
    { character: 'ら', romanji: 'ra' }, { character: 'り', romanji: 'ri' }, { character: 'る', romanji: 'ru' }, { character: 'れ', romanji: 're' }, { character: 'ろ', romanji: 'ro' },
  ],
  wa: [
    { character: 'わ', romanji: 'wa' }, { character: 'を', romanji: 'wo' },
  ],
  special: [
    { character: 'ん', romanji: 'n' },
  ]
};

const mostFrequentWords: HiraganaCharacter[] = [
  { character: 'これ', romanji: 'kore' }, { character: 'それ', romanji: 'sore' }, { character: 'あれ', romanji: 'are' }, { character: 'です', romanji: 'desu' }, { character: 'ます', romanji: 'masu' }, { character: 'は', romanji: 'wa' }, { character: 'が', romanji: 'ga' }, { character: 'の', romanji: 'no' }, { character: 'に', romanji: 'ni' }, { character: 'を', romanji: 'wo' },
];
// --- End Hiragana Data ---


const HiraganaLearningPage = () => {
  const [name, setName] = useState<string>("");
  // Add "learning" state
  const [gameState, setGameState] = useState<"welcome" | "playing" | "learning" | "complete">("welcome");
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

  // --- State for Learning Mode ---
  const [learningSet, setLearningSet] = useState<HiraganaCharacter[]>([]);
  const [currentLearningIndex, setCurrentLearningIndex] = useState<number>(0);
  // --- End State for Learning Mode ---


  // Memoize total unique characters (Keep as is)
  const getTotalUniqueCharacters = React.useMemo(() => {
    return (characters: HiraganaCharacter[]) => {
      return new Set(characters.map(char => char.character)).size;
    };
  }, []);

  // Persist game state (Keep as is)
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setName(storedName);
    // Also load completed rows
    const storedCompleted = localStorage.getItem("completedRows");
    if (storedCompleted) {
        try {
            setCompletedRows(JSON.parse(storedCompleted));
        } catch (e) {
            console.error("Failed to parse completed rows from local storage", e);
            localStorage.removeItem("completedRows"); // Clear invalid data
        }
    }
  }, []);

  // Save completed rows to local storage when it changes
  useEffect(() => {
    if (completedRows.length > 0) {
        localStorage.setItem("completedRows", JSON.stringify(completedRows));
    }
    // Optional: Clear if empty to avoid storing empty array string
    // else {
    //     localStorage.removeItem("completedRows");
    // }
  }, [completedRows]);


  // Debug useEffect (Keep as is)
  useEffect(() => {
    // console.log("Correctly answered characters:", Array.from(correctlyAnsweredCharacters));
    // console.log("Remaining characters:", remainingCharacters.map(c => c.character));
    // console.log("Current Learning Index:", currentLearningIndex);
    // console.log("Learning Set:", learningSet.map(c => c.character));
  }, [correctlyAnsweredCharacters, remainingCharacters, currentLearningIndex, learningSet]);


  // --- Quiz Mode Initialization ---
  const initializeQuiz = (characters: HiraganaCharacter[], rowKey?: string) => {
    const uniqueCharacters = [...characters];
    const totalUnique = getTotalUniqueCharacters(uniqueCharacters);

    setRemainingCharacters(uniqueCharacters);
    setTotalQuestions(totalUnique);
    setScore(0);
    setGameState("playing"); // Set to playing for quiz
    setSelectedRowKey(rowKey || null);
    setCorrectlyAnsweredCharacters(new Set());
    setShowCorrectAnswer("");
    setCurrentCharacter(null); // Clear previous character

    setTimeout(() => {
      generateNewQuestion(uniqueCharacters);
    }, 100); // Short delay for state update
  };

  // --- Learning Mode Initialization ---
  const initializeLearning = (characters: HiraganaCharacter[], rowKey?: string) => {
     if (characters.length === 0) {
         console.warn("Attempted to start learning mode with an empty set.");
         return; // Don't start if the set is empty
     }
    setLearningSet([...characters]); // Use the full set, don't shuffle for learning
    setCurrentLearningIndex(0);
    setCurrentCharacter(characters[0]); // Show the first character
    setGameState("learning"); // Set to learning mode
    setSelectedRowKey(rowKey || null); // Keep track of the set being learned
    // Clear quiz-specific states
    setScore(0);
    setTotalQuestions(0);
    setRemainingCharacters([]);
    setCorrectlyAnsweredCharacters(new Set());
    setShowCorrectAnswer("");
    setAnswer("");
  };

  // --- Question Generation (Quiz Mode) ---
  const generateNewQuestion = (pool: HiraganaCharacter[]) => {
    if (pool.length === 0) {
      if (selectedRowKey && !completedRows.includes(selectedRowKey)) {
        setCompletedRows(prev => [...prev, selectedRowKey]);
      }
      setGameState("complete");
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedCharacter = pool[randomIndex];

    setCurrentCharacter(selectedCharacter);
    setAnswer("");
    setShowCorrectAnswer("");
  };

  // --- Event Handlers for Welcome Screen ---
  const handleSelectSet = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof hiraganaRows) => {
      let characters: HiraganaCharacter[] = [];
      let rowKeyStr: string | undefined = undefined;

      if (type === 'row' && key) {
          characters = hiraganaRows[key];
          rowKeyStr = key;
      } else if (type === 'all') {
          characters = Object.values(hiraganaRows).flat();
          rowKeyStr = 'all';
      } else if (type === 'frequent') {
          characters = mostFrequentWords;
          rowKeyStr = 'frequent';
      } else if (type === 'special') {
            characters = hiraganaRows.special; // Assuming 'special' is a key in hiraganaRows
            rowKeyStr = 'special';
      }

      if (!characters || characters.length === 0) {
          console.error("No characters found for selection:", type, key);
          return;
      }

      // Instead of directly starting, maybe show two buttons: Learn / Quiz
      // For simplicity now, we'll add separate handlers or modify these
      // Let's add separate handlers for now.
      console.log("Selected set for key:", rowKeyStr); // Debug log
      return { characters, key: rowKeyStr };
  };

  const startQuiz = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof hiraganaRows) => {
      const selection = handleSelectSet(type, key);
      if (selection) {
          initializeQuiz(selection.characters, selection.key);
      }
  }

  const startLearning = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof hiraganaRows) => {
      const selection = handleSelectSet(type, key);
       if (selection) {
          initializeLearning(selection.characters, selection.key);
      }
  }

  // --- Answer Submission (Quiz Mode) ---
  const handleAnswerSubmit = () => {
    if (!currentCharacter || gameState !== 'playing') return;

    const isCorrect = answer.trim().toLowerCase() === currentCharacter.romanji.toLowerCase();

    if (isCorrect) {
      const newCorrectlyAnswered = new Set(correctlyAnsweredCharacters).add(currentCharacter.character);
      setCorrectlyAnsweredCharacters(newCorrectlyAnswered);
      const newScore = newCorrectlyAnswered.size;
      setScore(newScore);

      const newRemaining = remainingCharacters.filter(
        char => char.character !== currentCharacter.character
      );
      setRemainingCharacters(newRemaining);

      setShowCorrectImage(true);
      setTimeout(() => setShowCorrectImage(false), 1000);

      setTimeout(() => {
        generateNewQuestion(newRemaining); // Pass the updated pool
      }, 1000); // Generate next question after feedback

    } else {
      setShowIncorrectImage(true);
      setShowCorrectAnswer(currentCharacter.romanji);

      setTimeout(() => {
        setShowIncorrectImage(false);
        // Keep the same character, but clear the input
         setAnswer("");
         // Optional: Shuffle and pick a new one from the current remaining pool if you don't want them to retry the same one immediately
         // generateNewQuestion(remainingCharacters);
      }, 2000); // Show correction for longer
    }
  };

  // --- Navigation Handlers (Learning Mode) ---
  const handleNextLearning = () => {
      if (!learningSet || learningSet.length === 0) return;
      const nextIndex = (currentLearningIndex + 1) % learningSet.length; // Loop back to start
      setCurrentLearningIndex(nextIndex);
      setCurrentCharacter(learningSet[nextIndex]);
  };

  const handlePreviousLearning = () => {
      if (!learningSet || learningSet.length === 0) return;
      const prevIndex = (currentLearningIndex - 1 + learningSet.length) % learningSet.length; // Loop back to end
      setCurrentLearningIndex(prevIndex);
      setCurrentCharacter(learningSet[prevIndex]);
  };


  // --- Other Handlers ---
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && answer && gameState === 'playing') handleAnswerSubmit();
  };

  const handleReset = () => {
    if (name) {
      localStorage.setItem("playerName", name);
    }
    setGameState("welcome");
    setSelectedRowKey(null);
    setRemainingCharacters([]);
    setCurrentCharacter(null);
    setAnswer("");
    setShowCorrectAnswer("");
    setScore(0);
    setTotalQuestions(0);
    // Reset learning state too
    setLearningSet([]);
    setCurrentLearningIndex(0);
  };


  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Header Image */}
      <div className="w-full max-w-2xl mb-6 z-10">
        <Image
          src="/hiragana.svg" // Make sure this path is correct in your /public folder
          alt="Hiragana Adventure"
          width={800}
          height={200}
          priority
          className="rounded-lg shadow-lg object-contain" // Use object-contain if aspect ratio is important
        />
      </div>

      {/* Feedback Images (Positioned more centrally, maybe slightly offset) */}
      <AnimatePresence>
        {showCorrectImage && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" // Center it
             initial={{ scale: 0.5, opacity: 0, y: 50 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.5, opacity: 0, y: -50 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample1.jpg" // Ensure path is correct
              alt="Correct answer"
              width={150}
              height={150}
              priority
              className="rounded-full shadow-2xl border-4 border-green-400" // Style update
            />
          </motion.div>
        )}
        {showIncorrectImage && (
          <motion.div
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" // Center it
             initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
             animate={{ scale: 1, opacity: 1, rotate: 0 }}
             exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample2.jpg" // Ensure path is correct
              alt="Incorrect answer"
              width={150}
              height={150}
              priority
              className="rounded-full shadow-2xl border-4 border-red-400" // Style update
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Card */}
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-xl z-10"> {/* Increased max-width */}
        <CardContent className="p-6 md:p-8">

          {/* --- Welcome State --- */}
          {gameState === "welcome" && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-indigo-600">Hiragana Adventure</h2>
              <p className="text-gray-500">Enter your name and choose a mode!</p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="text-center text-lg bg-white text-gray-700 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              />

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-gray-700">Select Hiragana Set</h3>
                {/* Grid for Rows */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(hiraganaRows) as Array<keyof typeof hiraganaRows>).map((row) => (
                    <div key={row} className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 self-start pl-1">{row.toUpperCase()} Row</span>
                       <div className="flex space-x-1">
                            <Button
                                onClick={() => startLearning('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                Learn
                            </Button>
                            <Button
                                onClick={() => startQuiz('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                className={`flex-1 text-indigo-600 border-indigo-300 hover:bg-indigo-50 ${completedRows.includes(row) ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700' : ''}`}
                                >
                                Quiz {completedRows.includes(row) ? '✓' : ''}
                            </Button>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Buttons for All / Frequent */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {/* All Hiragana */}
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 self-start pl-1">All Hiragana</span>
                       <div className="flex space-x-1">
                             <Button
                                onClick={() => startLearning('all')}
                                disabled={!name}
                                variant="outline"
                                className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                Learn All
                            </Button>
                            <Button
                                onClick={() => startQuiz('all')}
                                disabled={!name}
                                variant="outline"
                                className={`flex-1 text-indigo-600 border-indigo-300 hover:bg-indigo-50 ${completedRows.includes('all') ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700' : ''}`}
                                >
                                Quiz All {completedRows.includes('all') ? '✓' : ''}
                            </Button>
                       </div>
                    </div>

                     {/* Frequent Words */}
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 self-start pl-1">Frequent Words</span>
                       <div className="flex space-x-1">
                            <Button
                                onClick={() => startLearning('frequent')}
                                disabled={!name}
                                variant="outline"
                                className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                Learn Words
                            </Button>
                             <Button
                                onClick={() => startQuiz('frequent')}
                                disabled={!name}
                                variant="outline"
                                className={`flex-1 text-indigo-600 border-indigo-300 hover:bg-indigo-50 ${completedRows.includes('frequent') ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700' : ''}`}
                                >
                                Quiz Words {completedRows.includes('frequent') ? '✓' : ''}
                            </Button>
                       </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Playing State (Quiz Mode) --- */}
          {gameState === "playing" && currentCharacter && (
            <div className="text-center space-y-6">
               <div className="flex justify-between items-baseline">
                   <h2 className="text-2xl font-bold text-indigo-600">Quiz Time, {name}!</h2>
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">
                        Menu
                    </Button>
               </div>
              <div className="text-lg text-gray-600">Score: {score} / {totalQuestions}</div>
              {/* Progress Bar (Optional but nice) */}
               <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%` }}></div>
                </div>
              {/* <div className="text-sm text-gray-500">Characters remaining: {remainingCharacters.length}</div> */}

              <p className="text-7xl md:text-8xl font-bold text-gray-800 my-4 p-4 bg-indigo-50 rounded-lg">
                {currentCharacter.character}
              </p>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type the romanji"
                className="text-center text-2xl bg-white text-gray-700 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 mb-4"
                autoFocus
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
              />
              {showCorrectAnswer && (
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-red-600 font-semibold text-lg mb-4 p-2 bg-red-100 rounded" // Style update
                    >
                  Correct answer: {showCorrectAnswer}
                </motion.div>
              )}
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answer || showIncorrectImage || showCorrectImage} // Disable while feedback shows
                className="w-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                Check Answer
              </Button>
              {/* <Button onClick={handleReset} variant="link" className="text-gray-500 mt-2">
                 Return to Menu
               </Button> */}
            </div>
          )}

          {/* --- Learning State --- */}
          {gameState === "learning" && currentCharacter && (
              <div className="text-center space-y-6">
                 <div className="flex justify-between items-baseline">
                    <h2 className="text-2xl font-bold text-blue-600">Learning Mode</h2>
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">
                        Menu
                    </Button>
                </div>
                 <div className="text-gray-500">
                    Set: {selectedRowKey ? selectedRowKey.toUpperCase() : 'Unknown'} ({currentLearningIndex + 1} / {learningSet.length})
                 </div>

                <div className="p-8 bg-blue-50 rounded-lg shadow-inner">
                     <p className="text-7xl md:text-8xl font-bold text-gray-800 mb-2">
                        {currentCharacter.character}
                    </p>
                    <p className="text-3xl md:text-4xl font-semibold text-blue-700">
                        {currentCharacter.romanji}
                    </p>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                    <Button
                        onClick={handlePreviousLearning}
                        variant="outline"
                        className="text-lg text-blue-600 border-blue-400 hover:bg-blue-100"
                        size="lg"
                    >
                        &larr; Previous
                    </Button>
                     <Button
                        onClick={handleNextLearning}
                         variant="outline"
                        className="text-lg text-blue-600 border-blue-400 hover:bg-blue-100"
                        size="lg"
                    >
                        Next &rarr;
                    </Button>
                </div>
                 {/* <Button onClick={handleReset} variant="link" className="text-gray-500 mt-4">
                    Return to Menu
                </Button> */}
              </div>
          )}


          {/* --- Complete State --- */}
          {gameState === "complete" && (
            <div className="text-center space-y-6 py-8">
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl font-bold text-green-600"
              >
                🎉 Well Done, {name}! 🎉
              </motion.h2>
              <p className="text-xl text-gray-700">
                You completed the '{selectedRowKey?.toUpperCase()}' set!
              </p>
              {/* Display score only if it was a quiz */}
              {totalQuestions > 0 && (
                  <div className="text-lg text-gray-600 mb-6">
                  Final Score: {score} / {totalQuestions}
                  </div>
              )}

              <Button
                onClick={handleReset}
                className="text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                Return to Menu
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Optional: Add some subtle background shapes/elements */}
       <div className="absolute top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

    </div>
  );
};

export default HiraganaLearningPage;

// Add this to your globals.css or a style block if needed for animations
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
*/