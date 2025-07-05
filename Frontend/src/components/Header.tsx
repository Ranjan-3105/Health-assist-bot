import React from 'react';
import { Heart, Globe } from 'lucide-react';

interface HeaderProps {
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, setSelectedLanguage }) => {
  const languages = ['Odia', 'Hindi', 'English', 'Bengali'];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-sm sm:text-xl font-bold text-gray-800 truncate">ସାହାAI</h1>
        </div>

        <div className="relative flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/40 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm border border-white/30 shadow-sm">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Select language"
              className="bg-transparent text-xs sm:text-sm font-medium text-gray-700 border-none outline-none cursor-pointer focus:ring-0 min-w-0"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
