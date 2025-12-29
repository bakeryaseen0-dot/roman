
import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '../types';

interface TriviaPanelProps {
  question: TriviaQuestion;
  onAnswer: (correct: boolean) => void;
  timer: number;
  disabled?: boolean;
}

const TriviaPanel: React.FC<TriviaPanelProps> = ({ question, onAnswer, timer, disabled = false }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered || disabled) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    setTimeout(() => {
      onAnswer(idx === question.correctIndex);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="parchment w-full max-w-2xl rounded-2xl border-8 border-[#8b4513] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#8b4513] text-yellow-400 px-6 py-2 rounded-full border-4 border-[#3d2b1f] text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-clock"></i>
          {timer}
        </div>

        <div className="text-center mb-8">
          <span className="bg-[#8b4513] text-white px-4 py-1 rounded-lg text-sm mb-4 inline-block">{question.category}</span>
          <h2 className="text-3xl font-bold text-[#2d1a01] arabic-font leading-relaxed">
            {question.question}
          </h2>
          {disabled && (
            <p className="text-red-600 font-bold mt-2 animate-pulse">خصمك يقوم بالإجابة حالياً...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => {
            let bgColor = disabled ? 'bg-gray-200 text-gray-500' : 'bg-[#f8edeb] hover:bg-[#fae1dd] text-[#2d1a01]';
            let borderColor = 'border-[#8b4513]';

            if (isAnswered) {
              if (idx === question.correctIndex) {
                bgColor = 'bg-green-500 text-white';
                borderColor = 'border-green-700';
              } else if (idx === selectedIdx) {
                bgColor = 'bg-red-500 text-white';
                borderColor = 'border-red-700';
              }
            } else if (selectedIdx === idx) {
              bgColor = 'bg-[#8b4513] text-white';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || disabled}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 text-xl font-semibold rounded-xl border-b-4 transition-all duration-200 transform ${!disabled ? 'hover:scale-[1.02] active:scale-95' : ''} ${bgColor} ${borderColor}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
            <img src="https://www.freeiconspng.com/uploads/swords-png-20.png" className="w-24 sword-glow" alt="Swords" />
        </div>
      </div>
    </div>
  );
};

export default TriviaPanel;
