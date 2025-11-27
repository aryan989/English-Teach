import React, { useState } from 'react';
import { VocabQuestion } from '../types';
import { generateVocabQuestions } from '../services/gemini';
import { Button } from './Button';

interface VocabGameProps {
  onEndGame: (score: number, total: number) => void;
  onBack: () => void;
}

interface Topic {
  id: string;
  label: string;
  th: string;
  emoji: string;
}

const TOPICS: Topic[] = [
  { id: 'Animals', label: 'Animals', th: 'สัตว์', emoji: '🐘' },
  { id: 'Fruits', label: 'Fruits', th: 'ผลไม้', emoji: '🍎' },
  { id: 'School', label: 'School', th: 'โรงเรียน', emoji: '🎒' },
  { id: 'Family', label: 'Family', th: 'ครอบครัว', emoji: '👨‍👩‍👧' },
  { id: 'Colors', label: 'Colors', th: 'สี', emoji: '🎨' },
  { id: 'Sports', label: 'Sports', th: 'กีฬา', emoji: '⚽' },
  { id: 'Food', label: 'Food', th: 'อาหาร', emoji: '🍜' },
  { id: 'Weather', label: 'Weather', th: 'สภาพอากาศ', emoji: '🌤️' },
  { id: 'Jobs', label: 'Jobs', th: 'อาชีพ', emoji: '👨‍⚕️' },
  { id: 'Random', label: 'Surprise Me', th: 'สุ่มคำถาม', emoji: '🎲' },
];

type GamePhase = 'SELECTION' | 'LOADING' | 'PLAYING' | 'ERROR';

export const VocabGame: React.FC<VocabGameProps> = ({ onEndGame, onBack }) => {
  const [phase, setPhase] = useState<GamePhase>('SELECTION');
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [customTopicInput, setCustomTopicInput] = useState('');

  const startQuiz = async (topic: Topic) => {
    setPhase('LOADING');
    
    let searchTopic = topic.id;
    if (topic.id === 'Random') {
      const realTopics = TOPICS.filter(t => t.id !== 'Random');
      const randomTopic = realTopics[Math.floor(Math.random() * realTopics.length)];
      searchTopic = randomTopic.id;
      setCurrentTopic(randomTopic);
    } else {
      setCurrentTopic(topic);
    }

    try {
      const qs = await generateVocabQuestions(searchTopic);
      if (qs && qs.length > 0) {
        setQuestions(qs);
        setPhase('PLAYING');
      } else {
        setPhase('ERROR');
      }
    } catch (e) {
      setPhase('ERROR');
    }
  };

  const handleCustomTopicSubmit = () => {
    if (!customTopicInput.trim()) return;
    const newTopic: Topic = {
        id: customTopicInput,
        label: customTopicInput,
        th: 'หัวข้อของคุณ', // Your topic
        emoji: '✨'
    };
    startQuiz(newTopic);
  };

  const handleAnswer = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    
    // Auto-play pronunciation on correct answer for reinforcement
    if (option === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
      speakWord(questions[currentIndex].correctAnswer);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        onEndGame(score + (option === questions[currentIndex].correctAnswer ? 1 : 0), questions.length);
      }
    }, 1500);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  if (phase === 'SELECTION') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-medium">✕ Back</button>
          <h2 className="text-xl font-bold text-blue-600">Choose Topic</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pb-4">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => startQuiz(topic)}
              className="bg-white hover:bg-blue-50 border-b-4 border-gray-200 hover:border-blue-300 active:border-b-0 active:mt-1 active:mb-[-1px] transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{topic.emoji}</span>
              <span className="font-bold text-gray-800 leading-tight">{topic.label}</span>
              <span className="text-xs text-gray-400 font-medium">{topic.th}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-gray-700 font-bold mb-2 text-sm">
                Or type your own topic! <span className="text-gray-400 font-normal">(หัวข้ออื่นๆ)</span>
            </label>
            <div className="flex gap-2">
                <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTopicSubmit()}
                placeholder="e.g. Space, Dinosaurs, Minecraft..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-400 focus:outline-none transition-colors w-full"
                />
                <Button 
                    onClick={handleCustomTopicSubmit} 
                    size="sm" 
                    disabled={!customTopicInput.trim()}
                    className={!customTopicInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                Go
                </Button>
            </div>
        </div>
      </div>
    );
  }

  if (phase === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="text-6xl animate-bounce">{currentTopic?.emoji || '🐘'}</div>
        <h2 className="text-2xl font-bold text-blue-600">Loading {currentTopic?.label}...</h2>
        <p className="text-gray-500">Preparing fun words for you!</p>
      </div>
    );
  }

  if (phase === 'ERROR' || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-red-500 text-xl font-bold">Oops! Could not load questions.</p>
        <Button onClick={() => setPhase('SELECTION')}>Try Again</Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">✕ Exit</button>
        <div className="bg-white px-4 py-1 rounded-full shadow text-blue-600 font-bold">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
            <div 
                className="h-full bg-green-400 transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
        </div>
        <div className="text-6xl mb-4 animate-bounce-short">{currentQ.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
        <p className="text-gray-400 text-sm mb-4">Select the correct English word</p>
        
        <button 
          onClick={() => speakWord(currentQ.correctAnswer)}
          className="mx-auto flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full font-bold transition-colors text-sm"
        >
          🔊 Listen
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((option, idx) => {
            let btnVariant: 'secondary' | 'primary' | 'danger' = 'secondary';
            if (showFeedback) {
                if (option === currentQ.correctAnswer) btnVariant = 'primary'; // Greenish via CSS override or assume primary is correct-like
                else if (option === selectedOption) btnVariant = 'danger';
            }

            return (
                <Button 
                    key={idx} 
                    variant={btnVariant}
                    className={`w-full py-4 text-lg ${showFeedback && option === currentQ.correctAnswer ? '!bg-green-500 !border-green-700 !text-white' : ''}`}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                >
                    {option}
                </Button>
            )
        })}
      </div>
    </div>
  );
};