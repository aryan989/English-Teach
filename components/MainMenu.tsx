import React from 'react';
import { AppMode } from '../types';
import { Button } from './Button';

interface MainMenuProps {
  onSelectMode: (mode: AppMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="text-7xl mb-4">🐘</div>
        <h1 className="text-4xl font-black text-blue-600 tracking-tight">Sanuk English</h1>
        <p className="text-gray-500 font-medium">Fun English for Thai Kids!</p>
      </div>

      <div className="w-full space-y-4 px-4">
        <Button 
            variant="accent" 
            size="lg" 
            className="w-full text-left justify-between group"
            onClick={() => onSelectMode(AppMode.VOCAB)}
        >
            <div className="flex flex-col items-start">
                <span className="text-2xl font-bold">Vocabulary Quiz</span>
                <span className="text-sm text-yellow-800 opacity-75">คำศัพท์น่ารู้</span>
            </div>
            <span className="text-4xl group-hover:scale-110 transition-transform">🦁</span>
        </Button>

        <Button 
            variant="primary" 
            size="lg" 
            className="w-full text-left justify-between group"
            onClick={() => onSelectMode(AppMode.STORY)}
        >
             <div className="flex flex-col items-start">
                <span className="text-2xl font-bold">Story Time</span>
                <span className="text-sm text-blue-100 opacity-90">นิทานหรรษา</span>
            </div>
            <span className="text-4xl group-hover:scale-110 transition-transform">📚</span>
        </Button>
      </div>
      
      <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">Your Progress</h3>
          <div className="flex justify-around text-center">
              <div>
                  <div className="text-2xl font-bold text-gray-800">⭐</div>
                  <div className="text-xs text-gray-500">Stars</div>
              </div>
               <div>
                  <div className="text-2xl font-bold text-gray-800">🏆</div>
                  <div className="text-xs text-gray-500">Rank</div>
              </div>
          </div>
      </div>
    </div>
  );
};