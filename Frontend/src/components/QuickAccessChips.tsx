import React from 'react';
import { Thermometer, Wind, Baby, Ban as Bandage } from 'lucide-react';

const quickHelpOptions = [
  { icon: Thermometer, label: 'Fever', hindi: 'ଜ୍ୱର', color: 'from-red-400 to-orange-500' },
  { icon: Wind, label: 'Cough', hindi: 'କାଶ', color: 'from-blue-400 to-cyan-500' },
  { icon: Baby, label: 'Child Care', hindi: 'ଶିଶୁ ଯତ୍ନ', color: 'from-pink-400 to-rose-500' },
  { icon: Bandage, label: 'Wound Care', hindi: 'କ୍ଷତ ଚିକିତ୍ସା', color: 'from-green-400 to-emerald-500' }
];

const QuickAccessChips: React.FC = () => {
  const handleQuickHelp = (option: string) => {
    // Handle quick help option selection
    console.log(`Selected: ${option}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center px-4">
        Quick Help • ତୁରନ୍ତ ସହାୟତା
      </h3>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mx-2 sm:mx-0">
        {quickHelpOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <button
              key={index}
              onClick={() => handleQuickHelp(option.label)}
              aria-label={`Get help with ${option.label} - ${option.hindi}`}
              className={`group p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm bg-gradient-to-br ${option.color} hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30`}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm sm:text-lg mb-1">
                  {option.label}
                </h4>
                <p className="text-white/80 text-xs sm:text-sm leading-tight">
                  {option.hindi}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessChips;