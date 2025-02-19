"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const MultiplicationGame = () => {
  const [name, setName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [gameState, setGameState] = useState("welcome");
  const [currentQuestion, setCurrentQuestion] = useState({ num1: 1, num2: 1 });
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, correct: false, correctAnswer: null });
  const [questionsPool, setQuestionsPool] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("playerName");
      if (storedName) setName(storedName);
    }
  }, []);

  const generateQuestionPool = () => Array.from({ length: 10 }, (_, i) => i + 1);

  const generateNewQuestion = () => {
    const availableQuestions = [...questionsPool, ...incorrectQuestions];
    if (availableQuestions.length === 0) {
      if (completedQuestions.length === 10) {
        setGameState("complete");
        return;
      }
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const num1 = availableQuestions[randomIndex];
    setCurrentQuestion({ num1, num2: parseInt(selectedTable) });
    setQuestionsPool(questionsPool.filter((n) => n !== num1));
    setIncorrectQuestions(incorrectQuestions.filter((n) => n !== num1));
    setAnswer("");
    setFeedback({ show: false, correct: false, correctAnswer: null });
  };

  const handleStart = () => {
    if (name && selectedTable) {
      if (typeof window !== "undefined") {
        localStorage.setItem("playerName", name);
      }
      setGameState("playing");
      setScore(0);
      setCompletedQuestions([]);
      setIncorrectQuestions([]);
      const initialQuestions = generateQuestionPool();
      setQuestionsPool(initialQuestions);
      generateNewQuestion();
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = parseInt(answer) === correctAnswer;
    setFeedback({ show: true, correct: isCorrect, correctAnswer: isCorrect ? null : correctAnswer });
    if (isCorrect) {
      if (!completedQuestions.includes(currentQuestion.num1)) {
        const updatedCompleted = [...completedQuestions, currentQuestion.num1];
        setCompletedQuestions(updatedCompleted);
        setScore(updatedCompleted.length);
        if (updatedCompleted.length === 10) {
          setTimeout(() => setGameState("complete"), 1500);
          return;
        }
      }
    } else {
      if (!incorrectQuestions.includes(currentQuestion.num1)) {
        setIncorrectQuestions([...incorrectQuestions, currentQuestion.num1]);
      }
    }
    setTimeout(generateNewQuestion, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && answer) handleAnswerSubmit();
  };

  const handleRestart = () => {
    setGameState("welcome");
    setSelectedTable("");
    setScore(0);
    setCompletedQuestions([]);
    setIncorrectQuestions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md mb-6">
        <div className="relative w-full h-[200px]">
          <Image src="/louis.png" alt="Multiplication Game" fill className="rounded-lg shadow-lg object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center mt-4">LOUIS&apos;S MULTIPLICATION GAME</h1>
      </div>
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-xl">
        <CardContent className="p-6">
          {gameState === "welcome" ? (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold">Multiplication Adventure</h2>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="text-center" />
              <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full p-2 border rounded-md">
                <option value="">Choose a table</option>
                {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>{num} times table</option>
                ))}
              </select>
              <Button onClick={handleStart} disabled={!name || !selectedTable} className="w-full">Start</Button>
            </div>
          ) : gameState === "playing" ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">{name}, solve this:</h2>
              <p className="text-4xl font-bold">{currentQuestion.num1} × {currentQuestion.num2} = ?</p>
              <Input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={handleKeyPress} className="text-center text-2xl" autoFocus />
              <Button onClick={handleAnswerSubmit} disabled={!answer}>Check Answer</Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-green-500">🎉 Well Done, {name}! 🎉</h2>
              <Button onClick={handleRestart}>Play Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplicationGame;
