"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  MessageSquare, 
  Code, 
  Search, 
  PenTool, 
  Music, 
  ImageIcon, 
  ChevronLeft,
  Play,
  Sparkles
} from "lucide-react";

// Create local CardHeader and CardTitle components to fix import errors
const CardHeader: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
};

const CardTitle: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <h3 className="text-lg font-semibold leading-none tracking-tight">{children}</h3>;
};

export default function CodingWithAI() {
  const [activeTab, setActiveTab] = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [robotMessages, setRobotMessages] = useState([
    "Hello! I'm AIBuddy. Let's learn about artificial intelligence!",
  ]);
  const [userInput, setUserInput] = useState("");

  // AI Assistant Chatbot Simulation
  const simulateChat = (input: string) => {
    if (!input.trim()) return;
    
    setRobotMessages([...robotMessages, `You: ${input}`]);
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = "I'm not sure about that. Can you ask me about AI, coding, or robots?";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("what is ai")) {
        response = "AI or Artificial Intelligence is technology that helps computers think and learn a bit like humans do!";
      } else if (lowerInput.includes("coding")) {
        response = "Coding is how we give instructions to computers. It's like writing a recipe for the computer to follow!";
      } else if (lowerInput.includes("robot")) {
        response = "Robots are machines that can do tasks automatically. Some robots use AI to learn and make decisions!";
      } else if (lowerInput.includes("game")) {
        response = "We can use AI to make games more fun! AI can control characters and make them act in smart ways.";
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        response = "Hi there! What would you like to learn about AI today?";
      }
      
      setRobotMessages([...robotMessages, `You: ${input}`, `AIBuddy: ${response}`]);
      setUserInput("");
    }, 500);
  };

  // Quiz questions
  const quizQuestions = [
    {
      question: "What does AI stand for?",
      options: [
        "Automatic Intelligence",
        "Artificial Intelligence",
        "Advanced Internet",
        "Awesome Inventions"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these uses AI?",
      options: [
        "A simple calculator",
        "A regular camera",
        "A voice assistant like Siri",
        "A bicycle"
      ],
      correctAnswer: 2
    },
    {
      question: "What can AI help us do?",
      options: [
        "Create art and music",
        "Answer questions",
        "Play games",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "How do AIs learn?",
      options: [
        "By reading books",
        "By looking at lots of examples",
        "By magic",
        "They don't learn at all"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is NOT an AI?",
      options: [
        "Claude",
        "ChatGPT",
        "A regular calculator",
        "Perplexity"
      ],
      correctAnswer: 2
    }
  ];

  // Answer a quiz question
  const answerQuestion = (selectedOption: number) => {
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  // AI Tools data
  const aiTools = [
    {
      name: "Claude",
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      description: "Claude is great at understanding and writing text. It's really helpful for homework, creative writing, and learning to code!",
      strengths: ["Writing stories", "Explaining things", "Coding help", "Answering questions"]
    },
    {
      name: "Perplexity",
      icon: <Search className="h-8 w-8 text-blue-500" />,
      description: "Perplexity is like a super-powered search engine. It doesn't just find information, it summarizes it for you!",
      strengths: ["Finding facts", "Research", "Summarizing information", "Citing sources"]
    },
    {
      name: "Midjourney",
      icon: <ImageIcon className="h-8 w-8 text-green-500" />,
      description: "Midjourney creates amazing pictures from your descriptions. Just tell it what you want to see!",
      strengths: ["Creating art", "Illustrating stories", "Design ideas", "Visualizing concepts"]
    },
    {
      name: "Scratch + AI",
      icon: <Code className="h-8 w-8 text-orange-500" />,
      description: "Scratch with AI helps you learn to code by making games and animations with blocks. It's super fun!",
      strengths: ["Learning to code", "Making games", "Creating animations", "Solving puzzles"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {/* Header */}
      <header className="w-full bg-white py-6 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-center text-amber-600">Coding with AI for Kids</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "intro", label: "Introduction", icon: <Brain className="h-4 w-4 mr-1" /> },
            { id: "types", label: "AI Tools", icon: <MessageSquare className="h-4 w-4 mr-1" /> },
            { id: "activities", label: "Activities", icon: <Play className="h-4 w-4 mr-1" /> },
            { id: "quiz", label: "Fun Quiz", icon: <Sparkles className="h-4 w-4 mr-1" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center ${
                activeTab === tab.id
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Introduction Section */}
          {activeTab === "intro" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4 text-amber-600">What is AI?</h2>
                  <p className="mb-4 text-lg">
                    AI stands for <span className="font-bold">Artificial Intelligence</span>. It&apos;s technology that helps computers think a bit like humans!
                  </p>
                  <p className="mb-4 text-lg">
                    AI can learn from examples, recognize patterns, and make decisions on its own.
                  </p>
                  <p className="text-lg">
                    Just like you learn by practicing and seeing examples, AI gets better by looking at lots of information!
                  </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-64 h-64 bg-amber-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-32 w-32 text-amber-500" />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-amber-600">What Can AI Do?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Talk With You", icon: <MessageSquare className="h-10 w-10 text-blue-500" />, description: "AI can have conversations, answer questions, and help with homework." },
                    { title: "Create Art", icon: <PenTool className="h-10 w-10 text-purple-500" />, description: "AI can make pictures, draw characters, and design cool stuff." },
                    { title: "Make Music", icon: <Music className="h-10 w-10 text-green-500" />, description: "AI can compose songs, create beats, and help you make music." },
                    { title: "Help You Code", icon: <Code className="h-10 w-10 text-amber-500" />, description: "AI can help you learn to code and build awesome programs." }
                  ].map((item, index) => (
                    <Card key={index} className="bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="mb-2 mt-4">{item.icon}</div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-xl font-bold mb-3 text-amber-600">How AI Works - The Simple Version</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><span className="font-medium">Learning:</span> AI looks at lots of examples to learn patterns</li>
                  <li><span className="font-medium">Thinking:</span> It uses what it learned to understand new information</li>
                  <li><span className="font-medium">Creating:</span> It can make new things based on what it knows</li>
                  <li><span className="font-medium">Improving:</span> It gets better over time with more examples</li>
                </ol>
              </div>
            </motion.div>
          )}

          {/* AI Tools Section */}
          {activeTab === "types" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-amber-600">AI Tools You Can Use</h2>
              <p className="text-lg mb-8">
                There are many different AI tools that can help you with homework, creativity, and learning. Here are some cool ones:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {aiTools.map((tool, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all ${selectedAI === tool.name ? 'ring-2 ring-amber-500' : 'hover:shadow-lg'}`}
                    onClick={() => setSelectedAI(tool.name)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        {tool.icon}
                        <CardTitle>{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{tool.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">Great for:</h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.strengths.map((strength, i) => (
                            <span key={i} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedAI && (
                <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="text-xl font-bold mb-3">Try it out!</h3>
                  <p className="mb-4">
                  Most AI tools need an adult&apos;s help to set up. Ask your parents or teachers to help you explore {selectedAI}!
                  </p>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => setActiveTab("activities")}
                  >
                    Try Our AI Activities
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Activities Section */}
          {activeTab === "activities" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-amber-600">AI Activities</h2>
              
              {/* Chat with AI Buddy */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-amber-500" />
                    Chat with AIBuddy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                    {robotMessages.map((message, index) => (
                      <div key={index} className="mb-3">
                        {message.startsWith("You:") ? (
                          <div className="flex justify-end">
                            <div className="bg-blue-100 rounded-lg py-2 px-4 max-w-xs">
                              {message}
                            </div>
                          </div>
                        ) : message.startsWith("AIBuddy:") ? (
                          <div className="flex">
                            <div className="bg-amber-100 rounded-lg py-2 px-4 max-w-xs">
                              {message}
                            </div>
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="bg-amber-100 rounded-lg py-2 px-4 max-w-xs">
                              {message}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          simulateChat(userInput);
                        }
                      }}
                      placeholder="Ask something about AI..."
                      className="flex-grow p-2 border rounded-lg"
                    />
                    <Button 
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => simulateChat(userInput)}
                    >
                      Send
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Try asking:</p>
                    <ul className="list-disc pl-5">
                      <li>What is AI?</li>
                      <li>How do robots work?</li>
                      <li>Can AI make games?</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Coding Activity Preview */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-6 w-6 text-amber-500" />
                    Simple Coding with AI Helper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm mb-4">
                  <p className="text-green-400">{/* This is a simple program that uses AI */}</p>
                  <p className="text-purple-400">function</p> <span className="text-yellow-400">makeRobotMove</span>() &#123;
                  <p className="pl-4"><span className="text-purple-400">if</span> (obstacleAhead()) &#123;</p>
                  <p className="pl-8 text-blue-300">robot.turn(&quot;right&quot;);</p>
                    <p className="pl-4">&#125; <span className="text-purple-400">else</span> &#123;</p>
                    <p className="pl-8 text-blue-300">robot.moveForward();</p>
                    <p className="pl-4">&#125;</p>
                    &#125;
                  </div>
                  <p className="mb-4">
                    With AI, you can teach a robot to make decisions! Above is a simple example of code that helps a robot navigate around obstacles.
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      Coming Soon: Coding Playground
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Art Studio Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-6 w-6 text-amber-500" />
                    AI Art Studio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-200 rounded-lg p-2 aspect-square flex items-center justify-center">
                      <span className="text-gray-500">Space Robot</span>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-2 aspect-square flex items-center justify-center">
                      <span className="text-gray-500">Flying Dragon</span>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-2 aspect-square flex items-center justify-center">
                      <span className="text-gray-500">Underwater City</span>
                    </div>
                  </div>
                  <p className="mb-4">
                    AI can help create amazing art from your imagination! Describe what you want to see, and watch the AI bring it to life.
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      Coming Soon: AI Art Creator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quiz Section */}
          {activeTab === "quiz" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-amber-600">AI Quiz Challenge</h2>
              
              {!showResult ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                      <span className="text-sm font-medium">Score: {score}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-6">{quizQuestions[currentQuestion].question}</h3>
                    
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          className="w-full justify-start text-left p-4 h-auto bg-white hover:bg-amber-50 text-gray-800 border border-gray-200"
                          onClick={() => answerQuestion(index)}
                        >
                          <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      {score === quizQuestions.length 
                        ? "Perfect Score! Amazing!" 
                        : score >= Math.floor(quizQuestions.length / 2) 
                          ? "Good Job! You're learning about AI!" 
                          : "Keep Learning About AI!"}
                    </h3>
                    
                    <div className="text-6xl mb-6">
                      {score === quizQuestions.length 
                        ? "🎉" 
                        : score >= Math.floor(quizQuestions.length / 2)
                          ? "👍" 
                          : "🤔"}
                    </div>
                    
                    <p className="mb-6">You got {score} out of {quizQuestions.length} questions right!</p>
                    
                    <div className="flex justify-center space-x-4">
                      <Button 
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={resetQuiz}
                      >
                        Try Again
                      </Button>
                      <Button 
                        className="bg-white border border-amber-500 text-amber-500 hover:bg-amber-50"
                        onClick={() => setActiveTab("intro")}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-8 bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-xl font-bold mb-3 text-amber-600">AI Learning Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Remember that AI is a tool created by humans to help us solve problems.</span>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Ask questions and experiment to discover what AI can do.</span>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Remember that AI is a tool created by humans to help us solve problems.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t mt-auto">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-gray-600">© 2025 BrainBounce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}