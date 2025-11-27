import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { VocabGame } from './components/VocabGame';
import { StoryGame } from './components/StoryGame';
import { ResultsScreen } from './components/ResultsScreen';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.MENU);
  const [lastScore, setLastScore] = useState({ score: 0, total: 0 });

  const handleEndGame = (score: number, total: number) => {
    setLastScore({ score, total });
    setMode(AppMode.RESULTS);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.MENU:
        return <MainMenu onSelectMode={setMode} />;
      case AppMode.VOCAB:
        return (
          <VocabGame 
            onEndGame={handleEndGame} 
            onBack={() => setMode(AppMode.MENU)} 
          />
        );
      case AppMode.STORY:
        return (
          <StoryGame 
            onEndGame={handleEndGame} 
            onBack={() => setMode(AppMode.MENU)} 
          />
        );
      case AppMode.RESULTS:
        return (
          <ResultsScreen 
            score={lastScore.score} 
            total={lastScore.total} 
            onHome={() => setMode(AppMode.MENU)}
            onReplay={() => setMode(lastScore.total > 1 ? AppMode.VOCAB : AppMode.STORY)}
          />
        );
      default:
        return <MainMenu onSelectMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col">
      {/* Top Navbar Style Decoration */}
      <div className="bg-blue-500 h-2 w-full"></div>
      
      <main className="flex-grow p-6 flex flex-col relative max-w-2xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-300 text-xs font-medium">
        Powered by Gemini • Made for Thailand 🇹🇭
      </footer>
    </div>
  );
}