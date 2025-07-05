import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-400 animate-pulse" />
          <p className="text-gray-700 font-medium">
            Your health matters. We're here to help
          </p>
          <Heart className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
        <p className="text-sm text-gray-600">
          ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ଆମର ପ୍ରାଥମିକତା
        </p>
        <div className="mt-4 text-xs text-gray-500">
          <p>© 2025 Village Health Sathi • Made with ❤️ for rural communities</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;