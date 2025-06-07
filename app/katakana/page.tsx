// app/hiragana/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming components/ui/button.tsx is updated as per previous instructions
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HiraganaCharacter {
  character: string;
  romaji: string;
}

// --- Hiragana Data (Keep as is) ---
const katakanaRows = {
  a: [
    { character: 'ア', romaji: 'a' }, { character: 'イ', romaji: 'i' }, { character: 'ウ', romaji: 'u' }, { character: 'エ', romaji: 'e' }, { character: 'オ', romaji: 'o' },
  ],
  ka: [
    { character: 'カ', romaji: 'ka' }, { character: 'キ', romaji: 'ki' }, { character: 'ク', romaji: 'ku' }, { character: 'ケ', romaji: 'ke' }, { character: 'コ', romaji: 'ko' },
  ],
  # Add remaining katakana rows as necessary
};
 {
  a: [
    { character: 'あ', romaji: 'a' }, { character: 'い', romaji: 'i' }, { character: 'う', romaji: 'u' }, { character: 'え', romaji: 'e' }, { character: 'お', romaji: 'o' },
  ],
  ka: [
    { character: 'か', romaji: 'ka' }, { character: 'き', romaji: 'ki' }, { character: 'く', romaji: 'ku' }, { character: 'け', romaji: 'ke' }, { character: 'こ', romaji: 'ko' },
  ],
  sa: [
    { character: 'さ', romaji: 'sa' }, { character: 'し', romaji: 'shi' }, { character: 'す', romaji: 'su' }, { character: 'せ', romaji: 'se' }, { character: 'そ', romaji: 'so' },
  ],
  ta: [
    { character: 'た', romaji: 'ta' }, { character: 'ち', romaji: 'chi' }, { character: 'つ', romaji: 'tsu' }, { character: 'て', romaji: 'te' }, { character: 'と', romaji: 'to' },
  ],
  na: [
    { character: 'な', romaji: 'na' }, { character: 'に', romaji: 'ni' }, { character: 'ぬ', romaji: 'nu' }, { character: 'ね', romaji: 'ne' }, { character: 'の', romaji: 'no' },
  ],
  ha: [
    { character: 'は', romaji: 'ha' }, { character: 'ひ', romaji: 'hi' }, { character: 'ふ', romaji: 'fu' }, { character: 'へ', romaji: 'he' }, { character: 'ほ', romaji: 'ho' },
  ],
  ma: [
    { character: 'ま', romaji: 'ma' }, { character: 'み', romaji: 'mi' }, { character: 'む', romaji: 'mu' }, { character: 'め', romaji: 'me' }, { character: 'も', romaji: 'mo' },
  ],
  ya: [
    { character: 'や', romaji: 'ya' }, { character: 'ゆ', romaji: 'yu' }, { character: 'よ', romaji: 'yo' },
  ],
  ra: [
    { character: 'ら', romaji: 'ra' }, { character: 'り', romaji: 'ri' }, { character: 'る', romaji: 'ru' }, { character: 'れ', romaji: 're' }, { character: 'ろ', romaji: 'ro' },
  ],
  wa: [
    { character: 'わ', romaji: 'wa' }, { character: 'を', romaji: 'wo' },
  ],
  special: [
    { character: 'ん', romaji: 'n' },
  ]
};

