import React from 'react';
import { Stethoscope } from 'lucide-react';

const WelcomeCard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/30 mx-2 sm:mx-0">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
            ନମସ୍କାର! Namaskar! 🙏
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-medium px-2">
            How can I help you today?
          </p>
          <p className="text-bold text-gray-600 mt-1 sm:mt-2 px-2">
            ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;