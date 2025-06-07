// app/katakana/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface KatakanaCharacter {
  character: string;
  romaji: string;
}

// --- Katakana Data ---
const katakanaRows = {
  a: [
    { character: 'ア', romaji: 'a' }, { character: 'イ', romaji: 'i' }, { character: 'ウ', romaji: 'u' }, { character: 'エ', romaji: 'e' }, { character: 'オ', romaji: 'o' },
  ],
  ka: [
    { character: 'カ', romaji: 'ka' }, { character: 'キ', romaji: 'ki' }, { character: 'ク', romaji: 'ku' }, { character: 'ケ', romaji: 'ke' }, { character: 'コ', romaji: 'ko' },
  ],
  sa: [
    { character: 'サ', romaji: 'sa' }, { character: 'シ', romaji: 'shi' }, { character: 'ス', romaji: 'su' }, { character: 'セ', romaji: 'se' }, { character: 'ソ', romaji: 'so' },
  ],
  ta: [
    { character: 'タ', romaji: 'ta' }, { character: 'チ', romaji: 'chi' }, { character: 'ツ', romaji: 'tsu' }, { character: 'テ', romaji: 'te' }, { character: 'ト', romaji: 'to' },
  ],
  na: [
    { character: 'ナ', romaji: 'na' }, { character: 'ニ', romaji: 'ni' }, { character: 'ヌ', romaji: 'nu' }, { character: 'ネ', romaji: 'ne' }, { character: 'ノ', romaji: 'no' },
  ],
  ha: [
    { character: 'ハ', romaji: 'ha' }, { character: 'ヒ', romaji: 'hi' }, { character: 'フ', romaji: 'fu' }, { character: 'ヘ', romaji: 'he' }, { character: 'ホ', romaji: 'ho' },
  ],
  ma: [
    { character: 'マ', romaji: 'ma' }, { character: 'ミ', romaji: 'mi' }, { character: 'ム', romaji: 'mu' }, { character: 'メ', romaji: 'me' }, { character: 'モ', romaji: 'mo' },
  ],
  ya: [
    { character: 'ヤ', romaji: 'ya' }, { character: 'ユ', romaji: 'yu' }, { character: 'ヨ', romaji: 'yo' },
  ],
  ra: [
    { character: 'ラ', romaji: 'ra' }, { character: 'リ', romaji: 'ri' }, { character: 'ル', romaji: 'ru' }, { character: 'レ', romaji: 're' }, { character: 'ロ', romaji: 'ro' },
  ],
  wa: [
    { character: 'ワ', romaji: 'wa' }, { character: 'ヲ', romaji: 'wo' },
  ],
  special: [
    { character: 'ン', romaji: 'n' },
  ]
};

const mostFrequentWords: KatakanaCharacter[] = [
  { character: 'コーヒー', romaji: 'koohii' }, 
  { character: 'テレビ', romaji: 'terebi' }, 
  { character: 'コンピューター', romaji: 'konpyuutaa' }, 
  { character: 'インターネット', romaji: 'intaanetto' }, 
  { character: 'レストラン', romaji: 'resutoran' }, 
  { character: 'ホテル', romaji: 'hoteru' }, 
  { character: 'バス', romaji: 'basu' }, 
  { character: 'タクシー', romaji: 'takushii' }, 
  { character: 'スーパー', romaji: 'suupaa' }, 
  { character: 'デパート', romaji: 'depaato' },
  { character: 'アメリカ', romaji: 'amerika' }, 
  { character: 'イギリス', romaji: 'igirisu' }, 
  { character: 'フランス', romaji: 'furansu' }, 
  { character: 'ドイツ', romaji: 'doitsu' }, 
  { character: 'カナダ', romaji: 'kanada' },
  { character: 'ピザ', romaji: 'piza' }, 
  { character: 'ハンバーガー', romaji: 'hanbaagaa' }, 
  { character: 'サラダ', romaji: 'sarada' }, 
  { character: 'アイスクリーム', romaji: 'aisukuriimu' }, 
  { character: 'チョコレート', romaji: 'chokoreeto' },
  { character: 'スポーツ', romaji: 'supootsu' }, 
  { character: 'サッカー', romaji: 'sakkaa' }, 
  { character: 'テニス', romaji: 'tenisu' }, 
  { character: 'バスケットボール', romaji: 'basukettobooru' }, 
  { character: 'ゲーム', romaji: 'geemu' },
  { character: 'カメラ', romaji: 'kamera' }, 
  { character: 'コップ', romaji: 'koppu' }, 
  { character: 'ナイフ', romaji: 'naifu' }, 
  { character: 'フォーク', romaji: 'fooku' }, 
  { character: 'スプーン', romaji: 'supuun' }
];
// --- End Katakana Data ---