const mostFrequentWords: HiraganaCharacter[] = [
 { character: 'これ', romaji: 'kore' }, { character: 'それ', romaji: 'sore' }, { character: 'あれ', romaji: 'are' }, { character: 'です', romaji: 'desu' }, { character: 'ます', romaji: 'masu' }, { character: 'ぼく', romaji: 'boku' }, { "character": "いわし", "romaji": "iwashi" }, { "character": "うんこ", "romaji": "unko" }, { "character": "もれる", "romaji": "moreru" }, { "character": "うんち", "romaji": "unchi" }, { "character": "まぐろ", "romaji": "maguro" }, { character: 'ようこ', romaji: 'youko' }, { character: 'かるろ', romaji: 'karuro' }, { character: 'るい', romaji: 'rui' },  { character: 'あいさつ（挨拶）', romaji: 'aisatsu' }, { character: 'ありがとう', romaji: 'arigatou' }, { character: 'ごめんなさい', romaji: 'gomennasai' }, { character: 'こんにちは（挨拶）', romaji: 'konnichiha' }, { character: 'おはよう', romaji: 'ohayou' }, { character: 'さようなら', romaji: 'sayounara' }, { character: 'はい', romaji: 'hai' }, { character: 'いいえ', romaji: 'iie' }, { character: 'ともだち（友達）', romaji: 'tomodachi' }, { character: 'がっこう（学校）', romaji: 'gakkou' }, { character: 'せんせい（先生）', romaji: 'sensei' }, { character: 'ほん（本）', romaji: 'hon' }, { character: 'かばん', romaji: 'kaban' }, { character: 'おかあさん（お母さん）', romaji: 'okaasan' }, { character: 'おとうさん（お父さん）', romaji: 'otousan' }, { character: 'きょうだい(兄弟)', romaji: 'kyoudai' }, { character: 'いぬ（犬）', romaji: 'inu'}, { character: 'ねこ（猫）', romaji: 'neko' }, { character: 'おちゃ（お茶）', romaji: 'ocha' }, { character: 'おかし（お菓子）', romaji: 'okashi' }, { character: 'ごはん（食事/米）', romaji: 'gohan' }, { character: 'みず（水）', romaji: 'mizu' }, { character: 'おかね（お金）', romaji: 'okane' }, { character: 'でんわ（電話）', romaji: 'denwa' },  { character: 'やきゅう（野球）', romaji: 'yakyuu' }, { character: 'え（絵）', romaji: 'e' }, { character: 'うた（歌）', romaji: 'uta' }, { character: 'おんがく（音楽）', romaji: 'ongaku' }, { character: 'がっき', romaji: 'gakki' }, { character: 'つくえ（机）', romaji: 'tsukue' }, { character: 'いす（椅子）', romaji: 'isu' }, { character: 'しゅくだい（宿題）', romaji: 'shukudai' }, { character: 'べんきょう（勉強）', romaji: 'benkyou' }, { character: 'やすみ（休み）', romaji: 'yasumi' }, { character: 'あそぶ（遊ぶ）', romaji: 'asobu' }, { character: 'いく（行く）', romaji: 'iku' }, { character: 'くる（来る）', romaji: 'kuru' }, { character: 'たべる（食べる）', romaji: 'taberu' }, { character: 'のむ（飲む）', romaji: 'nomu' }, { character: 'ねる（寝る）', romaji: 'neru' }, { "character": "へや", "romaji": "heya" },  { "character": "まど", "romaji": "mado" },{ "character": "けしごむ", "romaji": "keshigomu" }, { "character": "じしょ", "romaji": "jisho" },  { "character": "きょう", "romaji": "kyou" },  { "character": "あした", "romaji": "ashita" },  { "character": "きのう", "romaji": "kinou" },  { "character": "いま", "romaji": "ima" },  { "character": "とき", "romaji": "toki" },  { "character": "ひる", "romaji": "hiru" },  { "character": "よる", "romaji": "yoru" },  { "character": "あさ", "romaji": "asa" },  { "character": "ばん", "romaji": "ban" },  { "character": "せかい", "romaji": "sekai" },{ "character": "さかな", "romaji": "sakana" },  { "character": "むし", "romaji": "Mushi" },  { "character": "くるま", "romaji": "kuruma" },  { "character": "じてんしゃ", "romaji": "jitensha" },  { "character": "でんしゃ", "romaji": "densha" },  { "character": "おなら", "romaji": "onara" },  { "character": "ひこうき", "romaji": "hikouki" },  { "character": "でんわ", "romaji": "denwa" },];
// --- End Hiragana Data ---


