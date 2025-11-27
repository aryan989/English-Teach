import React from 'react';
import { Button } from './Button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface ResultsScreenProps {
  score: number;
  total: number;
  onHome: () => void;
  onReplay: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onHome, onReplay }) => {
  const percentage = Math.round((score / total) * 100);
  let message = "Keep Trying!";
  let emoji = "💪";
  
  if (percentage === 100) { message = "Perfect!"; emoji = "🏆"; }
  else if (percentage >= 70) { message = "Great Job!"; emoji = "🌟"; }
  else if (percentage >= 50) { message = "Good!"; emoji = "👍"; }

  const data = [
    { name: 'Your Score', value: score },
    { name: 'Total', value: total },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-6 animate-fade-in-up">
      <div className="text-8xl mb-2 animate-bounce-short">{emoji}</div>
      
      <div className="text-center">
        <h2 className="text-4xl font-black text-gray-800 mb-2">{message}</h2>
        <p className="text-xl text-gray-500">You got <span className="text-blue-600 font-bold">{score}</span> out of {total}</p>
      </div>

      <div className="w-full h-48 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fontWeight: 600}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                 {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#e5e7eb'} />
                  ))}
              </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>

      <div className="w-full space-y-3">
        <Button variant="primary" onClick={onReplay} className="w-full">Play Again</Button>
        <Button variant="secondary" onClick={onHome} className="w-full">Back to Menu</Button>
      </div>
    </div>
  );
};