import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface QuestionCardProps {
  question: string;
  date: string;
}

const QuestionCard = ({ question, date }: QuestionCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg animate-fade-in">
      <CardHeader className="flex items-center space-x-2 pb-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span className="text-sm text-gray-500">{date}</span>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold text-primary-dark text-center">
          {question}
        </h2>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;