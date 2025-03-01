"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calculator, Newspaper, Sparkles, LucideCode } from "lucide-react";

export default function Home() {
  const activities = [
    {
      title: "Multiplication Tables",
      description: "Master multiplication tables with a fun interactive game",
      icon: <Calculator className="h-10 w-10 text-blue-500" />,
      color: "from-blue-50 to-blue-100",
      href: "/multiply",
      available: true
    },
    {
      title: "Blog",
      description: "Explore educational articles and learning tips",
      icon: <Newspaper className="h-10 w-10 text-purple-500" />,
      color: "from-purple-50 to-purple-100",
      href: "/blog",
      available: false
    },
    {
      title: "Reading Activities",
      description: "Improve reading skills through engaging exercises",
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      color: "from-green-50 to-green-100",
      href: "/reading",
      available: false
    },
    {
      title: "Coding with AI for Kids",
      description: "Learn about AI and coding concepts through interactive activities",
      icon: <LucideCode className="h-10 w-10 text-amber-500" />,
      color: "from-amber-50 to-amber-100",
      href: "/coding",
      available: true
    }
  ];
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="w-full bg-white py-8 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 space-y-6 mb-8 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-gray-800"
              >
                BrainBounce
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-gray-600"
              >
                Fun, interactive learning activities to help children develop essential skills
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/multiply">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg">
                    Start Learning
                  </Button>
                </Link>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
              >
                <Image 
                  src="/banner2.svg" 
                  alt="BrainBounce" 
                  width={600}
                  height={400}
                  className="rounded-xl shadow-xl" 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activities Section */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800">Learning Activities</h2>
          </motion.div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our range of educational activities designed to make learning engaging and effective
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <CardContent className={`p-0 h-full`}>
                  <div className={`bg-gradient-to-br ${activity.color} p-6 h-full flex flex-col`}>
                    <div className="mb-4">
                      {activity.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <p className="text-gray-700 mb-6 flex-grow">{activity.description}</p>
                    <div>
                      {activity.available ? (
                        <Link href={activity.href}>
                          <Button className="bg-white text-gray-800 hover:bg-gray-100">
                            Start Activity
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="bg-gray-200 text-gray-500 cursor-not-allowed">
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-gray-600">© 2025 BrainBounce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}