const KatakanaLearningPage = () => {
  const [name, setName] = useState<string>("");
  const [gameState, setGameState] = useState<"welcome" | "playing" | "learning" | "complete">("welcome");
  const [currentCharacter, setCurrentCharacter] = useState<KatakanaCharacter | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctlyAnsweredCharacters, setCorrectlyAnsweredCharacters] = useState<Set<string>>(new Set());
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showIncorrectImage, setShowIncorrectImage] = useState<boolean>(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<string>("");
  const [completedRows, setCompletedRows] = useState<string[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [remainingCharacters, setRemainingCharacters] = useState<KatakanaCharacter[]>([]);

  // --- State for Learning Mode ---
  const [learningSet, setLearningSet] = useState<KatakanaCharacter[]>([]);
  const [currentLearningIndex, setCurrentLearningIndex] = useState<number>(0);
  
  // Add input ref for focus management
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize total unique characters
  const getTotalUniqueCharacters = React.useMemo(() => {
    return (characters: KatakanaCharacter[]) => {
      return new Set(characters.map(char => char.character)).size;
    };
  }, []);

  // Persist/Load game state
  useEffect(() => {
    const storedName = localStorage.getItem("katakanaPlayerName");
    if (storedName) setName(storedName);
    const storedCompleted = localStorage.getItem("katakanaCompletedRows");
    if (storedCompleted) {
        try {
            setCompletedRows(JSON.parse(storedCompleted));
        } catch (e) {
            console.error("Failed to parse completed rows from local storage", e);
            localStorage.removeItem("katakanaCompletedRows");
        }
    }
  }, []);

  // Save completed rows
  useEffect(() => {
    if (completedRows.length > 0) {
        localStorage.setItem("katakanaCompletedRows", JSON.stringify(completedRows));
    }
  }, [completedRows]);

  // --- Quiz Mode Initialization ---
  const initializeQuiz = (characters: KatakanaCharacter[], rowKey?: string) => {
    const uniqueCharacters = [...characters];
    const totalUnique = getTotalUniqueCharacters(uniqueCharacters);

    setRemainingCharacters(uniqueCharacters);
    setTotalQuestions(totalUnique);
    setScore(0);
    setGameState("playing");
    setSelectedRowKey(rowKey || null);
    setCorrectlyAnsweredCharacters(new Set());
    setShowCorrectAnswer("");
    setCurrentCharacter(null);

    setTimeout(() => {
      generateNewQuestion(uniqueCharacters);
    }, 100);
  };

  // --- Learning Mode Initialization ---
  const initializeLearning = (characters: KatakanaCharacter[], rowKey?: string) => {
     if (characters.length === 0) {
         console.warn("Attempted to start learning mode with an empty set.");
         return;
     }
    setLearningSet([...characters]);
    setCurrentLearningIndex(0);
    setCurrentCharacter(characters[0]);
    setGameState("learning");
    setSelectedRowKey(rowKey || null);
    // Clear quiz-specific states
    setScore(0);
    setTotalQuestions(0);
    setRemainingCharacters([]);
    setCorrectlyAnsweredCharacters(new Set());
    setShowCorrectAnswer("");
    setAnswer("");
  };

  // --- Question Generation (Quiz Mode) ---
  const generateNewQuestion = (pool: KatakanaCharacter[]) => {
    if (pool.length === 0) {
      if (selectedRowKey && !completedRows.includes(selectedRowKey)) {
        // Avoid duplicates if already completed
        setCompletedRows(prev => Array.from(new Set([...prev, selectedRowKey])));
      }
      setGameState("complete");
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedCharacter = pool[randomIndex];

    setCurrentCharacter(selectedCharacter);
    setAnswer("");
    setShowCorrectAnswer("");
    
    // Focus the input after a slight delay to ensure state updates are complete
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // --- Event Handlers for Welcome Screen ---
  const handleSelectSet = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof katakanaRows) => {
      let characters: KatakanaCharacter[] = [];
      let rowKeyStr: string | undefined = undefined;

      if (type === 'row' && key) {
          characters = katakanaRows[key];
          rowKeyStr = key;
      } else if (type === 'all') {
          characters = Object.values(katakanaRows).flat();
          rowKeyStr = 'all';
      } else if (type === 'frequent') {
          characters = mostFrequentWords;
          rowKeyStr = 'frequent';
      } else if (type === 'special' && katakanaRows.special) {
           characters = katakanaRows.special;
           rowKeyStr = 'special';
      }

      if (!characters || characters.length === 0) {
          console.error("No characters found for selection:", type, key);
          return;
      }
      return { characters, key: rowKeyStr };
  };

  const startQuiz = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof katakanaRows) => {
      const selection = handleSelectSet(type, key);
      if (selection) {
          initializeQuiz(selection.characters, selection.key);
      }
  }

  const startLearning = (type: 'row' | 'all' | 'frequent' | 'special', key?: keyof typeof katakanaRows) => {
      const selection = handleSelectSet(type, key);
       if (selection) {
          initializeLearning(selection.characters, selection.key);
      }
  }

 // --- Answer Submission (Quiz Mode) ---
 const handleAnswerSubmit = () => {
  if (!currentCharacter || gameState !== 'playing') return;

  // Disable check while feedback is potentially showing from a previous quick attempt
  if (showCorrectImage || showIncorrectImage) return; 

  const isCorrect = answer.trim().toLowerCase() === currentCharacter.romaji.toLowerCase();

  if (isCorrect) {
    // --- Correct Answer Logic ---
    const newCorrectlyAnswered = new Set(correctlyAnsweredCharacters).add(currentCharacter.character);
    setCorrectlyAnsweredCharacters(newCorrectlyAnswered);
    const newScore = newCorrectlyAnswered.size;
    setScore(newScore);

    const newRemaining = remainingCharacters.filter(
      char => char.character !== currentCharacter.character
    );
    setRemainingCharacters(newRemaining);

    setShowCorrectImage(true);
    setTimeout(() => setShowCorrectImage(false), 1200);

    setTimeout(() => {
      generateNewQuestion(newRemaining); 
    }, 1200);

  } else {
    // --- Incorrect Answer Logic ---
    setShowIncorrectImage(true);
    setShowCorrectAnswer(currentCharacter.romaji);

    setTimeout(() => {
      setShowIncorrectImage(false);
      setAnswer("");
      generateNewQuestion(remainingCharacters);
    }, 2000);
  }
};

  // --- Navigation Handlers (Learning Mode) ---
  const handleNextLearning = () => {
      if (!learningSet || learningSet.length === 0) return;
      const nextIndex = (currentLearningIndex + 1) % learningSet.length;
      setCurrentLearningIndex(nextIndex);
      setCurrentCharacter(learningSet[nextIndex]);
  };

  const handlePreviousLearning = () => {
      if (!learningSet || learningSet.length === 0) return;
      const prevIndex = (currentLearningIndex - 1 + learningSet.length) % learningSet.length;
      setCurrentLearningIndex(prevIndex);
      setCurrentCharacter(learningSet[prevIndex]);
  };

  // --- Other Handlers ---
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && answer && gameState === 'playing' && !showCorrectImage && !showIncorrectImage) {
        handleAnswerSubmit();
    }
  };

  const handleReset = () => {
    if (name) {
      localStorage.setItem("katakanaPlayerName", name);
    }
    setGameState("welcome");
    setSelectedRowKey(null);
    setRemainingCharacters([]);
    setCurrentCharacter(null);
    setAnswer("");
    setShowCorrectAnswer("");
    setScore(0);
    setTotalQuestions(0);
    setLearningSet([]);
    setCurrentLearningIndex(0);
    setShowCorrectImage(false);
    setShowIncorrectImage(false);
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-neutral-900 dark:to-purple-900 relative overflow-hidden">
      {/* Header Image */}
      <div className="w-full max-w-2xl mb-6 z-10">
        <Image
          src="/katakana.svg" // Make sure to add katakana.svg to public folder
          alt="Katakana Adventure"
          width={800}
          height={200}
          priority
          className="rounded-lg shadow-lg object-contain"
        />
      </div>

      {/* Feedback Images */}
      <AnimatePresence>
        {showCorrectImage && (
          <motion.div
            className="fixed top-8 right-8 z-50"
            initial={{ scale: 0.5, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.5, opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample1.jpg"
              alt="Correct answer"
              width={120}
              height={120}
              priority
              className="rounded-full shadow-2xl border-4 border-green-400 bg-white"
            />
          </motion.div>
        )}
        {showIncorrectImage && (
          <motion.div
            className="fixed top-8 right-8 z-50"
            initial={{ scale: 0.5, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.5, opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample2.jpg"
              alt="Incorrect answer"
              width={120}
              height={120}
              priority
              className="rounded-full shadow-2xl border-4 border-red-400 bg-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Card */}
      <Card className="w-full max-w-lg bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm shadow-xl z-10">
        <CardContent className="p-6 md:p-8">

          {/* --- Welcome State --- */}
          {gameState === "welcome" && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Katakana Adventure</h2>
              <p className="text-gray-500 dark:text-gray-400">Enter your name and choose a mode!</p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="text-center text-lg bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-100 border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500"
              />

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Select Katakana Set</h3>
                {/* Grid for Rows */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(katakanaRows) as Array<keyof typeof katakanaRows>).map((row) => (
                    <div key={row} className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-start pl-1">{row.toUpperCase()} Row</span>
                       <div className="flex space-x-1">
                            <Button
                                onClick={() => startLearning('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                className="flex-1 text-purple-700 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/50"
                                >
                                Learn
                            </Button>
                            <Button
                                onClick={() => startQuiz('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                className={`flex-1 ${completedRows.includes(row) ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' : 'text-neutral-800 dark:text-neutral-200'}`}
                                >
                                Quiz {completedRows.includes(row) ? '✓' : ''}
                            </Button>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Buttons for All / Frequent */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {/* All Katakana */}
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-start pl-1">All Katakana</span>
                       <div className="flex space-x-1">
                             <Button
                                onClick={() => startLearning('all')}
                                disabled={!name}
                                variant="outline"
                                className="flex-1 text-purple-700 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/50"
                                >
                                Learn All
                            </Button>
                            <Button
                                onClick={() => startQuiz('all')}
                                disabled={!name}
                                variant="outline"
                                className={`flex-1 ${completedRows.includes('all') ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' : 'text-neutral-800 dark:text-neutral-200'}`}
                                >
                                Quiz All {completedRows.includes('all') ? '✓' : ''}
                            </Button>
                       </div>
                    </div>

                     {/* Frequent Words */}
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-start pl-1">Frequent Words</span>
                       <div className="flex space-x-1">
                            <Button
                                onClick={() => startLearning('frequent')}
                                disabled={!name}
                                variant="outline"
                                className="flex-1 text-purple-700 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/50"
                                >
                                Learn Words
                            </Button>
                             <Button
                                onClick={() => startQuiz('frequent')}
                                disabled={!name}
                                variant="outline"
                                className={`flex-1 ${completedRows.includes('frequent') ? 'bg-green-100 hover:bg-green-200 border-green-400 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' : 'text-neutral-800 dark:text-neutral-200'}`}
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
               <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Quiz Time, {name}!</h2>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-neutral-600 dark:text-neutral-400">
                        Menu
                    </Button>
               </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Score: {score} / {totalQuestions}</div>
              {/* Progress Bar */}
               <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%` }}></div>
                </div>

              <p className="text-7xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 my-4 p-4 bg-purple-50 dark:bg-neutral-700/50 rounded-lg">
                {currentCharacter.character}
              </p>
              <Input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type the romaji"
                className="text-center text-2xl bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-100 border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 mb-4"
                autoFocus
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={showCorrectImage || showIncorrectImage}
              />
              {showCorrectAnswer && (
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-red-600 dark:text-red-400 font-semibold text-lg mb-4 p-2 bg-red-100 dark:bg-red-900/30 rounded"
                    >
                  Correct answer: {showCorrectAnswer}
                </motion.div>
              )}
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answer || showIncorrectImage || showCorrectImage}
                className="w-full font-bold"
                variant="default"
                size="lg"
              >
                Check Answer
              </Button>
            </div>
          )}

          {/* --- Learning State --- */}
          {gameState === "learning" && currentCharacter && (
              <div className="text-center space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Learning Mode</h2>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-neutral-600 dark:text-neutral-400">
                        Menu
                    </Button>
                </div>
                 <div className="text-gray-500 dark:text-gray-400">
                    Set: {selectedRowKey ? selectedRowKey.toUpperCase() : 'Unknown'} ({currentLearningIndex + 1} / {learningSet.length})
                 </div>

                <div className="p-8 bg-purple-50 dark:bg-neutral-700/50 rounded-lg shadow-inner">
                     <p className="text-7xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {currentCharacter.character}
                    </p>
                    <p className="text-3xl md:text-4xl font-semibold text-purple-700 dark:text-purple-300">
                        {currentCharacter.romaji}
                    </p>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                    <Button
                        onClick={handlePreviousLearning}
                        variant="outline"
                        size="lg"
                    >
                        &larr; Previous
                    </Button>
                     <Button
                        onClick={handleNextLearning}
                        variant="outline"
                        size="lg"
                    >
                        Next &rarr;
                    </Button>
                </div>
              </div>
          )}

          {/* --- Complete State --- */}
          {gameState === "complete" && (
            <div className="text-center space-y-6 py-8">
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl font-bold text-green-600 dark:text-green-400"
              >
                🎉 Well Done, {name}! 🎉
              </motion.h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                 You completed the &apos;{selectedRowKey?.toUpperCase()}&apos; set!
              </p>
              {totalQuestions > 0 && (
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Final Score: {score} / {totalQuestions}
                  </div>
              )}

              <Button
                onClick={handleReset}
                variant="secondary"
                className="font-bold"
                size="lg"
              >
                Return to Menu
              </Button>
                          </div>
                        )}
              
                      </CardContent>
                    </Card>
              
                    {/* Optional Background Blobs */}
                    {/* Add the blob CSS to globals.css if you use these */}
                     {/* <div className="absolute top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20 animate-blob"></div>
                      <div className="absolute bottom-10 -right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
                       <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div> */}
              
                  </div>
                );
              };
              
              export default HiraganaLearningPage;
              
              // Add this to your globals.css if using the background blobs:
              /*
              @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
              }
              .animate-blob { animation: blob 7s infinite; }
              .animation-delay-2000 { animation-delay: 2s; }
              .animation-delay-4000 { animation-delay: 4s; } */