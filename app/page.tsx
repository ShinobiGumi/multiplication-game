"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MultiplicationGame = () => {
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('playerName') || '';
    }
    return '';
  });
  const [selectedTable, setSelectedTable] = useState('');
  const [gameState, setGameState] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState({ num1: 1, num2: 1 });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ 
    show: false, 
    correct: false,
    correctAnswer: null 
  });
  const [questionsPool, setQuestionsPool] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  const generateQuestionPool = () => {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  };

  const generateNewQuestion = () => {
    const availableQuestions = [
      ...questionsPool,
      ...incorrectQuestions
    ];

    if (availableQuestions.length === 0) {
      if (completedQuestions.length === 10) {
        setGameState('complete');
        return;
      }
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const num1 = availableQuestions[randomIndex];
    
    if (num1 && selectedTable) {
      setCurrentQuestion({
        num1: num1,
        num2: parseInt(selectedTable)
      });
      
      // Remove the question from its current pool
      if (questionsPool.includes(num1)) {
        setQuestionsPool(questionsPool.filter(n => n !== num1));
      } else {
        setIncorrectQuestions(incorrectQuestions.filter(n => n !== num1));
      }
    }
    setAnswer('');
    setFeedback({ show: false, correct: false, correctAnswer: null });
  };

  const handleStart = () => {
    if (name && selectedTable) {
      // Save name to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('playerName', name);
      }
      
      setGameState('playing');
      setScore(0);
      setCompletedQuestions([]);
      setIncorrectQuestions([]);
      const initialQuestions = generateQuestionPool();
      setQuestionsPool(initialQuestions);
      
      const firstNum = initialQuestions[Math.floor(Math.random() * initialQuestions.length)];
      setCurrentQuestion({
        num1: firstNum,
        num2: parseInt(selectedTable)
      });
      setQuestionsPool(initialQuestions.filter(n => n !== firstNum));
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = parseInt(answer) === correctAnswer;
    
    setFeedback({ 
      show: true, 
      correct: isCorrect,
      correctAnswer: isCorrect ? null : correctAnswer
    });
    
    if (isCorrect) {
      if (!completedQuestions.includes(currentQuestion.num1)) {
        const updatedCompleted = [...completedQuestions, currentQuestion.num1];
        setCompletedQuestions(updatedCompleted);
        setScore(updatedCompleted.length);
        
        if (updatedCompleted.length === 10) {
          setTimeout(() => setGameState('complete'), 1500);
          return;
        }
      }
    } else {
      if (!incorrectQuestions.includes(currentQuestion.num1)) {
        setIncorrectQuestions([...incorrectQuestions, currentQuestion.num1]);
      }
    }
    
    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer) {
      handleAnswerSubmit();
    }
  };

  const handleRestart = () => {
    setGameState('welcome');
    setSelectedTable('');
    setScore(0);
    setCompletedQuestions([]);
    setIncorrectQuestions([]);
  };

  const gradientStyle = {
    background: 'linear-gradient(135deg, #f6f8ff 0%, #e9f0ff 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={gradientStyle} className="p-4 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md mb-6">
        <div className="relative w-full h-[200px]">
          <Image 
            src="/louis.png" 
            alt="Multiplication Game Banner"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg shadow-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          LOUIS&apos;S BADASS MULTIPLICATION GAME Y&apos;ALL!
        </h1>
      </div>
  
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          {gameState === &aposwelcome&apos ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                Multiplication Tables Adventure
              </h1>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    What's your name?
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white text-gray-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Which times table would you like to practice?
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full text-sm p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-400"
                  >
                    <option value="">Choose a number</option>
                    {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>
                        {num} times table
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleStart}
                  disabled={!name || !selectedTable}
                  className="w-full mt-6 text-gray-400"
                >
                  Start Learning!
                </Button>
              </div>
            </div>
          ) : gameState === 'playing' ? (
            <div className="text-center space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-400">
                  Hi {name}!
                </h2>
                <div className="text-sm text-gray-600">
                  Score: {score}/10
                </div>
              </div>

              {feedback.show && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-4"
                >
                  {feedback.correct ? (
                    <div className="flex items-center justify-center text-green-500 text-3xl font-bold animate-bounce">
                      <CheckCircle2 size={36} className="mr-2" />
                      Fantastic!
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-red-500">
                      <div className="flex items-center text-3xl font-bold mb-2">
                        <XCircle size={36} className="mr-2" />
                        Try again!
                      </div>
                      <div className="text-xl">
                        The correct answer is {feedback.correctAnswer}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="py-8">
                <div className="text-4xl font-bold mb-8 text-gray-400">
                  {currentQuestion.num1} × {currentQuestion.num2} = ?
                </div>
                
                <div className="relative">
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-center text-2xl w-32 mx-auto bg-white text-gray-400"
                    placeholder="?"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!answer}
                  className="mt-6 text-gray-400"
                >
                  Check Answer
                </Button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-3xl font-bold mb-8 text-green-500"
              >
                🎉 Congratulations! 🎉
              </motion.div>
              <p className="text-xl text-gray-400">
                Well done, {name}! You've mastered the {selectedTable} times table!
              </p>
              <Button
                onClick={handleRestart}
                className="mt-6 text-gray-400"
              >
                Try Another Table
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
      </div>
  );
};

export default MultiplicationGame;