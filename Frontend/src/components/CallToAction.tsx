import React from 'react';
import { Download, MapPin } from 'lucide-react';

const CallToAction: React.FC = () => {
  const handleDownloadAdvice = () => {
    console.log('Download advice as PDF');
  };

  const handleFindClinic = () => {
    console.log('Find nearby clinic');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mx-2 sm:mx-0">
        <button
          onClick={handleDownloadAdvice}
          aria-label="Download health advice as PDF"
          className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300/50"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <h4 className="font-semibold text-white text-sm sm:text-lg leading-tight">
                Download Advice
              </h4>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                ପରାମର୍ଶ ଡାଉନଲୋଡ୍ କରନ୍ତୁ
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={handleFindClinic}
          aria-label="Find nearby medical clinic"
          className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-400 to-pink-500 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300/50"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <h4 className="font-semibold text-white text-sm sm:text-lg leading-tight">
                Find Nearby Clinic
              </h4>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                ନିକଟସ୍ଥ ଏକ କ୍ଲିନିକ୍ ଖୋଜ
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CallToAction;