const HiraganaLearningPage = () => {
  const [name, setName] = useState<string>("");
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
  
  // Add input ref for focus management
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize total unique characters
  const getTotalUniqueCharacters = React.useMemo(() => {
    return (characters: HiraganaCharacter[]) => {
      return new Set(characters.map(char => char.character)).size;
    };
  }, []);

  // Persist/Load game state
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setName(storedName);
    const storedCompleted = localStorage.getItem("completedRows");
    if (storedCompleted) {
        try {
            setCompletedRows(JSON.parse(storedCompleted));
        } catch (e) {
            console.error("Failed to parse completed rows from local storage", e);
            localStorage.removeItem("completedRows");
        }
    }
  }, []);

  // Save completed rows
  useEffect(() => {
    if (completedRows.length > 0) { // Avoid saving empty array initially if not needed
        localStorage.setItem("completedRows", JSON.stringify(completedRows));
    }
  }, [completedRows]);

  // --- Quiz Mode Initialization ---
  const initializeQuiz = (characters: HiraganaCharacter[], rowKey?: string) => {
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
  const initializeLearning = (characters: HiraganaCharacter[], rowKey?: string) => {
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
  const generateNewQuestion = (pool: HiraganaCharacter[]) => {
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
      } else if (type === 'special' && hiraganaRows.special) {
           characters = hiraganaRows.special;
           rowKeyStr = 'special';
      }


      if (!characters || characters.length === 0) {
          console.error("No characters found for selection:", type, key);
          return;
      }
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

  // Disable check while feedback is potentially showing from a previous quick attempt
  if (showCorrectImage || showIncorrectImage) return; 

  const isCorrect = answer.trim().toLowerCase() === currentCharacter.romaji.toLowerCase();

  if (isCorrect) {
    // --- Correct Answer Logic (Remains the same) ---
    const newCorrectlyAnswered = new Set(correctlyAnsweredCharacters).add(currentCharacter.character);
    setCorrectlyAnsweredCharacters(newCorrectlyAnswered);
    const newScore = newCorrectlyAnswered.size;
    setScore(newScore);

    const newRemaining = remainingCharacters.filter(
      char => char.character !== currentCharacter.character
    );
    setRemainingCharacters(newRemaining); // Remove correct char from pool

    setShowCorrectImage(true);
    setTimeout(() => setShowCorrectImage(false), 1200);

    setTimeout(() => {
      // Generate next question from the *smaller* pool
      generateNewQuestion(newRemaining); 
    }, 1200);
    // --- End Correct Answer Logic ---

  } else {
    // --- Incorrect Answer Logic (Updated) ---
    setShowIncorrectImage(true);
    setShowCorrectAnswer(currentCharacter.romaji);

    setTimeout(() => {
      setShowIncorrectImage(false);
      setAnswer(""); // Clear input

      // *** CHANGE IS HERE ***
      // Generate a new question from the *current* remaining pool
      // This pool still contains the incorrectly answered character.
      generateNewQuestion(remainingCharacters);

      // Note: Focusing the input is now handled within generateNewQuestion's timeout
      // inputRef.current?.focus(); // Can be removed from here

    }, 2000); // Show feedback for 2 seconds
    // --- End Incorrect Answer Logic ---
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
    setLearningSet([]);
    setCurrentLearningIndex(0);
    setShowCorrectImage(false); // Ensure feedback images are hidden on reset
    setShowIncorrectImage(false);
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Header Image */}
      <div className="w-full max-w-2xl mb-6 z-10">
        <Image
          src="/hiragana.svg" // Ensure path is correct
          alt="Hiragana Adventure"
          width={800}
          height={200}
          priority
          className="rounded-lg shadow-lg object-contain"
        />
      </div>

      {/* Feedback Images (Positioned to the side - Fixed) */}
      <AnimatePresence>
        {showCorrectImage && (
          <motion.div
            className="fixed top-8 right-8 z-50" // Positioned top-right
            initial={{ scale: 0.5, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.5, opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample1.jpg" // Ensure path is correct
              alt="Correct answer"
              width={120}
              height={120}
              priority
              className="rounded-full shadow-2xl border-4 border-green-400 bg-white" // Added bg-white
            />
          </motion.div>
        )}
        {showIncorrectImage && (
          <motion.div
            className="fixed top-8 right-8 z-50" // Positioned top-right
            initial={{ scale: 0.5, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.5, opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/sample2.jpg" // Ensure path is correct
              alt="Incorrect answer"
              width={120}
              height={120}
              priority
              className="rounded-full shadow-2xl border-4 border-red-400 bg-white" // Added bg-white
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
              <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Hiragana Adventure</h2>
              <p className="text-gray-500 dark:text-gray-400">Enter your name and choose a mode!</p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="text-center text-lg bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-100 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 focus:ring-indigo-500"
              />

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Select Hiragana Set</h3>
                {/* Grid for Rows */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(hiraganaRows) as Array<keyof typeof hiraganaRows>).map((row) => (
                    <div key={row} className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-start pl-1">{row.toUpperCase()} Row</span>
                       <div className="flex space-x-1">
                            <Button
                                onClick={() => startLearning('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                // Subtle blue hint for "Learn"
                                className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50"
                                >
                                Learn
                            </Button>
                            <Button
                                onClick={() => startQuiz('row', row)}
                                disabled={!name}
                                size="sm"
                                variant="outline"
                                // Refined outline + completed state styling
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
                    {/* All Hiragana */}
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-start pl-1">All Hiragana</span>
                       <div className="flex space-x-1">
                             <Button
                                onClick={() => startLearning('all')}
                                disabled={!name}
                                variant="outline"
                                className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50"
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
                                className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50"
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
               <div className="flex justify-between items-center"> {/* Changed items-baseline to items-center */}
                   <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Quiz Time, {name}!</h2>
                    {/* Use Ghost variant for Menu button */}
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-neutral-600 dark:text-neutral-400">
                        Menu
                    </Button>
               </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Score: {score} / {totalQuestions}</div>
              {/* Progress Bar */}
               <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%` }}></div>
                </div>

              <p className="text-7xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 my-4 p-4 bg-indigo-50 dark:bg-neutral-700/50 rounded-lg">
                {currentCharacter.character}
              </p>
              <Input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type the romaji"
                className="text-center text-2xl bg-white dark:bg-neutral-700 text-gray-700 dark:text-neutral-100 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 focus:ring-indigo-500 mb-4"
                autoFocus
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={showCorrectImage || showIncorrectImage} // Disable input during feedback
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
              {/* Use Default variant (primary color) and size lg for Check Answer */}
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answer || showIncorrectImage || showCorrectImage}
                className="w-full font-bold" // Primary color text usually white, handled by variant
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
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Learning Mode</h2>
                    {/* Use Ghost variant for Menu button */}
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-neutral-600 dark:text-neutral-400">
                        Menu
                    </Button>
                </div>
                 <div className="text-gray-500 dark:text-gray-400">
                    Set: {selectedRowKey ? selectedRowKey.toUpperCase() : 'Unknown'} ({currentLearningIndex + 1} / {learningSet.length})
                 </div>

                <div className="p-8 bg-blue-50 dark:bg-neutral-700/50 rounded-lg shadow-inner">
                     <p className="text-7xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {currentCharacter.character}
                    </p>
                    <p className="text-3xl md:text-4xl font-semibold text-blue-700 dark:text-blue-300">
                        {currentCharacter.romaji}
                    </p>
                </div>

                {/* Use Outline variant and size lg for Prev/Next */}
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
                 {/* Fixed ESLint error here */}
                 You completed the &apos;{selectedRowKey?.toUpperCase()}&apos; set!
              </p>
              {totalQuestions > 0 && (
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Final Score: {score} / {totalQuestions}
                  </div>
              )}

              {/* Use Secondary variant and size lg for Return to Menu */}
              <Button
                onClick={handleReset}
                variant="secondary" // Changed from default for less emphasis
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
.animation-delay-4000 { animation-delay: 4s; }
*/