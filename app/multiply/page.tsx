"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Question {
  num1: number;
  num2: number;
}

const MultiplicationGame = () => {
  const [name, setName] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [gameState, setGameState] = useState<"welcome" | "playing" | "complete">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ num1: 1, num2: 1 });
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState({
    show: false,
    correct: false,
    correctAnswer: null as number | null,
  });
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showIncorrectImage, setShowIncorrectImage] = useState<boolean>(false);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setName(storedName);
  }, []);

  const generateNewQuestion = () => {
    const remainingNumbers = Array.from({ length: 10 }, (_, i) => i + 1).filter(
      (num) => !correctQuestions.includes(num)
    );

    if (remainingNumbers.length === 0) {
      setGameState("complete");
      return;
    }

    const randomNum = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
    setCurrentQuestion({ num1: randomNum, num2: parseInt(selectedTable) });
    setAnswer("");
    setFeedback({ show: false, correct: false, correctAnswer: null });
  };

  const handleStart = () => {
    if (name && selectedTable) {
      localStorage.setItem("playerName", name);
      setGameState("playing");
      setScore(0);
      setCorrectQuestions([]);
      setIncorrectQuestions([]);
      generateNewQuestion();
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = parseInt(answer) === correctAnswer;

    setFeedback({ show: true, correct: isCorrect, correctAnswer: isCorrect ? null : correctAnswer });

    if (isCorrect) {
      setShowCorrectImage(true);
      setTimeout(() => setShowCorrectImage(false), 2000);

      setCorrectQuestions((prevCorrect) => {
        if (!prevCorrect.includes(currentQuestion.num1)) {
          const updatedCorrect = [...prevCorrect, currentQuestion.num1];
          setScore(updatedCorrect.length);

          if (updatedCorrect.length >= 10) {
            setTimeout(() => setGameState("complete"), 2000);
          } else {
            setTimeout(generateNewQuestion, 2000);
          }

          return updatedCorrect;
        }
        return prevCorrect;
      });
    } else {
      setShowIncorrectImage(true);
      setTimeout(() => setShowIncorrectImage(false), 2000);

      setIncorrectQuestions((prev) => {
        const updatedIncorrect = [...new Set([...prev, currentQuestion.num1])];
        setTimeout(generateNewQuestion, 2000);
        return updatedIncorrect;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && answer) handleAnswerSubmit();
  };

  const handleRestart = () => {
    setGameState("welcome");
    setSelectedTable("");
    setScore(0);
    setCorrectQuestions([]);
    setIncorrectQuestions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100 relative">
      <div className="w-full max-w-2xl mb-6">
        <Image src="/banner.svg" alt="Multiplication Adventure" width={800} height={200} className="rounded-lg shadow-lg" />
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
            <Image src="/sample1.jpg" alt="Correct answer" width={150} height={150} className="rounded-lg shadow-lg" />
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
            <Image src="/sample2.jpg" alt="Incorrect answer" width={150} height={150} className="rounded-lg shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-xl">
        <CardContent className="p-6">
          {gameState === "welcome" ? (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-400">Multiplication Adventure</h2>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="text-center text-lg bg-white text-gray-400" />
              <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full p-2 border rounded-md text-gray-400">
                <option value="">Choose a table</option>
                {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {num} times table
                  </option>
                ))}
              </select>
              <Button onClick={handleStart} disabled={!name || !selectedTable} className="w-full text-gray-400 font-bold">
                Start
              </Button>
            </div>
          ) : gameState === "playing" ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-400">Hi {name}!</h2>
              <div className="text-lg text-gray-400">Score: {score}/10</div>
              <p className="text-4xl font-bold text-gray-400">
                {currentQuestion.num1} × {currentQuestion.num2} = ?
              </p>
              <Input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={handleKeyPress} className="text-center text-2xl bg-white text-gray-400" autoFocus />
              <Button onClick={handleAnswerSubmit} disabled={!answer} className="text-1xl font-bold text-gray-400">
                Check Answer
              </Button>
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-green-500">🎉 Well Done, {name}! 🎉</h2>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplicationGame;
