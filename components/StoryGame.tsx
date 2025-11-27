import React, { useEffect, useState, useCallback } from 'react';
import { StoryLevel } from '../types';
import { generateStoryLevel } from '../services/gemini';
import { Button } from './Button';

interface StoryGameProps {
  onEndGame: (score: number, total: number) => void;
  onBack: () => void;
}

export const StoryGame: React.FC<StoryGameProps> = ({ onEndGame, onBack }) => {
  const [level, setLevel] = useState<StoryLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const loadStory = useCallback(async () => {
    setLoading(true);
    const storyData = await generateStoryLevel();
    setLevel(storyData);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  const handleAnswer = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
    
    if (level && option === level.correctAnswer) {
      setFeedback('correct');
      setTimeout(() => onEndGame(1, 1), 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => onEndGame(0, 1), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="text-6xl animate-pulse">📚</div>
        <h2 className="text-2xl font-bold text-purple-600">Writing a Story...</h2>
        <p className="text-gray-500">Wait a moment for a new adventure!</p>
      </div>
    );
  }

  if (!level) {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-red-500">Failed to load story.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      );
  }

  return (
    <div className="max-w-xl mx-auto w-full pb-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">✕ Exit</button>
        <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">Story Mode</div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border-b-4 border-purple-200">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">{level.title}</h2>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
            <p className="text-lg leading-relaxed text-gray-700 font-medium">
            {level.story}
            </p>
        </div>
        
        <div className="mt-6">
            <p className="text-blue-600 font-bold mb-3">❓ {level.question}</p>
            <div className="grid grid-cols-1 gap-2">
                {level.options.map((opt, idx) => (
                    <Button 
                        key={idx}
                        variant={
                            feedback && opt === level.correctAnswer ? 'primary' :
                            feedback && opt === selectedOption && opt !== level.correctAnswer ? 'danger' :
                            'secondary'
                        }
                        className={feedback && opt === level.correctAnswer ? '!bg-green-500 !border-green-700' : ''}
                        onClick={() => handleAnswer(opt)}
                    >
                        {opt}
                    </Button>
                ))}
            </div>
        </div>
      </div>
      
      {feedback === 'correct' && (
          <div className="text-center text-2xl font-bold text-green-500 animate-bounce">
              Correct! Great Job! 🎉
          </div>
      )}
       {feedback === 'incorrect' && (
          <div className="text-center text-2xl font-bold text-red-500">
             Try again next time!
          </div>
      )}
    </div>
  );
};